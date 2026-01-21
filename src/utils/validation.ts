// Validation helper functions

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - accepts digits, spaces, dashes, parentheses
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10;
};

export const validateCardNumber = (cardNumber: string): boolean => {
  // Remove dashes and spaces, check if 16 digits
  const digitsOnly = cardNumber.replace(/\D/g, '');
  return digitsOnly.length === 16;
};

export const validateExpiryDate = (date: string): boolean => {
  // Format: MM/YY
  const dateRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const [month, year] = date.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);

  if (expiryYear < currentYear) {
    return false;
  }
  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return false;
  }

  return true;
};

export const validateCVV = (cvv: string): boolean => {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

export const validateMinLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};
