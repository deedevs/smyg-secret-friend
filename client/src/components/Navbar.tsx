import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo size="md" />

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600">
                  Welcome, {user.fullName}
                </span>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
