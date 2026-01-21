import type {
  CheckoutFormData,
  CheckoutFormErrors,
  ShippingErrors,
  PaymentErrors,
} from '../types/checkout';

/* ========== BASIC VALIDATORS ========== */

/**
 * Kiểm tra giá trị không rỗng
 */
export const validateRequired = (value: string): string | undefined => {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
  return undefined;
};

/**
 * Kiểm tra độ dài tối thiểu
 */
export const validateMinLength = (
  value: string,
  min: number
): string | undefined => {
  if (value.trim().length < min) {
    return `Must be at least ${min} characters`;
  }
  return undefined;
};

/**
 * Kiểm tra format email
 * Regex: basic email validation
 */
export const validateEmail = (email: string): string | undefined => {
  const required = validateRequired(email);
  if (required) return required;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

/**
 * Kiểm tra format số điện thoại
 * Chấp nhận: +84 xxx, 0xxx, với hoặc không có dấu cách/gạch
 */
export const validatePhone = (phone: string): string | undefined => {
  const required = validateRequired(phone);
  if (required) return required;

  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Accept: starts with + or 0, followed by 9-15 digits
  const phoneRegex = /^(\+?\d{1,4}|\d{1})\d{8,14}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return 'Please enter a valid phone number';
  }
  return undefined;
};

/**
 * Kiểm tra card number (16 chữ số sau khi bỏ dấu -)
 */
export const validateCardNumber = (cardNumber: string): string | undefined => {
  const required = validateRequired(cardNumber);
  if (required) return required;

  // Remove dashes and spaces
  const cleanNumber = cardNumber.replace(/[-\s]/g, '');
  
  // Check if 16 digits
  if (!/^\d{16}$/.test(cleanNumber)) {
    return 'Card number must be 16 digits';
  }
  
  // Basic Luhn algorithm check (optional but recommended)
  // if (!luhnCheck(cleanNumber)) {
  //   return 'Please enter a valid card number';
  // }
  
  return undefined;
};

/**
 * Luhn algorithm để validate card number
 */
const luhnCheck = (cardNumber: string): boolean => {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Kiểm tra expiry date (MM/YY) và không quá hạn
 */
export const validateExpiryDate = (date: string): string | undefined => {
  const required = validateRequired(date);
  if (required) return required;

  // Check format MM/YY
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(date)) {
    return 'Please use MM/YY format';
  }

  // Check if not expired
  const [month, year] = date.split('/');
  const expMonth = parseInt(month, 10);
  const expYear = parseInt('20' + year, 10);
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return 'Card has expired';
  }

  return undefined;
};

/**
 * Kiểm tra CVV (3-4 chữ số)
 */
export const validateCVV = (cvv: string): string | undefined => {
  const required = validateRequired(cvv);
  if (required) return required;

  if (!/^\d{3,4}$/.test(cvv)) {
    return 'CVV must be 3 or 4 digits';
  }
  return undefined;
};

/**
 * Kiểm tra postal code
 */
export const validatePostalCode = (postalCode: string): string | undefined => {
  const required = validateRequired(postalCode);
  if (required) return required;

  // Accept 5-10 alphanumeric characters (flexible for different countries)
  if (!/^[A-Za-z0-9\s-]{3,10}$/.test(postalCode)) {
    return 'Please enter a valid postal code';
  }
  return undefined;
};

/* ========== FORM VALIDATORS ========== */

/**
 * Validate shipping info
 */
export const validateShippingInfo = (
  shipping: CheckoutFormData['shippingInfo']
): ShippingErrors => {
  const errors: ShippingErrors = {};

  errors.name = validateRequired(shipping.name) || validateMinLength(shipping.name, 2);
  errors.phone = validatePhone(shipping.phone);
  errors.email = validateEmail(shipping.email);
  errors.postalCode = validatePostalCode(shipping.postalCode);
  errors.streetAddress = validateRequired(shipping.streetAddress) || validateMinLength(shipping.streetAddress, 5);
  errors.detailAddress = validateRequired(shipping.detailAddress);

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v !== undefined)
  ) as ShippingErrors;
};

/**
 * Validate payment info
 */
export const validatePaymentInfo = (
  payment: CheckoutFormData['paymentInfo']
): PaymentErrors => {
  const errors: PaymentErrors = {};

  errors.method = validateRequired(payment.method);

  // Only validate card details if payment method is card
  if (payment.method === 'credit_card' || payment.method === 'debit_card') {
    errors.cardNumber = validateCardNumber(payment.cardNumber);
    errors.expiryDate = validateExpiryDate(payment.expiryDate);
    errors.cvv = validateCVV(payment.cvv);
  }

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v !== undefined)
  ) as PaymentErrors;
};

/**
 * Validate toàn bộ form
 */
export const validateCheckoutForm = (
  formData: CheckoutFormData
): CheckoutFormErrors => {
  return {
    shipping: validateShippingInfo(formData.shippingInfo),
    payment: validatePaymentInfo(formData.paymentInfo),
  };
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors: CheckoutFormErrors): boolean => {
  return (
    Object.keys(errors.shipping).length > 0 ||
    Object.keys(errors.payment).length > 0
  );
};

/* ========== FORMAT HELPERS ========== */

/**
 * Auto-format card number: 1234-5678-9012-3456
 */
export const formatCardNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Limit to 16 digits
  const limited = digits.slice(0, 16);
  
  // Add dashes every 4 digits
  const parts = limited.match(/.{1,4}/g) || [];
  return parts.join('-');
};

/**
 * Auto-format expiry date: MM/YY
 */
export const formatExpiryDate = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Limit to 4 digits
  const limited = digits.slice(0, 4);
  
  // Format as MM/YY
  if (limited.length >= 2) {
    return limited.slice(0, 2) + '/' + limited.slice(2);
  }
  return limited;
};

/**
 * Format CVV (only digits, max 4)
 */
export const formatCVV = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

/**
 * Generate order ID
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Calculate estimated delivery date (5-7 business days)
 */
export const calculateEstimatedDelivery = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7); // Add 7 days
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
