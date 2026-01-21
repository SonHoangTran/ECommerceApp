import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { validateRequired } from '../utils/validation';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthContext();
  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/products', { replace: true });
    return null;
  }

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!validateRequired(username)) {
      newErrors.username = 'Username is required';
    }

    if (!validateRequired(password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      // Redirect to products page on success
      navigate('/products', { replace: true });
    } catch (err) {
      // Handle error
      if (err instanceof Error) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Login</h1>
      
      {error && (
        <ErrorMessage message={error} />
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) {
                setErrors({ ...errors, username: undefined });
              }
            }}
            error={errors.username}
            placeholder="Enter your username"
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors({ ...errors, password: undefined });
              }
            }}
            error={errors.password}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {loading && <Loading />}
    </div>
  );
};
