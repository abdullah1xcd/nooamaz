export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CREDIT_CARD' | 'VODAFONE_CASH';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  category: string;
  categoryNameAr: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. '#10001'
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  courierEtaMinutes?: number;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: OrderStatus;
    label: string;
    timestamp: string;
    note?: string;
  }[];
}

export type EventType = 
  | 'ORDER_CREATED' 
  | 'ORDER_CONFIRMED' 
  | 'PAYMENT_WEBHOOK' 
  | 'ORDER_PREPARED'
  | 'ORDER_SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED';

export interface WebhookEventLog {
  id: string;
  event: EventType;
  orderId: string;
  timestamp: string;
  source: 'CUSTOMER_APP' | 'NESTJS_BACKEND' | 'PAYMENT_GATEWAY' | 'SHIPPING_CARRIER';
  payload: Record<string, unknown>;
  dispatchedTo: {
    email: boolean;
    pushFCM: boolean;
    whatsapp: boolean;
    adminSlack: boolean;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'ORDER_UPDATE' | 'PROMO' | 'SYSTEM';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export type ViewPerspective = 'CUSTOMER' | 'ADMIN' | 'AUTOMATION' | 'BACKEND' | 'ROADMAP';
