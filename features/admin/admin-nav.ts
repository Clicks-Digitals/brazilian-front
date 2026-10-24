import type { LucideIcon } from "lucide-react";
import {
  FolderTree,
  Image,
  LayoutDashboard,
  Mail,
  Megaphone,
  Newspaper,
  Package,
  Percent,
  ScrollText,
  Settings,
  Shield,
  ShoppingBag,
  UserCog,
  Users,
} from "lucide-react";

export const ADMIN_NAV: Array<{
  href: string;
  label: string;
  permission: string;
  group: string;
  icon: LucideIcon;
}> = [
  { href: "/admin", label: "Dashboard", permission: "dashboard.view", group: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", permission: "orders.view", group: "Commerce", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", permission: "products.view", group: "Commerce", icon: Package },
  { href: "/admin/categories", label: "Categories", permission: "categories.view", group: "Commerce", icon: FolderTree },
  { href: "/admin/discounts", label: "Discounts", permission: "discounts.view", group: "Commerce", icon: Percent },
  { href: "/admin/customers", label: "Customers", permission: "customers.view", group: "Commerce", icon: Users },
  { href: "/admin/banners", label: "Banners", permission: "banners.view", group: "Content", icon: Image },
  { href: "/admin/announcements", label: "Announcements", permission: "banners.view", group: "Content", icon: Megaphone },
  { href: "/admin/articles", label: "Articles", permission: "articles.view", group: "Content", icon: Newspaper },
  { href: "/admin/newsletter", label: "Newsletter", permission: "newsletter.view", group: "House", icon: Mail },
  { href: "/admin/settings", label: "Settings", permission: "settings.manage", group: "House", icon: Settings },
  { href: "/admin/users", label: "Users", permission: "users.view", group: "Staff", icon: UserCog },
  { href: "/admin/roles", label: "Roles", permission: "roles.view", group: "Staff", icon: Shield },
  { href: "/admin/audit", label: "Audit log", permission: "audit.view", group: "Staff", icon: ScrollText },
];
