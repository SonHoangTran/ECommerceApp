// import { useState } from 'react';
// import type { FormEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuthContext } from '../context/AuthContext';
// import { Button } from '../components/common/Button';
// import { Input } from '../components/common/Input';
// import { Loading } from '../components/common/Loading';
// import { ErrorMessage } from '../components/common/ErrorMessage';
// import { validateRequired } from '../utils/validation';

// export const Login = () => {
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useAuthContext();
  
//   const [username, setUsername] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [errors, setErrors] = useState<{
//     username?: string;
//     password?: string;
//   }>({});

//   // Redirect if already authenticated
//   if (isAuthenticated) {
//     navigate('/products', { replace: true });
//     return null;
//   }

//   /**
//    * Validate form
//    */
//   const validateForm = (): boolean => {
//     const newErrors: typeof errors = {};

//     if (!validateRequired(username)) {
//       newErrors.username = 'Username is required';
//     }

//     if (!validateRequired(password)) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /**
//    * Handle form submission
//    */
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');

//     // Validate form
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await login(username, password);
//       // Redirect to products page on success
//       navigate('/products', { replace: true });
//     } catch (err) {
//       // Handle error
//       if (err instanceof Error) {
//         setError(err.message || 'Login failed. Please check your credentials.');
//       } else {
//         setError('Login failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
//       <h1>Login</h1>
      
//       {error && (
//         <ErrorMessage message={error} />
//       )}

//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <Input
//             type="text"
//             label="Username"
//             value={username}
//             onChange={(e) => {
//               setUsername(e.target.value);
//               if (errors.username) {
//                 setErrors({ ...errors, username: undefined });
//               }
//             }}
//             error={errors.username}
//             placeholder="Enter your username"
//             disabled={loading}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <Input
//             type="password"
//             label="Password"
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//               if (errors.password) {
//                 setErrors({ ...errors, password: undefined });
//               }
//             }}
//             error={errors.password}
//             placeholder="Enter your password"
//             disabled={loading}
//           />
//         </div>

//         <Button
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </Button>
//       </form>

//       {loading && <Loading />}
//     </div>
//   );
// };
/**
 * Login Page
 * 
 * Features:
 * - User authentication với DummyJSON API
 * - Form validation (chỉ khi submit)
 * - Error handling
 * - Loading state
 * - Redirect sau khi login thành công
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ErrorMessage } from '../components/common/ErrorMessage';
import type { AppError } from '../utils/errorHandler';
import { parseApiError } from '../utils/errorHandler';

/* ========== TYPES ========== */

interface LoginForm {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

/* ========== STYLES ========== */

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: 24,
    fontSize: 28,
    fontWeight: 600,
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    fontWeight: 500,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 16,
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 6,
  },
  button: {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,      // Chiều cao cố định
    transition: 'background-color 0.2s',  // Smooth transition

  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
  hint: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    fontSize: 14,
    color: '#666',
  },
  hintTitle: {
    fontWeight: 600,
    marginBottom: 8,
    color: '#333',
  },
};

/* ========== COMPONENT ========== */

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuthContext();

  // Form state
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });
  
  // Errors state - chỉ set khi submit
  const [errors, setErrors] = useState<FormErrors>({});
  
  // API error state
  const [apiError, setApiError] = useState<AppError | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Track if form has been submitted (để hiển thị errors)
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect nếu đã login
  if (isAuthenticated) {
    const from = (location.state as { from?: string })?.from || '/products';
    navigate(from, { replace: true });
    return null;
  }

  /**
   * Handle input change
   * Chỉ update value, KHÔNG validate ở đây
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error cho field này khi user bắt đầu gõ (sau khi đã submit)
    if (isSubmitted && errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear API error khi user thay đổi input
    if (apiError) {
      setApiError(null);
    }
  };

  /**
   * Validate form
   * Chỉ gọi khi submit
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    
    // Return true nếu không có errors
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Đánh dấu form đã được submit
    setIsSubmitted(true);
    
    // Clear previous API error
    setApiError(null);

    // Validate form
    if (!validateForm()) {
      return; // Dừng nếu có lỗi validation
    }

    // Start loading
    setIsLoading(true);

    try {
      // Call login API
      await login(formData.username, formData.password);
      
      // Redirect sau khi login thành công
      const from = (location.state as { from?: string })?.from || '/products';
      navigate(from, { replace: true });
    } catch (error) {
      // Parse và set API error
      const parsedError = parseApiError(error);
      setApiError(parsedError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        {/* Session expired message từ redirect */}
        {location.state?.message && (
          <div style={{ marginBottom: 20 }}>
            <ErrorMessage 
              error={location.state.message} 
              variant="inline" 
            />
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div style={{ marginBottom: 20 }}>
            <ErrorMessage 
              error={apiError} 
              variant="inline"
              onDismiss={() => setApiError(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username Field */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              autoComplete="username"
              disabled={isLoading}
              style={{
                ...styles.input,
                ...(errors.username ? styles.inputError : {}),
              }}
            />
            {errors.username && (
              <p style={styles.errorText}>{errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={isLoading}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
            />
            {errors.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
          >
            {isLoading ? (
              <>
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Test Account Hint */}
        <div style={styles.hint}>
          <p style={styles.hintTitle}>Test Account:</p>
          <p style={{ margin: 0 }}>
            Username: <code>emilys</code>
            <br />
            Password: <code>emilyspass</code>
          </p>
        </div>
      </div>
    </div>
  );
};
