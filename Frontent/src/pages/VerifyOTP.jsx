import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {
  const [formData, setFormData] = useState({
    email: '',
    otpCode: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get email from query parameters if available (e.g., from signup)
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }

    // Start timer for OTP expiry (1 minute)
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams]);

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
    
    if (!formData.otpCode) {
      newErrors.otpCode = 'OTP is required';
    } else if (formData.otpCode.length !== 6) {
      newErrors.otpCode = 'OTP must be 6 digits';
    } else if (!/^\d+$/.test(formData.otpCode)) {
      newErrors.otpCode = 'OTP must contain only digits';
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
      const response = await axios.post('http://localhost:8000/api/verify-otp/', {
        email: formData.email,
        otp_code: formData.otpCode,
      });
      
      setSuccessMessage(response.data.message);
      setFormData({
        email: '',
        otpCode: '',
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
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
          <div className="mx-auto h-20 w-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all animate pulse-slow">
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
        
        {/* Verify OTP Form */}
        <div className="card-glass p-8">
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Verify Email
          </h3>
          
          {successMessage && (
            <div className="form-success">
              {successMessage}
            </div>
          )}
          
          {errors.general && (
            <div className="form-error-msg">
              {errors.general}
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
              <label htmlFor="otpCode" className="block text-sm font-medium text-white mb-2">
                OTP Code
              </label>
              <input
                id="otpCode"
                name="otpCode"
                type="text"
                maxLength={6}
                required
                className={`input-field-dark ${errors.otpCode ? 'input-error' : ''}`}
                placeholder="Enter 6-digit OTP"
                value={formData.otpCode}
                onChange={handleChange}
              />
              {errors.otpCode && <div className="form-error">{errors.otpCode}</div>}
              <div className="text-sm text-purple-300 mt-2">
                OTP expires in <span className="text-purple-200 font-semibold">{timeLeft} seconds</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Didn't receive OTP?{' '}
              <Link to="/resend-otp" className="font-medium text-purple-300 hover:text-purple-200 transition-colors">
                Resend OTP
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Back to{' '}
              <Link to="/login" className="font-medium text-purple-300 hover:text-purple-200 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
