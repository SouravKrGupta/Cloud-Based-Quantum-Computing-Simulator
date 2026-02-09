import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    date_joined: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone_number: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      setEditData({
        name: response.data.name,
        phone_number: response.data.phone_number || '',
        address: response.data.address || '',
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        console.error('Error fetching profile:', error);
      }
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (editData.phone_number && !/^\d{10}$/.test(editData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Phone number should be 10 digits';
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
      const token = localStorage.getItem('accessToken');
      const response = await axios.put('http://localhost:8000/api/profile/', editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);

      // Update user data in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: response.data.name,
        phone_number: response.data.phone_number,
        address: response.data.address,
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post('http://localhost:8000/api/logout/', {
        refresh: refreshToken,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-header text-4xl md:text-5xl font-bold mb-3">Profile</h1>
          <p className="text-purple-300">Manage your account settings</p>
        </div>

        <div className="card-glass p-8">
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

          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                  <label className="block text-sm font-medium text-purple-300 mb-2">Full Name</label>
                  <p className="text-lg text-white font-semibold">{userData.name}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                  <label className="block text-sm font-medium text-purple-300 mb-2">Email Address</label>
                  <p className="text-lg text-white font-semibold">{userData.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                  <label className="block text-sm font-medium text-purple-300 mb-2">Phone Number</label>
                  <p className="text-lg text-white font-semibold">
                    {userData.phone_number || <span className="text-gray-400">Not provided</span>}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                  <label className="block text-sm font-medium text-purple-300 mb-2">Address</label>
                  <p className="text-lg text-white font-semibold">
                    {userData.address || <span className="text-gray-400">Not provided</span>}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white/10 border border-white/20">
                  <label className="block text-sm font-medium text-purple-300 mb-2">Member Since</label>
                  <p className="text-lg text-white font-semibold">
                    {new Date(userData.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      name: userData.name,
                      phone_number: userData.phone_number || '',
                      address: userData.address || '',
                    });
                  }}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors mr-2"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className={`input-field-dark ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && (
                  <p className="form-error">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={editData.phone_number}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={`input-field-dark ${errors.phone_number ? 'input-error' : ''}`}
                />
                {errors.phone_number && (
                  <p className="form-error">{errors.phone_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter your address"
                  className={`input-field-dark ${errors.address ? 'input-error' : ''}`}
                />
                {errors.address && (
                  <p className="form-error">{errors.address}</p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/20">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
