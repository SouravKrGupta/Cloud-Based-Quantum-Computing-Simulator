import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 text-white shadow-2xl backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-all">
              <svg className="h-6 w-6 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                <path d="M25 50 Q50 25 75 50 Q50 75 25 50" fill="currentColor" opacity="0.5"/>
                <circle cx="35" cy="45" r="5" fill="currentColor"/>
                <circle cx="65" cy="55" r="5" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-indigo-300 hover:to-cyan-300 transition-all">
              QuantumSim
            </span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2">
            {!token ? (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 hover:text-purple-300 transition-all duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-lg hover:shadow-indigo-500/50 transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 hover:text-purple-300 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                 <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-red-500/50 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 space-y-2">
            {!token ? (
              <>
                <Link 
                  to="/login" 
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                 <Link 
                  to="/signup" 
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-600 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user?.name || 'Profile'}
                </Link>
                 <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }} 
                  className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
