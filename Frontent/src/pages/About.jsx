import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
              <span className="text-sm font-semibold text-purple-300">About QuantumSim</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Making quantum computing accessible to everyone, from students to researchers.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">What We Do</h2>
              <p className="text-gray-300 mb-4">
                QuantumSim is a cloud-based quantum computing simulator designed to make quantum computing accessible to everyone. 
                Our platform provides an intuitive interface for designing, simulating, and visualizing quantum circuits.
              </p>
              <p className="text-gray-300 mb-4">
                Whether you're a student just starting with quantum computing or a researcher exploring complex algorithms, 
                QuantumSim provides the tools you need to experiment and learn.
              </p>
              <p className="text-gray-300">
                We believe that quantum computing should be accessible to everyone, not just experts in the field. 
                That's why we've created a platform that simplifies the process of working with quantum circuits.
              </p>
            </div>
            
            <div className="grid gap-6">
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Accessible</h3>
                <p className="text-gray-400">Designed for both beginners and experts</p>
              </div>

              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Powerful</h3>
                <p className="text-gray-400">Advanced simulation capabilities</p>
              </div>

              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure</h3>
                <p className="text-gray-400">Enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-20 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-400 text-lg">Meet the people behind QuantumSim</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Alice Quantum', role: 'Lead Quantum Researcher', bio: 'Ph.D. in Quantum Computing from MIT, 10+ years of experience' },
              { name: 'Bob Developer', role: 'Lead Software Engineer', bio: 'Full-stack developer specializing in quantum simulation' },
              { name: 'Charlie Designer', role: 'UX/UI Lead', bio: 'Creating intuitive experiences for complex technologies' }
            ].map((member, index) => (
              <div key={index} className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-purple-300 mb-4">{member.role}</p>
                <p className="text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
            <p className="text-gray-400 text-lg">Built with cutting-edge technologies</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600">
              <h3 className="text-xl font-semibold mb-6 text-purple-300">Frontend Technologies</h3>
              <div className="space-y-4">
                {[
                  'React - Modern UI library',
                  'Tailwind CSS - Utility-first CSS framework',
                  'Vite - Fast build tool',
                  'React Router - Client-side routing',
                  'Axios - HTTP client'
                ].map((tech, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600">
              <h3 className="text-xl font-semibold mb-6 text-purple-300">Backend Technologies</h3>
              <div className="space-y-4">
                {[
                  'Django - Python web framework',
                  'Django REST Framework - API development',
                  'PostgreSQL - Relational database',
                  'Celery - Asynchronous task queue',
                  'Redis - Cache and message broker'
                ].map((tech, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Explore Quantum Computing?</h2>
          <p className="text-xl text-white/80 mb-10">Join thousands of users already using QuantumSim</p>
          <a href="/signup" className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-white/30">
            Get Started Free
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;