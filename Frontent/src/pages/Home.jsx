import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('access');
    const refreshToken = searchParams.get('refresh');
    const userId = searchParams.get('user_id');

    if (accessToken && refreshToken) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Clear the search params from URL
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to QuantumSim
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Cloud-based quantum computing simulator working on the principles of quantum mechanics, allowing users to simulate quantum circuits and algorithms in a virtual environment. It provides an accessible platform for learning and experimenting with quantum computing concepts without the need for physical quantum hardware.
        </p>
      </div>
    </div>
  );
};

export default Home;
