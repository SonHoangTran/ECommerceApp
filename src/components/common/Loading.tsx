/**
 * Loading Component
 * 
 * Mục đích:
 * - Hiển thị trạng thái loading khi đang fetch data
 * - Cung cấp nhiều variants cho các use cases khác nhau
 * - Có thể tái sử dụng ở nhiều nơi trong app
 * 
 * Variants:
 * - spinner: Hiển thị spinner xoay (default)
 * - dots: Hiển thị 3 chấm nhảy
 * - skeleton: Hiển thị skeleton placeholder
 * - overlay: Hiển thị overlay toàn màn hình
 */

import type { CSSProperties } from 'react';

/* ========== TYPES ========== */

/**
 * Props interface cho Loading component
 */
interface LoadingProps {
  /** Loại loading hiển thị */
  variant?: 'spinner' | 'dots' | 'skeleton' | 'overlay';
  /** Kích thước của loading indicator */
  size?: 'small' | 'medium' | 'large';
  /** Text hiển thị bên cạnh loading */
  text?: string;
  /** Chiều cao cho skeleton (dùng với variant='skeleton') */
  height?: number | string;
  /** Số lượng skeleton items (dùng với variant='skeleton') */
  count?: number;
  /** Custom className */
  className?: string;
}

/* ========== STYLES ========== */

/**
 * Định nghĩa kích thước theo size prop
 */
const SIZES = {
  small: 20,
  medium: 40,
  large: 60,
};

/**
 * Styles cho các components
 */
const styles: Record<string, CSSProperties> = {
  // Container chung
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  // Spinner styles
  spinner: {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  // Dots container
  dotsContainer: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  
  // Single dot
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#3498db',
    borderRadius: '50%',
    animation: 'bounce 1.4s ease-in-out infinite both',
  },
  
  // Skeleton base
  skeleton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  
  // Overlay background
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  
  // Loading text
  text: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
};

/* ========== CSS KEYFRAMES ========== */

/**
 * Inject CSS keyframes vào document
 * Chỉ inject một lần khi component được import
 */
const injectKeyframes = (): void => {
  const styleId = 'loading-keyframes';
  
  // Kiểm tra đã inject chưa
  if (document.getElementById(styleId)) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }
  `;
  
  document.head.appendChild(styleSheet);
};

// Inject keyframes khi module được load
injectKeyframes();

/* ========== SUB-COMPONENTS ========== */

/**
 * Spinner Loading
 * Hiển thị vòng tròn xoay
 */
const SpinnerLoading = ({ 
  size = 'medium', 
  text 
}: Pick<LoadingProps, 'size' | 'text'>) => {
  const dimension = SIZES[size];
  
  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.spinner,
          width: dimension,
          height: dimension,
        }}
      />
      {text && <span style={styles.text}>{text}</span>}
    </div>
  );
};

/**
 * Dots Loading
 * Hiển thị 3 chấm nhảy animation
 */
const DotsLoading = ({ 
  text 
}: Pick<LoadingProps, 'text'>) => {
  return (
    <div style={styles.container}>
      <div style={styles.dotsContainer}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            style={{
              ...styles.dot,
              animationDelay: `${index * 0.16}s`,
            }}
          />
        ))}
      </div>
      {text && <span style={styles.text}>{text}</span>}
    </div>
  );
};

/**
 * Skeleton Loading
 * Hiển thị placeholder skeleton
 */
const SkeletonLoading = ({ 
  height = 20, 
  count = 1 
}: Pick<LoadingProps, 'height' | 'count'>) => {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            ...styles.skeleton,
            height: typeof height === 'number' ? height : height,
            marginBottom: index < count - 1 ? 12 : 0,
            // Tạo độ dài khác nhau cho skeleton items
            width: index === count - 1 && count > 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Overlay Loading
 * Hiển thị loading overlay toàn màn hình
 */
const OverlayLoading = ({ 
  text = 'Loading...' 
}: Pick<LoadingProps, 'text'>) => {
  return (
    <div style={styles.overlay}>
      <SpinnerLoading size="large" text={text} />
    </div>
  );
};

/* ========== MAIN COMPONENT ========== */

/**
 * Main Loading Component
 * 
 * @example
 * // Spinner (default)
 * <Loading />
 * 
 * // Với text
 * <Loading text="Loading products..." />
 * 
 * // Dots variant
 * <Loading variant="dots" />
 * 
 * // Skeleton variant
 * <Loading variant="skeleton" height={100} count={3} />
 * 
 * // Overlay variant
 * <Loading variant="overlay" text="Processing..." />
 */
export const Loading = ({
  variant = 'spinner',
  size = 'medium',
  text,
  height,
  count,
}: LoadingProps) => {
  switch (variant) {
    case 'dots':
      return <DotsLoading text={text} />;
    
    case 'skeleton':
      return <SkeletonLoading height={height} count={count} />;
    
    case 'overlay':
      return <OverlayLoading text={text} />;
    
    case 'spinner':
    default:
      return <SpinnerLoading size={size} text={text} />;
  }
};

/* ========== SPECIALIZED LOADING COMPONENTS ========== */

/**
 * Page Loading
 * Sử dụng khi loading toàn bộ page
 */
export const PageLoading = ({ text = 'Loading...' }: { text?: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
    }}
  >
    <Loading size="large" text={text} />
  </div>
);

/**
 * Button Loading
 * Sử dụng trong button khi đang submit
 */
export const ButtonLoading = () => (
  <Loading size="small" variant="spinner" />
);

/**
 * Inline Loading
 * Sử dụng khi cần loading inline với text
 */
export const InlineLoading = ({ text = 'Loading...' }: { text?: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <Loading size="small" />
    <span>{text}</span>
  </span>
);

/**
 * Card Skeleton
 * Sử dụng cho product card loading
 */
export const CardSkeleton = () => (
  <div
    style={{
      backgroundColor: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    }}
  >
    {/* Image placeholder */}
    <Loading variant="skeleton" height={220} />
    
    {/* Content */}
    <div style={{ padding: 20 }}>
      {/* Category */}
      <div style={{ marginBottom: 8 }}>
        <Loading variant="skeleton" height={12} />
      </div>
      
      {/* Title */}
      <div style={{ marginBottom: 12 }}>
        <Loading variant="skeleton" height={18} />
      </div>
      
      {/* Rating */}
      <div style={{ marginBottom: 12, width: '60%' }}>
        <Loading variant="skeleton" height={14} />
      </div>
      
      {/* Price */}
      <div style={{ marginBottom: 16, width: '40%' }}>
        <Loading variant="skeleton" height={24} />
      </div>
      
      {/* Button */}
      <Loading variant="skeleton" height={44} />
    </div>
  </div>
);

/**
 * Product List Skeleton - 4 cột
 */
export const ProductListSkeleton = ({ count = 8 }: { count?: number }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24,
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);