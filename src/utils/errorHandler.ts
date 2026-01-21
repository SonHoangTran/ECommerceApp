/**
 * Error Handler Utilities
 * 
 * Mục đích:
 * - Parse và xử lý các loại errors từ API
 * - Cung cấp user-friendly error messages
 * - Xử lý redirect khi unauthorized
 * 
 * Các loại error được xử lý:
 * - Network errors (không có kết nối)
 * - 401 Unauthorized (token hết hạn/không hợp lệ)
 * - 403 Forbidden (không có quyền)
 * - 404 Not Found (resource không tồn tại)
 * - 422 Validation Error (dữ liệu không hợp lệ)
 * - 500 Server Error (lỗi server)
 * - Unknown errors
 */

/* ========== ERROR TYPES ========== */

/**
 * Enum định nghĩa các loại error code
 * Giúp type-safe khi xử lý errors
 */
export enum ErrorCode {
   NETWORK_ERROR = 'NETWORK_ERROR',
   UNAUTHORIZED = 'UNAUTHORIZED',
   FORBIDDEN = 'FORBIDDEN',
   NOT_FOUND = 'NOT_FOUND',
   VALIDATION_ERROR = 'VALIDATION_ERROR',
   SERVER_ERROR = 'SERVER_ERROR',
   UNKNOWN_ERROR = 'UNKNOWN_ERROR',
   TIMEOUT_ERROR = 'TIMEOUT_ERROR',
 }
 
 /**
  * Interface cho parsed error
  * Chuẩn hóa format error trong toàn app
  */
 export interface AppError {
   code: ErrorCode;
   message: string;
   originalError?: unknown;
   statusCode?: number;
   details?: Record<string, string[]>; // Cho validation errors
 }
 
 /* ========== ERROR MESSAGES ========== */
 
 /**
  * User-friendly error messages cho từng loại error
  * Có thể dễ dàng thay đổi/đa ngôn ngữ
  */
 const ERROR_MESSAGES: Record<ErrorCode, string> = {
   [ErrorCode.NETWORK_ERROR]: 
     'Unable to connect to the server. Please check your internet connection.',
   [ErrorCode.UNAUTHORIZED]: 
     'Your session has expired. Please log in again.',
   [ErrorCode.FORBIDDEN]: 
     'You do not have permission to perform this action.',
   [ErrorCode.NOT_FOUND]: 
     'The requested resource was not found.',
   [ErrorCode.VALIDATION_ERROR]: 
     'Please check your input and try again.',
   [ErrorCode.SERVER_ERROR]: 
     'Something went wrong on our end. Please try again later.',
   [ErrorCode.UNKNOWN_ERROR]: 
     'An unexpected error occurred. Please try again.',
   [ErrorCode.TIMEOUT_ERROR]: 
     'The request took too long. Please try again.',
 };
 
 /* ========== HELPER FUNCTIONS ========== */
 
 /**
  * Kiểm tra xem error có phải là network error không
  * Network error xảy ra khi không có kết nối internet
  * hoặc server không phản hồi
  */
 const isNetworkError = (error: unknown): boolean => {
   // TypeError với message 'Failed to fetch' là network error
   if (error instanceof TypeError && error.message === 'Failed to fetch') {
     return true;
   }
   
   // Check cho các browser khác nhau
   if (error instanceof Error) {
     const networkErrorMessages = [
       'Network request failed',
       'Network Error',
       'Failed to fetch',
       'Load failed',
     ];
     return networkErrorMessages.some(msg => 
       error.message.toLowerCase().includes(msg.toLowerCase())
     );
   }
   
   return false;
 };
 
 /**
  * Kiểm tra xem error có phải là timeout error không
  */
 const isTimeoutError = (error: unknown): boolean => {
   if (error instanceof Error) {
     return error.name === 'AbortError' || 
            error.message.toLowerCase().includes('timeout');
   }
   return false;
 };
 
 /**
  * Lấy error code từ HTTP status code
  */
 const getErrorCodeFromStatus = (status: number): ErrorCode => {
   switch (status) {
     case 401:
       return ErrorCode.UNAUTHORIZED;
     case 403:
       return ErrorCode.FORBIDDEN;
     case 404:
       return ErrorCode.NOT_FOUND;
     case 422:
       return ErrorCode.VALIDATION_ERROR;
     case 500:
     case 502:
     case 503:
     case 504:
       return ErrorCode.SERVER_ERROR;
     default:
       return ErrorCode.UNKNOWN_ERROR;
   }
 };
 
 /* ========== MAIN FUNCTIONS ========== */
 
 /**
  * Parse error từ API response thành AppError
  * 
  * @param error - Error object từ catch block
  * @returns AppError - Chuẩn hóa error format
  * 
  * @example
  * try {
  *   await api.get('/users');
  * } catch (error) {
  *   const appError = parseApiError(error);
  *   console.log(appError.message);
  * }
  */
 export const parseApiError = (error: unknown): AppError => {
   // 1. Network Error
   if (isNetworkError(error)) {
     return {
       code: ErrorCode.NETWORK_ERROR,
       message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR],
       originalError: error,
     };
   }
 
   // 2. Timeout Error
   if (isTimeoutError(error)) {
     return {
       code: ErrorCode.TIMEOUT_ERROR,
       message: ERROR_MESSAGES[ErrorCode.TIMEOUT_ERROR],
       originalError: error,
     };
   }
 
   // 3. Error với response (từ API)
   if (error && typeof error === 'object' && 'status' in error) {
     const apiError = error as { status: number; message?: string; errors?: Record<string, string[]> };
     const errorCode = getErrorCodeFromStatus(apiError.status);
     
     return {
       code: errorCode,
       message: apiError.message || ERROR_MESSAGES[errorCode],
       originalError: error,
       statusCode: apiError.status,
       details: apiError.errors,
     };
   }
 
   // 4. Error object thông thường
   if (error instanceof Error) {
     return {
       code: ErrorCode.UNKNOWN_ERROR,
       message: error.message || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
       originalError: error,
     };
   }
 
   // 5. Unknown error
   return {
     code: ErrorCode.UNKNOWN_ERROR,
     message: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
     originalError: error,
   };
 };
 
 /**
  * Lấy user-friendly message từ error
  * Sử dụng khi chỉ cần hiển thị message, không cần full error object
  * 
  * @param error - Error object
  * @returns string - User-friendly message
  */
 export const getErrorMessage = (error: unknown): string => {
   const appError = parseApiError(error);
   return appError.message;
 };
 
 /**
  * Kiểm tra xem error có phải là unauthorized error không
  * Dùng để quyết định có redirect về login hay không
  * 
  * @param error - Error object hoặc AppError
  * @returns boolean
  */
 export const isUnauthorizedError = (error: unknown): boolean => {
   if (error && typeof error === 'object' && 'code' in error) {
     return (error as AppError).code === ErrorCode.UNAUTHORIZED;
   }
   
   const appError = parseApiError(error);
   return appError.code === ErrorCode.UNAUTHORIZED;
 };
 
 /**
  * Kiểm tra xem error có thể retry được không
  * Network errors và timeout errors có thể retry
  * 
  * @param error - AppError object
  * @returns boolean
  */
 export const isRetryableError = (error: AppError): boolean => {
   const retryableCodes = [
     ErrorCode.NETWORK_ERROR,
     ErrorCode.TIMEOUT_ERROR,
     ErrorCode.SERVER_ERROR,
   ];
   return retryableCodes.includes(error.code);
 };
 
 /**
  * Tạo error handler với callback
  * Hữu ích khi cần xử lý error ở nhiều nơi với logic giống nhau
  * 
  * @param onUnauthorized - Callback khi gặp 401 error
  * @returns Function để handle error
  * 
  * @example
  * const handleError = createErrorHandler(() => {
  *   logout();
  *   navigate('/login');
  * });
  * 
  * try {
  *   await api.get('/protected');
  * } catch (error) {
  *   handleError(error);
  * }
  */
 export const createErrorHandler = (
   onUnauthorized?: () => void
 ) => {
   return (error: unknown): AppError => {
     const appError = parseApiError(error);
     
     // Xử lý unauthorized error
     if (appError.code === ErrorCode.UNAUTHORIZED && onUnauthorized) {
       onUnauthorized();
     }
     
     return appError;
   };
 };
 
 /**
  * Log error cho debugging
  * Chỉ log ở development mode
  */
 export const logError = (error: unknown, context?: string): void => {
   if (import.meta.env.DEV) {
     console.group(`🔴 Error${context ? ` in ${context}` : ''}`);
     console.error('Original error:', error);
     console.error('Parsed error:', parseApiError(error));
     console.groupEnd();
   }
 };
 