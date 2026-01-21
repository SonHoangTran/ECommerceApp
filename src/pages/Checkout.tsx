import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useAuthContext } from '../context/AuthContext';
import type {
  CheckoutFormData,
  CheckoutFormErrors,
  PaymentMethod,
  OrderConfirmationData,
} from '../types/checkout';
import {
  validateCheckoutForm,
  hasErrors,
  formatCardNumber,
  formatExpiryDate,
  formatCVV,
  generateOrderId,
  calculateEstimatedDelivery,
  validateEmail,
  validatePhone,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  validateRequired,
  validatePostalCode,
  validateMinLength,
} from '../utils/validation';
import { updateUserAddress } from '../api/users';

/* ========== INITIAL FORM STATE ========== */
const initialFormData: CheckoutFormData = {
  shippingInfo: {
    name: '',
    phone: '',
    email: '',
    postalCode: '',
    streetAddress: '',
    detailAddress: '',
    deliveryNotes: '',
  },
  paymentInfo: {
    method: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  },
};

const initialErrors: CheckoutFormErrors = {
  shipping: {},
  payment: {},
};

/* ========== STYLES ========== */
const styles = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: 20,
    display: 'flex',
    gap: 40,
    flexWrap: 'wrap' as const,
  },
  formSection: {
    flex: '1 1 600px',
  },
  summarySection: {
    flex: '1 1 350px',
    position: 'sticky' as const,
    top: 20,
    alignSelf: 'flex-start' as const,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2px solid #e0e0e0',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: 500,
    fontSize: 14,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    boxSizing: 'border-box' as const,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    minHeight: 80,
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: 6,
    cursor: 'pointer',
  },
  radioLabelSelected: {
    borderColor: '#3498db',
    backgroundColor: '#f0f8ff',
  },
  cardDetails: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 8,
  },
  summaryItem: {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #eee',
  },
  summaryItemImage: {
    width: 60,
    height: 60,
    objectFit: 'cover' as const,
    borderRadius: 6,
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTop: '2px solid #ddd',
    fontWeight: 600,
    fontSize: 18,
  },
  submitButton: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
  emptyCart: {
    textAlign: 'center' as const,
    padding: 40,
  },
};

/* ========== COMPONENT ========== */
export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearAll } = useCartContext();
  const { user } = useAuthContext();
  
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<CheckoutFormErrors>(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- HANDLERS ---------- */

  // Handle shipping field change
  const handleShippingChange = (
    field: keyof CheckoutFormData['shippingInfo'],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        [field]: value,
      },
    }));

    // Real-time validation
    let error: string | undefined;
    switch (field) {
      case 'name':
        error = validateRequired(value) || validateMinLength(value, 2);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'postalCode':
        error = validatePostalCode(value);
        break;
      case 'streetAddress':
        error = validateRequired(value) || validateMinLength(value, 5);
        break;
      case 'detailAddress':
        error = validateRequired(value);
        break;
    }

    setErrors((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [field]: error,
      },
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        method,
        // Clear card details if switching to PayPal
        ...(method === 'paypal' && {
          cardNumber: '',
          expiryDate: '',
          cvv: '',
        }),
      },
    }));

    // Clear card errors if PayPal
    if (method === 'paypal') {
      setErrors((prev) => ({
        ...prev,
        payment: {
          method: undefined,
        },
      }));
    }
  };

  // Handle payment field change with formatting
  const handlePaymentChange = (
    field: keyof CheckoutFormData['paymentInfo'],
    value: string
  ) => {
    let formattedValue = value;
    let error: string | undefined;

    switch (field) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        error = validateCardNumber(formattedValue);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        error = validateExpiryDate(formattedValue);
        break;
      case 'cvv':
        formattedValue = formatCVV(value);
        error = validateCVV(formattedValue);
        break;
    }

    setFormData((prev) => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        [field]: formattedValue,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: error,
      },
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateCheckoutForm(formData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Update user address (simulate API call)
      if (user?.id) {
        await updateUserAddress(user.id, {
          address: formData.shippingInfo.streetAddress,
          city: formData.shippingInfo.detailAddress,
          postalCode: formData.shippingInfo.postalCode,
        });
      }

      // 2. Clear cart
      await clearAll();

      // 3. Create order confirmation data
      const orderConfirmation: OrderConfirmationData = {
        orderId: generateOrderId(),
        orderDate: new Date().toISOString(),
        estimatedDelivery: calculateEstimatedDelivery(),
        shippingInfo: formData.shippingInfo,
        paymentInfo: {
          method: formData.paymentInfo.method,
          cardLastFour: formData.paymentInfo.cardNumber.slice(-4),
        },
        orderSummary: {
          items: cart?.products || [],
          subtotal: cart?.total || 0,
          discount: (cart?.total || 0) - (cart?.discountedTotal || 0),
          shippingFee: 0, // Free shipping
          total: cart?.discountedTotal || 0,
        },
      };

      // 4. Store order data and navigate
      sessionStorage.setItem('orderConfirmation', JSON.stringify(orderConfirmation));
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- RENDER HELPERS ---------- */

  const isCardPayment =
    formData.paymentInfo.method === 'credit_card' ||
    formData.paymentInfo.method === 'debit_card';

  // Calculate totals
  const subtotal = cart?.total || 0;
  const discount = subtotal - (cart?.discountedTotal || 0);
  const shippingFee: number = 0;
  const total = (cart?.discountedTotal || 0) + shippingFee;

  /* ---------- EMPTY CART ---------- */
  if (!cart || cart.products.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <p>Add some products before checkout</p>
        <button
          onClick={() => navigate('/products')}
          style={{ ...styles.submitButton, width: 'auto', marginTop: 20 }}
        >
          Browse Products
        </button>
      </div>
    );
  }

  /* ---------- MAIN RENDER ---------- */
  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.container}>
        {/* ========== FORM SECTIONS ========== */}
        <div style={styles.formSection}>
          {/* ----- SHIPPING INFORMATION ----- */}
          <section>
            <h2 style={styles.sectionTitle}>Shipping Information</h2>

            {/* Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Recipient Name *</label>
              <input
                type="text"
                style={{
                  ...styles.input,
                  ...(errors.shipping.name && styles.inputError),
                }}
                value={formData.shippingInfo.name}
                onChange={(e) => handleShippingChange('name', e.target.value)}
                placeholder="Enter full name"
                data-error={!!errors.shipping.name}
              />
              {errors.shipping.name && (
                <p style={styles.errorText}>{errors.shipping.name}</p>
              )}
            </div>

            {/* Phone & Email */}
            <div style={styles.row}>
              <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                <label style={styles.label}>Phone *</label>
                <input
                  type="tel"
                  style={{
                    ...styles.input,
                    ...(errors.shipping.phone && styles.inputError),
                  }}
                  value={formData.shippingInfo.phone}
                  onChange={(e) => handleShippingChange('phone', e.target.value)}
                  placeholder="+84 xxx xxx xxxx"
                  data-error={!!errors.shipping.phone}
                />
                {errors.shipping.phone && (
                  <p style={styles.errorText}>{errors.shipping.phone}</p>
                )}
              </div>

              <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  style={{
                    ...styles.input,
                    ...(errors.shipping.email && styles.inputError),
                  }}
                  value={formData.shippingInfo.email}
                  onChange={(e) => handleShippingChange('email', e.target.value)}
                  placeholder="email@example.com"
                  data-error={!!errors.shipping.email}
                />
                {errors.shipping.email && (
                  <p style={styles.errorText}>{errors.shipping.email}</p>
                )}
              </div>
            </div>

            {/* Postal Code & Street Address */}
            <div style={styles.row}>
              <div style={{ ...styles.formGroup, flex: '0 0 150px' }}>
                <label style={styles.label}>Postal Code *</label>
                <input
                  type="text"
                  style={{
                    ...styles.input,
                    ...(errors.shipping.postalCode && styles.inputError),
                  }}
                  value={formData.shippingInfo.postalCode}
                  onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                  placeholder="12345"
                  data-error={!!errors.shipping.postalCode}
                />
                {errors.shipping.postalCode && (
                  <p style={styles.errorText}>{errors.shipping.postalCode}</p>
                )}
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Street Address *</label>
                <input
                  type="text"
                  style={{
                    ...styles.input,
                    ...(errors.shipping.streetAddress && styles.inputError),
                  }}
                  value={formData.shippingInfo.streetAddress}
                  onChange={(e) => handleShippingChange('streetAddress', e.target.value)}
                  placeholder="123 Main Street"
                  data-error={!!errors.shipping.streetAddress}
                />
                {errors.shipping.streetAddress && (
                  <p style={styles.errorText}>{errors.shipping.streetAddress}</p>
                )}
              </div>
            </div>

            {/* Detail Address */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Detailed Address *</label>
              <input
                type="text"
                style={{
                  ...styles.input,
                  ...(errors.shipping.detailAddress && styles.inputError),
                }}
                value={formData.shippingInfo.detailAddress}
                onChange={(e) => handleShippingChange('detailAddress', e.target.value)}
                placeholder="Apartment, suite, unit, building, floor, etc."
                data-error={!!errors.shipping.detailAddress}
              />
              {errors.shipping.detailAddress && (
                <p style={styles.errorText}>{errors.shipping.detailAddress}</p>
              )}
            </div>

            {/* Delivery Notes */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Notes (Optional)</label>
              <textarea
                style={styles.textarea}
                value={formData.shippingInfo.deliveryNotes}
                onChange={(e) => handleShippingChange('deliveryNotes', e.target.value)}
                placeholder="Special instructions for delivery"
              />
            </div>
          </section>

          {/* ----- PAYMENT INFORMATION ----- */}
          <section style={{ marginTop: 40 }}>
            <h2 style={styles.sectionTitle}>Payment Information</h2>

            {/* Payment Method */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Method *</label>
              <div style={styles.radioGroup}>
                {[
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'debit_card', label: 'Debit Card' },
                  { value: 'paypal', label: 'PayPal' },
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      ...styles.radioLabel,
                      ...(formData.paymentInfo.method === option.value &&
                        styles.radioLabelSelected),
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={formData.paymentInfo.method === option.value}
                      onChange={() =>
                        handlePaymentMethodChange(option.value as PaymentMethod)
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Card Details - Only show for card payments */}
            {isCardPayment && (
              <div style={styles.cardDetails}>
                {/* Card Number */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Card Number *</label>
                  <input
                    type="text"
                    style={{
                      ...styles.input,
                      ...(errors.payment.cardNumber && styles.inputError),
                    }}
                    value={formData.paymentInfo.cardNumber}
                    onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                    placeholder="1234-5678-9012-3456"
                    maxLength={19}
                    data-error={!!errors.payment.cardNumber}
                  />
                  {errors.payment.cardNumber && (
                    <p style={styles.errorText}>{errors.payment.cardNumber}</p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div style={styles.row}>
                  <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                    <label style={styles.label}>Expiry Date *</label>
                    <input
                      type="text"
                      style={{
                        ...styles.input,
                        ...(errors.payment.expiryDate && styles.inputError),
                      }}
                      value={formData.paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      data-error={!!errors.payment.expiryDate}
                    />
                    {errors.payment.expiryDate && (
                      <p style={styles.errorText}>{errors.payment.expiryDate}</p>
                    )}
                  </div>

                  <div style={{ ...styles.formGroup, ...styles.halfWidth }}>
                    <label style={styles.label}>CVV *</label>
                    <input
                      type="password"
                      style={{
                        ...styles.input,
                        ...(errors.payment.cvv && styles.inputError),
                      }}
                      value={formData.paymentInfo.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      data-error={!!errors.payment.cvv}
                    />
                    {errors.payment.cvv && (
                      <p style={styles.errorText}>{errors.payment.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PayPal message */}
            {formData.paymentInfo.method === 'paypal' && (
              <div style={{ ...styles.cardDetails, backgroundColor: '#fff8e1' }}>
                <p style={{ margin: 0, color: '#f57c00' }}>
                  You will be redirected to PayPal to complete your payment after
                  placing the order.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ========== ORDER SUMMARY ========== */}
        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <h2 style={styles.sectionTitle}>Order Summary</h2>

            {/* Cart Items */}
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 20 }}>
              {cart.products.map((item) => (
                <div key={item.id} style={styles.summaryItem}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={styles.summaryItemImage}
                  />
                  <div style={styles.summaryItemInfo}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>
                      {item.title}
                    </p>
                    <p style={{ margin: '4px 0 0', color: '#666', fontSize: 13 }}>
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <strong>${item.total.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div style={{ ...styles.summaryRow, color: '#27ae60' }}>
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
            </div>

            <div style={styles.summaryTotal}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isSubmitting && styles.submitButtonDisabled),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
