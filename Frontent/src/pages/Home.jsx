import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

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

  const features = [
    {
      icon: '⚛️',
      title: 'Quantum Simulation',
      description: 'Simulate quantum circuits and algorithms in a virtual environment'
    },
    {
      icon: '🔬',
      title: 'Advanced Algorithms',
      description: 'Access to cutting-edge quantum computing algorithms and concepts'
    },
    {
      icon: '☁️',
      title: 'Cloud-Based',
      description: 'Run your quantum simulations anywhere using cloud infrastructure'
    },
    {
      icon: '🎓',
      title: 'Learning Platform',
      description: 'Educational resources to master quantum computing fundamentals'
    },
    {
      icon: '⚡',
      title: 'High Performance',
      description: 'Optimized for speed and efficiency in quantum simulations'
    },
    {
      icon: '🔐',
      title: 'Secure',
      description: 'Enterprise-grade security for your quantum computing projects'
    }
  ];

  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="inline-block">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 glow-effect hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 animate-pulse-slow">
                <svg className="h-12 w-12 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                  <path d="M25 50 Q50 25 75 50 Q50 75 25 50" fill="currentColor" opacity="0.5"/>
                  <circle cx="35" cy="45" r="5" fill="currentColor"/>
                  <circle cx="65" cy="55" r="5" fill="currentColor"/>
                  <path d="M35 45 L65 55" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="section-header text-5xl md:text-7xl font-extrabold">
                Welcome to QuantumSim
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore the future of computing with our cloud-based quantum computing simulator. Learn, experiment, and innovate with quantum mechanics without physical hardware.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/signup"
                className="btn-primary text-lg flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-lg"
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  10K+
                </div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  5M+
                </div>
                <div className="text-gray-400">Simulations</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  99.9%
                </div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="section-header text-4xl md:text-5xl font-bold">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to simulate, learn, and master quantum computing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-glass p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-glass p-12 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Start Your Quantum Journey?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join thousands of quantum enthusiasts exploring the possibilities of quantum computing.
            </p>
            <Link
              to="/signup"
              className="btn-primary text-lg inline-flex items-center justify-center space-x-2"
            >
              <span>Create Your Account</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
