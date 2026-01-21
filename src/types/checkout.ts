import type { CartItem } from './cart';

/* ========== SHIPPING INFO ========== */
export interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  streetAddress: string;
  detailAddress: string;
  deliveryNotes: string;
}

/* ========== PAYMENT INFO ========== */
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal';

export interface PaymentInfo {
  method: PaymentMethod;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

/* ========== CHECKOUT FORM DATA ========== */
export interface CheckoutFormData {
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
}

/* ========== ORDER SUMMARY ========== */
export interface OrderSummary {
  items: CartItem[];  // ← Đảm bảo import CartItem đúng
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

/* ========== FORM ERRORS ========== */
export interface ShippingErrors {
  name?: string;
  phone?: string;
  email?: string;
  postalCode?: string;
  streetAddress?: string;
  detailAddress?: string;
}

export interface PaymentErrors {
  method?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface CheckoutFormErrors {
  shipping: ShippingErrors;
  payment: PaymentErrors;
}

/* ========== ORDER CONFIRMATION ========== */
export interface OrderConfirmationData {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  shippingInfo: ShippingInfo;
  paymentInfo: {
    method: PaymentMethod;
    cardLastFour: string;
  };
  orderSummary: OrderSummary;
}
