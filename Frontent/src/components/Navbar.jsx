import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            QuantumSim
          </Link>
          
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                >
                  {user?.name || 'Profile'}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
