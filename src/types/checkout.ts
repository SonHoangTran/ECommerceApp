// Type definitions for checkout

export interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  streetAddress: string;
  detailAddress: string;
  deliveryNotes?: string;
}

export interface PaymentInfo {
  method: 'credit' | 'debit' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CheckoutFormData {
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
}

export interface OrderSummary {
  items: unknown[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
