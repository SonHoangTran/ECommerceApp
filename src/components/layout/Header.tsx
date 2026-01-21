import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Link to="/products">E-Commerce</Link>

      {isAuthenticated && user ? (
        <div>
          <span style={{ marginRight: 12 }}>
            Hello, {user.firstName}
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
};
