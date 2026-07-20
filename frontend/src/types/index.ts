export interface VariantOption {
  value: string;
  price?: number;
  available?: boolean;
}

export interface ProductVariant {
  name: string; // "Color", "Storage", "Size"
  options: string[] | VariantOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  badge?: "new" | "sale" | "hot" | "bestseller";
  inStock: boolean;
  description: string;
  features?: string[];
  variants?: ProductVariant[];
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  image: string;
  color: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  product?: string;
  verified: boolean;
  images?: string[];
  helpfulCount?: number;
}

export interface FlashSaleItem {
  product: Product;
  saleEndTime: string;
  soldPercent: number;
}

export interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  transactionId: string;
}

export interface OrderSummaryData {
  items: any[]; // CartItem[]
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Tracking {
  orderId: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  history: TrackingEvent[];
}

export type NotificationType = "ORDER" | "PAYMENT" | "PROMOTION" | "SECURITY" | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  orderId?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  orders: boolean;
  promotions: boolean;
  security: boolean;
}
