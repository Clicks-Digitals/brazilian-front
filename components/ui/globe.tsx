"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { COFFEE_ORIGINS, HOUSE_DESTINATION, type GlobeFocusId } from "@/lib/coffee-origins";

type OrbitLike = {
  enableZoom: boolean;
  enablePan: boolean;
  zoomSpeed: number;
  zoomToCursor: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  mouseButtons?: { MIDDLE?: number };
  touches?: { TWO?: number };
  _onMouseWheel?: (event: WheelEvent) => void;
  addEventListener: (type: string, fn: () => void) => void;
  removeEventListener: (type: string, fn: () => void) => void;
  domElement?: HTMLElement;
};

type GlobeApi = GlobeMethods & {
  globeMaterial: () => {
    color: { set: (value: string) => void };
    emissive: { set: (value: string) => void };
    specular?: { set: (value: string) => void };
    emissiveIntensity: number;
    shininess: number;
  };
  controls: () => OrbitLike;
  renderer: () => { domElement: HTMLElement; setPixelRatio: (value: number) => void };
};

const GOLD = "#d4b46a";
const ATMOSPHERE = "#8ec4e8";
const VIEW_ALTITUDE = 2.2;
const EARTH_TEXTURE = "/assets/earth-blue-marble.jpg";
const EARTH_BUMP = "/assets/earth-topology.png";

type Marker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: "origin" | "house";
};

function targetFor(id: GlobeFocusId) {
  if (id === "jordan") return HOUSE_DESTINATION;
  return COFFEE_ORIGINS.find((origin) => origin.id === id);
}

function lockGlobe(globe: GlobeApi) {
  const controls = globe.controls();
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.zoomSpeed = 0;
  controls.zoomToCursor = false;
  if (controls.mouseButtons) controls.mouseButtons.MIDDLE = -1;
  if (controls.touches) controls.touches.TWO = 0;
  const canvas = controls.domElement || globe.renderer().domElement;
  if (canvas && controls._onMouseWheel) {
    canvas.removeEventListener("wheel", controls._onMouseWheel);
  }
}

export function CoffeeGlobe({
  labels,
  focusId,
  className,
}: {
  labels: Record<string, string>;
  focusId?: GlobeFocusId | null;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState(0);
  const [ready, setReady] = useState(false);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const sync = () => {
      const width = Math.round(el.getBoundingClientRect().width);
      if (width > 0) setSize(width);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const markers: Marker[] = useMemo(
    () => [
      ...COFFEE_ORIGINS.map((origin) => ({
        id: origin.id,
        lat: origin.lat,
        lng: origin.lng,
        label: labels[origin.id],
        kind: "origin" as const,
      })),
      {
        id: HOUSE_DESTINATION.id,
        lat: HOUSE_DESTINATION.lat,
        lng: HOUSE_DESTINATION.lng,
        label: labels.jordan,
        kind: "house" as const,
      },
    ],
    [labels],
  );

  const arcs = useMemo(
    () =>
      COFFEE_ORIGINS.map((origin, index) => ({
        startLat: origin.lat,
        startLng: origin.lng,
        endLat: HOUSE_DESTINATION.lat,
        endLng: HOUSE_DESTINATION.lng,
        gap: index * 0.18,
      })),
    [],
  );

  const flyTo = useCallback((id: GlobeFocusId | null | undefined, duration = 1100) => {
    const globe = globeRef.current as GlobeApi | undefined;
    const target = id ? targetFor(id) : null;
    if (!globe || !target) return;
    globe.controls().autoRotate = false;
    globe.pointOfView({ lat: target.lat, lng: target.lng, altitude: VIEW_ALTITUDE }, duration);
    lockGlobe(globe);
  }, []);

  const paint = useCallback(() => {
    const globe = globeRef.current as GlobeApi | undefined;
    if (!globe) return;
    const material = globe.globeMaterial();
    material.color.set("#ffffff");
    material.emissive.set("#071018");
    material.specular?.set("#6ea7c9");
    material.emissiveIntensity = 0.12;
    material.shininess = 14;
    const controls = globe.controls();
    controls.autoRotate = !reduceMotion && !focusId;
    controls.autoRotateSpeed = 0.45;
    const opening = (focusId && targetFor(focusId)) || { lat: 8, lng: 8 };
    globe.pointOfView({ lat: opening.lat, lng: opening.lng, altitude: VIEW_ALTITUDE }, 0);
    lockGlobe(globe);
    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const overlay = globe.renderer().domElement.parentElement;
    if (overlay) {
      overlay.style.direction = "ltr";
      overlay.style.position = "relative";
      Array.from(overlay.children).forEach((child) => {
        if (!(child instanceof HTMLElement) || child.tagName === "CANVAS") return;
        child.style.left = "0";
        child.style.top = "0";
        child.style.right = "0";
        child.style.width = "100%";
        child.style.height = "100%";
        child.style.direction = "ltr";
      });
    }
    setReady(true);
  }, [focusId, reduceMotion]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !ready) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const globe = globeRef.current;
        if (!globe) return;
        if (entry.isIntersecting) globe.resumeAnimation();
        else globe.pauseAnimation();
      },
      { threshold: 0.12, rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  useEffect(() => {
    const globe = globeRef.current as GlobeApi | undefined;
    const wrap = wrapRef.current;
    if (!globe || !wrap || !ready) return;
    lockGlobe(globe);

    const stopWheel = (event: WheelEvent) => {
      event.stopImmediatePropagation();
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    };
    const stopPinch = (event: TouchEvent) => {
      if (event.touches.length < 2) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const stopGesture = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const opts: AddEventListenerOptions = { capture: true, passive: false };
    wrap.addEventListener("wheel", stopWheel, opts);
    wrap.addEventListener("touchstart", stopPinch, opts);
    wrap.addEventListener("touchmove", stopPinch, opts);
    wrap.addEventListener("gesturestart", stopGesture, opts);
    wrap.addEventListener("gesturechange", stopGesture, opts);

    return () => {
      wrap.removeEventListener("wheel", stopWheel, opts);
      wrap.removeEventListener("touchstart", stopPinch, opts);
      wrap.removeEventListener("touchmove", stopPinch, opts);
      wrap.removeEventListener("gesturestart", stopGesture, opts);
      wrap.removeEventListener("gesturechange", stopGesture, opts);
    };
  }, [ready]);

  useEffect(() => {
    flyTo(focusId);
    if (!focusId || reduceMotion) return;
    const resume = window.setTimeout(() => {
      const globe = globeRef.current;
      if (globe) globe.controls().autoRotate = true;
    }, 4200);
    return () => window.clearTimeout(resume);
  }, [flyTo, focusId, reduceMotion]);

  const htmlElement = useCallback((data: object) => {
    const marker = data as Marker;
    const wrap = document.createElement("div");
    wrap.className = `origin-pin origin-pin-${marker.kind}`;
    wrap.dir = "ltr";
    wrap.innerHTML = `<span class="origin-pin-inner"><span class="origin-pin-dot"></span><span class="origin-pin-name" dir="auto">${marker.label}</span></span>`;
    return wrap;
  }, []);

  return (
    <div ref={wrapRef} className={className} dir="ltr" style={{ touchAction: "none" }}>
      {size > 0 ? (
      <Globe
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={EARTH_TEXTURE}
        bumpImageUrl={EARTH_BUMP}
        showGlobe
        showAtmosphere
        atmosphereColor={ATMOSPHERE}
        atmosphereAltitude={0.16}
        onGlobeReady={() => {
          let tries = 0;
          const tick = () => {
            if (globeRef.current) {
              paint();
              return;
            }
            tries += 1;
            if (tries < 30) window.requestAnimationFrame(tick);
          };
          tick();
        }}
        arcsData={arcs}
        arcColor={() => [GOLD, "rgba(255,255,255,0.85)"]}
        arcStroke={0.45}
        arcDashLength={0.32}
        arcDashGap={0.7}
        arcDashInitialGap="gap"
        arcDashAnimateTime={reduceMotion ? 0 : 2400}
        arcAltitudeAutoScale={0.38}
        ringsData={markers}
        ringColor={(d: object) =>
          (d as Marker).id === focusId ? GOLD : (d as Marker).kind === "house" ? GOLD : "rgba(212,180,106,0.55)"
        }
        ringMaxRadius={(d: object) => ((d as Marker).id === focusId ? 3.4 : (d as Marker).kind === "house" ? 3 : 2.1)}
        ringPropagationSpeed={reduceMotion ? 0 : 1.5}
        ringRepeatPeriod={reduceMotion ? 0 : 1700}
        htmlElementsData={markers}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.02}
        htmlElement={htmlElement}
        htmlElementVisibilityModifier={(el, visible) => {
          el.style.opacity = visible ? "1" : "0";
        }}
        enablePointerInteraction={false}
      />
      ) : null}
    </div>
  );
}
