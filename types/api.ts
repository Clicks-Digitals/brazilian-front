export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  detail?: string;
  message?: string;
};

export type Category = {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  image?: string | null;
  parent?: number | null;
  is_active?: boolean;
  show_in_nav?: boolean;
  display_order?: number;
  seo_title?: string;
  seo_description?: string;
  product_count?: number;
};

export type ProductImage = {
  id: number;
  image?: string;
  url?: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
};

export type ProductVariant = {
  id: number;
  name: string;
  sku: string;
  price: string;
  compare_at_price?: string | null;
  stock_quantity: number;
  weight_label?: string;
  image?: string | null;
  is_active?: boolean;
  in_stock?: boolean;
};

export type Product = {
  id: number;
  name: string;
  name_ar?: string;
  slug: string;
  sku?: string;
  short_description?: string;
  description?: string;
  tasting_notes?: string;
  roast_level?: string;
  origin?: string;
  is_active?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  is_promotional?: boolean;
  allow_backorder?: boolean;
  seo_title?: string;
  seo_description?: string;
  category?: Category | number | null;
  category_slug?: string;
  images?: ProductImage[];
  primary_image?: ProductImage | string | null;
  variants?: ProductVariant[];
  default_variant?: ProductVariant | null;
  default_variant_id?: number | null;
  price?: string;
  compare_at_price?: string | null;
  min_price?: string;
  max_price?: string;
  in_stock?: boolean;
  related?: Product[];
  related_products?: Product[];
};

export type Banner = {
  id: number;
  title: string;
  subtitle?: string;
  cta_label?: string;
  cta_url?: string;
  secondary_cta_label?: string;
  secondary_cta_url?: string;
  desktop_image?: string | null;
  mobile_image?: string | null;
  alignment?: "left" | "center" | "right";
  placement?: "hero" | "promo" | "category";
  is_active?: boolean;
  display_order?: number;
  starts_at?: string | null;
  ends_at?: string | null;
};

export type Announcement = {
  id: number;
  text: string;
  link_url?: string;
  is_active?: boolean;
  dismissible?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  display_order?: number;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string | null;
  category?: { id: number; name: string; slug: string } | null;
  author?: { id: number; email?: string; first_name?: string; last_name?: string } | null;
  status?: "draft" | "scheduled" | "published" | string;
  is_featured?: boolean;
  published_at?: string | null;
  related_products?: Product[];
  related_articles?: Article[];
  seo_title?: string;
  seo_description?: string;
  og_image?: string | null;
};

export type LegalPage = {
  slug: string;
  title: string;
  content: string;
  is_published?: boolean;
  updated_at?: string;
};

export type StoreSettings = {
  store_name?: string;
  store_name_ar?: string;
  phone?: string;
  email?: string;
  about?: string;
  story?: string;
  currency?: string;
  social?: Record<string, string>;
  branches?: Array<{ name: string; city?: string; address?: string; phone?: string }>;
  delivery?: {
    fee?: string | number;
    free_over?: string | number;
    cities?: string[];
    notes?: string;
  };
  homepage?: {
    sections?: Array<{ key: string; enabled?: boolean }>;
  };
  announcement?: { text?: string };
  [key: string]: unknown;
};

export type StorefrontPayload = {
  announcements?: Announcement[];
  banners?: Banner[];
  hero_banners?: Banner[];
  promo_banners?: Banner[];
  categories?: Category[];
  featured_categories?: Category[];
  featured_products?: Product[];
  new_products?: Product[];
  journal?: Article[];
  articles?: Article[];
  settings?: StoreSettings | Record<string, unknown>;
};

export type CartItem = {
  id: number;
  quantity: number;
  unit_price?: string;
  line_total?: string;
  product_name?: string;
  product_slug?: string;
  variant_name?: string;
  sku?: string;
  image?: string | null;
  stock_quantity?: number;
  variant?:
    | number
    | (ProductVariant & {
        product?: Pick<Product, "id" | "name" | "slug" | "primary_image">;
      });
  product?: Pick<Product, "id" | "name" | "slug" | "primary_image" | "tasting_notes">;
};

export type Cart = {
  id?: number;
  token: string;
  items: CartItem[];
  item_count?: number;
  subtotal?: string;
  discount_amount?: string;
  discount_code?: string | null;
  delivery_fee?: string;
  total?: string;
  currency?: string;
};

export type Address = {
  id: number;
  label?: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  area?: string;
  country?: string;
  delivery_instructions?: string;
  is_default?: boolean;
};

export type OrderItem = {
  id?: number;
  product_name: string;
  variant_name?: string;
  sku?: string;
  quantity: number;
  unit_price: string;
  line_total: string;
};

export type Order = {
  id: number;
  order_number: string;
  email: string;
  customer_name: string;
  phone: string;
  shipping_line1?: string;
  shipping_line2?: string;
  shipping_city?: string;
  shipping_area?: string;
  shipping_country?: string;
  delivery_instructions?: string;
  notes?: string;
  internal_notes?: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  subtotal: string;
  discount_amount?: string;
  discount_code?: string;
  delivery_fee?: string;
  total: string;
  currency?: string;
  placed_at?: string;
  updated_at?: string;
  items?: OrderItem[];
  history?: Array<{
    id?: number;
    from_status?: string;
    to_status?: string;
    note?: string;
    created_at?: string;
  }>;
  user?: number | null;
};

export type AuthUser = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  user_type?: string;
  role?: { id: number; name: string; slug?: string } | null;
  permissions?: string[];
  marketing_opt_in?: boolean;
  loyalty_consent?: boolean;
  date_of_birth?: string | null;
};

export type AuthTokens = {
  access: string;
  refresh: string;
  user?: AuthUser;
};

export type LoyaltyStatus = {
  configured: boolean;
  points?: number;
  tier?: string;
  message?: string;
  wallet_pass_url?: string;
  [key: string]: unknown;
};

export type Discount = {
  id: number;
  code: string;
  name: string;
  discount_type: "percentage" | "fixed" | string;
  value: string;
  min_order_amount?: string;
  max_discount_amount?: string | null;
  usage_limit?: number | null;
  per_customer_limit?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
};

export type NewsletterSubscriber = {
  id: number;
  email: string;
  is_active?: boolean;
  source?: string;
  consented_at?: string;
};

export type AuditLog = {
  id: number;
  actor?: { id: number; email?: string } | string | null;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string | null;
  created_at: string;
};

export type AdminRole = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  permissions?: Array<{ id: number; code: string; module?: string; action?: string } | string>;
  is_system?: boolean;
};

export type DashboardData = {
  sales?: { total?: string; paid?: string; unpaid_cod?: string; currency?: string };
  revenue?: { total?: string; currency?: string } | string;
  orders?: { count?: number; pending?: number } | number;
  orders_count?: number;
  customers?: { count?: number } | number;
  products?: { count?: number; low_stock?: number } | number;
  active_products?: number;
  low_stock?: { count?: number; items?: Array<{ sku: string; name: string; stock_quantity: number }> } | number;
  published_articles?: number;
  sales_over_time?: Array<{
    date?: string;
    day?: string;
    total?: string;
    orders?: number;
    revenue?: string;
  }>;
  top_products?: Array<{ name: string; sku?: string; quantity?: number; revenue?: string }>;
  best_sellers?: Array<{ name: string; sku?: string; quantity?: number; revenue?: string }>;
  recent_orders?: Array<{
    order_number: string;
    customer_name: string;
    status: string;
    payment_status?: string;
    total: string;
  }>;
  orders_by_status?: Record<string, number>;
  [key: string]: unknown;
};

export type PermissionCode =
  | "dashboard.view"
  | "orders.view"
  | "orders.edit"
  | "orders.export"
  | "products.view"
  | "products.create"
  | "products.edit"
  | "products.delete"
  | "products.publish"
  | "categories.view"
  | "categories.create"
  | "categories.edit"
  | "categories.delete"
  | "banners.view"
  | "banners.create"
  | "banners.edit"
  | "banners.delete"
  | "discounts.view"
  | "discounts.create"
  | "discounts.edit"
  | "discounts.delete"
  | "customers.view"
  | "customers.edit"
  | "articles.view"
  | "articles.create"
  | "articles.edit"
  | "articles.delete"
  | "articles.publish"
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "roles.view"
  | "roles.edit"
  | "settings.manage"
  | "audit.view"
  | "newsletter.view"
  | string;
