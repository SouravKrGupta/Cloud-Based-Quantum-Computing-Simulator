import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                <svg className="h-6 w-6 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                  <path d="M25 50 Q50 25 75 50 Q50 75 25 50" fill="currentColor" opacity="0.5"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                QuantumSim
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced cloud-based quantum computing simulator for the future of computing.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></span>
              <span>Resources</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#docs" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a href="#tutorials" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>Tutorials</span>
                </a>
              </li>
              <li>
                <a href="#blog" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>Blog</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></span>
              <span>Legal</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2">
                  <span className="text-purple-400">›</span>
                  <span>Terms of Service</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-white/10"></div>
        
        {/* Bottom Section */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} QuantumSim. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#twitter" className="text-gray-400 hover:text-purple-400 transition-colors duration-200" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20c7.547 0 11.675-6.254 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.655 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            <a href="#github" className="text-gray-400 hover:text-purple-400 transition-colors duration-200" aria-label="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.181.071-.916.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </a>
            <a href="#linkedin" className="text-gray-400 hover:text-purple-400 transition-colors duration-200" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
