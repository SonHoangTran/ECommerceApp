import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrderConfirmationData } from '../types/checkout';

/* ========== STYLES ========== */
const styles = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#27ae60',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: 'white',
    fontSize: 40,
  },
  title: {
    textAlign: 'center' as const,
    color: '#27ae60',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center' as const,
    color: '#666',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid #e0e0e0',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: 500,
  },
  itemList: {
    marginTop: 16,
  },
  item: {
    display: 'flex',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #eee',
  },
  itemImage: {
    width: 50,
    height: 50,
    objectFit: 'cover' as const,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: '2px solid #ddd',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: 600,
  },
  buttonGroup: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    marginTop: 40,
  },
  primaryButton: {
    padding: '12px 32px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '12px 32px',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 16,
    cursor: 'pointer',
  },
  notFound: {
    textAlign: 'center' as const,
    padding: 60,
  },
};

/* ========== COMPONENT ========== */
export const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderConfirmationData | null>(null);

  useEffect(() => {
    // Get order data from sessionStorage
    const storedData = sessionStorage.getItem('orderConfirmation');
    if (storedData) {
      setOrderData(JSON.parse(storedData));
      // Clear after reading (optional - prevent refresh showing same order)
      // sessionStorage.removeItem('orderConfirmation');
    }
  }, []);

  /* ---------- NO ORDER DATA ---------- */
  if (!orderData) {
    return (
      <div style={styles.notFound}>
        <h2>No order found</h2>
        <p>It looks like you haven't placed an order yet.</p>
        <button
          style={styles.primaryButton}
          onClick={() => navigate('/products')}
        >
          Browse Products
        </button>
      </div>
    );
  }

  const { orderId, orderDate, estimatedDelivery, shippingInfo, paymentInfo, orderSummary } =
    orderData;

  const formattedOrderDate = new Date(orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const paymentMethodLabel = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    paypal: 'PayPal',
  }[paymentInfo.method];

  /* ---------- MAIN RENDER ---------- */
  return (
    <div style={styles.container}>
      {/* Success Header */}
      <div style={styles.successIcon}>✓</div>
      <h1 style={styles.title}>Order Placed Successfully!</h1>
      <p style={styles.subtitle}>
        Thank you for your purchase. Your order has been confirmed.
      </p>

      {/* Order Info */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Order Information</h3>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Order ID</span>
          <span style={styles.infoValue}>{orderId}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Order Date</span>
          <span style={styles.infoValue}>{formattedOrderDate}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Estimated Delivery</span>
          <span style={styles.infoValue}>{estimatedDelivery}</span>
        </div>
      </div>

      {/* Shipping Info */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Shipping Address</h3>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Recipient</span>
          <span style={styles.infoValue}>{shippingInfo.name}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Phone</span>
          <span style={styles.infoValue}>{shippingInfo.phone}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Email</span>
          <span style={styles.infoValue}>{shippingInfo.email}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Address</span>
          <span style={styles.infoValue}>
            {shippingInfo.streetAddress}, {shippingInfo.detailAddress},{' '}
            {shippingInfo.postalCode}
          </span>
        </div>
        {shippingInfo.deliveryNotes && (
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Notes</span>
            <span style={styles.infoValue}>{shippingInfo.deliveryNotes}</span>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Payment Method</h3>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Method</span>
          <span style={styles.infoValue}>{paymentMethodLabel}</span>
        </div>
        {paymentInfo.method !== 'paypal' && paymentInfo.cardLastFour && (
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Card</span>
            <span style={styles.infoValue}>
              **** **** **** {paymentInfo.cardLastFour}
            </span>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Order Summary</h3>

        <div style={styles.itemList}>
          {orderSummary.items.map((item) => (
            <div key={item.id} style={styles.item}>
              <img src={item.thumbnail} alt={item.title} style={styles.itemImage} />
              <div style={styles.itemInfo}>
                <p style={{ margin: 0, fontWeight: 500 }}>{item.title}</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <strong>${item.total.toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <div style={styles.totalSection}>
          <div style={styles.totalRow}>
            <span>Subtotal</span>
            <span>${orderSummary.subtotal.toFixed(2)}</span>
          </div>
          {orderSummary.discount > 0 && (
            <div style={{ ...styles.totalRow, color: '#27ae60' }}>
              <span>Discount</span>
              <span>-${orderSummary.discount.toFixed(2)}</span>
            </div>
          )}
          <div style={styles.totalRow}>
            <span>Shipping</span>
            <span>
              {orderSummary.shippingFee === 0
                ? 'Free'
                : `$${orderSummary.shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div style={{ ...styles.totalRow, ...styles.grandTotal, marginTop: 12 }}>
            <span>Total</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonGroup}>
        <button
          style={styles.secondaryButton}
          onClick={() => window.print()}
        >
          Print Receipt
        </button>
        <button
          style={styles.primaryButton}
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
