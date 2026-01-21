/**
 * Error Message Component
 * 
 * Mục đích:
 * - Hiển thị error messages theo cách user-friendly
 * - Cung cấp retry button khi error có thể retry
 * - Hỗ trợ nhiều variants cho các loại error khác nhau
 * 
 * Variants:
 * - inline: Hiển thị error nhỏ, inline
 * - banner: Hiển thị banner error ở top
 * - card: Hiển thị error trong card
 * - fullPage: Hiển thị error chiếm toàn trang
 */

import type { CSSProperties } from 'react';
import { ErrorCode, type AppError } from '../../utils/errorHandler';

/* ========== TYPES ========== */

interface ErrorMessageProps {
  /** Error object hoặc message string */
  error: AppError | string;
  /** Variant hiển thị */
  variant?: 'inline' | 'banner' | 'card' | 'fullPage';
  /** Callback khi user click Retry */
  onRetry?: () => void;
  /** Callback khi user click Dismiss/Close */
  onDismiss?: () => void;
  /** Custom title (override default) */
  title?: string;
  /** Hiển thị icon hay không */
  showIcon?: boolean;
}

/* ========== STYLES ========== */

const styles: Record<string, CSSProperties> = {
  // Inline variant
  inline: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 6,
    color: '#dc2626',
    fontSize: 14,
  },
  
  // Banner variant
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#fef2f2',
    borderBottom: '1px solid #fecaca',
    color: '#dc2626',
  },
  
  // Card variant
  card: {
    padding: 24,
    backgroundColor: '#fff',
    border: '1px solid #fecaca',
    borderRadius: 8,
    textAlign: 'center' as const,
  },
  
  // Full page variant
  fullPage: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: 40,
    textAlign: 'center' as const,
  },
  
  // Icon
  icon: {
    flexShrink: 0,
  },
  
  // Content wrapper
  content: {
    flex: 1,
  },
  
  // Title
  title: {
    margin: 0,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 600,
    color: '#dc2626',
  },
  
  // Message
  message: {
    margin: 0,
    color: '#666',
    lineHeight: 1.5,
  },
  
  // Button group
  buttonGroup: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
    justifyContent: 'center',
  },
  
  // Retry button
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  
  // Dismiss button
  dismissButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
  },
  
  // Close button (for banner)
  closeButton: {
    padding: 4,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#dc2626',
    cursor: 'pointer',
    fontSize: 20,
    lineHeight: 1,
  },
};

/* ========== HELPER FUNCTIONS ========== */

/**
 * Lấy icon SVG cho error type
 */
const getErrorIcon = (code?: ErrorCode): string => {
  switch (code) {
    case ErrorCode.NETWORK_ERROR:
      return '🌐'; // Network icon
    case ErrorCode.UNAUTHORIZED:
      return '🔒'; // Lock icon
    case ErrorCode.NOT_FOUND:
      return '🔍'; // Search icon
    case ErrorCode.SERVER_ERROR:
      return '⚠️'; // Warning icon
    default:
      return '❌'; // Error icon
  }
};

/**
 * Lấy title mặc định cho error type
 */
const getDefaultTitle = (code?: ErrorCode): string => {
  switch (code) {
    case ErrorCode.NETWORK_ERROR:
      return 'Connection Error';
    case ErrorCode.UNAUTHORIZED:
      return 'Session Expired';
    case ErrorCode.FORBIDDEN:
      return 'Access Denied';
    case ErrorCode.NOT_FOUND:
      return 'Not Found';
    case ErrorCode.SERVER_ERROR:
      return 'Server Error';
    case ErrorCode.TIMEOUT_ERROR:
      return 'Request Timeout';
    default:
      return 'Something Went Wrong';
  }
};

/**
 * Parse error prop thành AppError object
 */
const parseError = (error: AppError | string): AppError => {
  if (typeof error === 'string') {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error,
    };
  }
  return error;
};

/* ========== SUB-COMPONENTS ========== */

/**
 * Inline Error
 * Hiển thị error nhỏ, thường dùng trong form
 */
const InlineError = ({
  error,
  showIcon,
  onDismiss,
}: {
  error: AppError;
  showIcon: boolean;
  onDismiss?: () => void;
}) => (
  <div style={styles.inline}>
    {showIcon && <span style={styles.icon}>{getErrorIcon(error.code)}</span>}
    <span style={styles.content}>{error.message}</span>
    {onDismiss && (
      <button 
        style={styles.closeButton} 
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        ×
      </button>
    )}
  </div>
);

/**
 * Banner Error
 * Hiển thị error banner ở top của page/section
 */
const BannerError = ({
  error,
  showIcon,
  onDismiss,
  onRetry,
}: {
  error: AppError;
  showIcon: boolean;
  onDismiss?: () => void;
  onRetry?: () => void;
}) => (
  <div style={styles.banner}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {showIcon && <span style={styles.icon}>{getErrorIcon(error.code)}</span>}
      <span>{error.message}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {onRetry && (
        <button
          style={{ ...styles.retryButton, padding: '6px 12px' }}
          onClick={onRetry}
        >
          Retry
        </button>
      )}
      {onDismiss && (
        <button 
          style={styles.closeButton} 
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  </div>
);

/**
 * Card Error
 * Hiển thị error trong card format
 */
const CardError = ({
  error,
  title,
  showIcon,
  onRetry,
  onDismiss,
}: {
  error: AppError;
  title?: string;
  showIcon: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}) => (
  <div style={styles.card}>
    {showIcon && (
      <div style={{ fontSize: 48, marginBottom: 16 }}>
        {getErrorIcon(error.code)}
      </div>
    )}
    <h3 style={styles.title}>{title || getDefaultTitle(error.code)}</h3>
    <p style={styles.message}>{error.message}</p>
    {(onRetry || onDismiss) && (
      <div style={styles.buttonGroup}>
        {onRetry && (
          <button style={styles.retryButton} onClick={onRetry}>
            Try Again
          </button>
        )}
        {onDismiss && (
          <button style={styles.dismissButton} onClick={onDismiss}>
            Dismiss
          </button>
        )}
      </div>
    )}
  </div>
);

/**
 * Full Page Error
 * Hiển thị error chiếm toàn bộ page content
 */
const FullPageError = ({
  error,
  title,
  showIcon,
  onRetry,
  onDismiss,
}: {
  error: AppError;
  title?: string;
  showIcon: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}) => (
  <div style={styles.fullPage}>
    {showIcon && (
      <div style={{ fontSize: 64, marginBottom: 24 }}>
        {getErrorIcon(error.code)}
      </div>
    )}
    <h2 style={{ ...styles.title, fontSize: 24 }}>
      {title || getDefaultTitle(error.code)}
    </h2>
    <p style={{ ...styles.message, fontSize: 16, maxWidth: 400 }}>
      {error.message}
    </p>
    {(onRetry || onDismiss) && (
      <div style={styles.buttonGroup}>
        {onRetry && (
          <button style={styles.retryButton} onClick={onRetry}>
            Try Again
          </button>
        )}
        {onDismiss && (
          <button style={styles.dismissButton} onClick={onDismiss}>
            Go Back
          </button>
        )}
      </div>
    )}
  </div>
);

/* ========== MAIN COMPONENT ========== */

/**
 * Main ErrorMessage Component
 * 
 * @example
 * // Inline error (form validation)
 * <ErrorMessage error="Invalid email format" variant="inline" />
 * 
 * // Banner error
 * <ErrorMessage 
 *   error={apiError} 
 *   variant="banner" 
 *   onDismiss={() => setError(null)} 
 * />
 * 
 * // Card error with retry
 * <ErrorMessage 
 *   error={error} 
 *   variant="card" 
 *   onRetry={() => fetchData()} 
 * />
 * 
 * // Full page error
 * <ErrorMessage 
 *   error={error} 
 *   variant="fullPage" 
 *   onRetry={handleRetry}
 *   onDismiss={() => navigate(-1)}
 * />
 */
export const ErrorMessage = ({
  error,
  variant = 'inline',
  onRetry,
  onDismiss,
  title,
  showIcon = true,
}: ErrorMessageProps) => {
  const parsedError = parseError(error);

  switch (variant) {
    case 'banner':
      return (
        <BannerError
          error={parsedError}
          showIcon={showIcon}
          onRetry={onRetry}
          onDismiss={onDismiss}
        />
      );

    case 'card':
      return (
        <CardError
          error={parsedError}
          title={title}
          showIcon={showIcon}
          onRetry={onRetry}
          onDismiss={onDismiss}
        />
      );

    case 'fullPage':
      return (
        <FullPageError
          error={parsedError}
          title={title}
          showIcon={showIcon}
          onRetry={onRetry}
          onDismiss={onDismiss}
        />
      );

    case 'inline':
    default:
      return (
        <InlineError
          error={parsedError}
          showIcon={showIcon}
          onDismiss={onDismiss}
        />
      );
  }
};

/* ========== SPECIALIZED ERROR COMPONENTS ========== */

/**
 * Network Error Component
 * Hiển thị khi mất kết nối mạng
 */
export const NetworkError = ({ onRetry }: { onRetry?: () => void }) => (
  <ErrorMessage
    error={{
      code: ErrorCode.NETWORK_ERROR,
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
    }}
    variant="card"
    title="No Internet Connection"
    onRetry={onRetry}
  />
);

/**
 * Not Found Error Component
 * Hiển thị khi resource không tồn tại
 */
export const NotFoundError = ({ 
  message = 'The page you are looking for does not exist.',
  onGoBack,
}: { 
  message?: string;
  onGoBack?: () => void;
}) => (
  <ErrorMessage
    error={{
      code: ErrorCode.NOT_FOUND,
      message,
    }}
    variant="fullPage"
    title="Page Not Found"
    onDismiss={onGoBack}
  />
);

/**
 * Unauthorized Error Component
 * Hiển thị khi session hết hạn
 */
export const UnauthorizedError = ({ 
  onLogin 
}: { 
  onLogin?: () => void;
}) => (
  <ErrorMessage
    error={{
      code: ErrorCode.UNAUTHORIZED,
      message: 'Your session has expired. Please log in again to continue.',
    }}
    variant="card"
    title="Session Expired"
    onRetry={onLogin}
  />
);
