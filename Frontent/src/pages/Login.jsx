import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email: formData.email,
        password: formData.password,
      });
      
      // Save tokens and user data to localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/');
      
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Quantum Themed Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all animate-pulse-slow">
            <svg className="h-12 w-12 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M25 50 Q50 25 75 50 Q50 75 25 50" fill="white" opacity="0.5"/>
              <circle cx="35" cy="45" r="5" fill="white"/>
              <circle cx="65" cy="55" r="5" fill="white"/>
              <path d="M35 45 L65 55" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            QuantumSim
          </h2>
          <p className="text-purple-300">Cloud-based quantum computing simulator</p>
        </div>
        
        {/* Login Form */}
        <div className="card-glass p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Welcome Back
          </h3>
          
          {errors.general && (
            <div className="form-error-msg">
              {errors.general}
            </div>
          )}
          
          {errors.error && (
            <div className="form-error-msg">
              {errors.error}
              {errors.error.includes('not verified') && (
                <div className="mt-3">
                  <Link to="/verify-otp" className="font-medium text-purple-300 hover:text-purple-200 transition-colors">
                    Verify your email here
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`input-field-dark ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`input-field-dark ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-purple-300 hover:text-purple-200 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-purple-300 hover:text-purple-200 transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
          
          <div className="flex items-center mt-6 space-x-3">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>
          
          <a
            href="http://localhost:8000/api/login/google-oauth2/"
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-white/20 text-sm font-medium rounded-lg text-white hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all mt-4"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
