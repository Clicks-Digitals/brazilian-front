const ALLOWED = new Set(["P", "BR", "STRONG", "B", "EM", "I", "A", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE"]);

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") {
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/javascript:/gi, "");
  }
  const template = document.createElement("template");
  template.innerHTML = html;
  const walk = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (!ALLOWED.has(el.tagName)) {
          const text = document.createTextNode(el.textContent || "");
          el.replaceWith(text);
          continue;
        }
        for (const attr of Array.from(el.attributes)) {
          if (attr.name.startsWith("on") || attr.value.startsWith("javascript:")) {
            el.removeAttribute(attr.name);
          }
          if (el.tagName !== "A" && attr.name !== "href") {
            if (attr.name !== "href") el.removeAttribute(attr.name);
          }
        }
        if (el.tagName === "A") {
          const href = el.getAttribute("href") || "";
          if (!href.startsWith("/") && !href.startsWith("http") && !href.startsWith("mailto:")) {
            el.removeAttribute("href");
          }
          el.setAttribute("rel", "noopener noreferrer");
        }
        walk(el);
      }
    }
  };
  walk(template.content);
  return template.innerHTML;
}

export function isProbablyHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}
