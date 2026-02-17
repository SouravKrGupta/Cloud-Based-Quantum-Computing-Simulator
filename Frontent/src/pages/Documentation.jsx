import React, { useState } from 'react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'quantum-gates', title: 'Quantum Gates' },
    { id: 'circuit-design', title: 'Circuit Design' },
    { id: 'simulation', title: 'Simulation' },
    { id: 'visualization', title: 'Visualization' },
    { id: 'advanced', title: 'Advanced Topics' }
  ];

  const content = {
    introduction: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Introduction to Quantum Computing</h2>
        <p className="text-gray-300">
          Quantum computing is a revolutionary approach to computation that harnesses the principles of quantum mechanics. 
          Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits, which can exist in 
          superpositions of states.
        </p>
        <p className="text-gray-300">
          QuantumSim provides a user-friendly platform for learning and experimenting with quantum computing. Our goal is to 
          make quantum computing accessible to everyone, regardless of their background.
        </p>
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
          <h3 className="font-semibold mb-3 text-purple-300">Key Concepts</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Qubits and superposition</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Quantum entanglement</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Quantum gates and operations</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Measurement and collapse</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    'getting-started': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Getting Started</h2>
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
          <h3 className="font-semibold mb-3 text-purple-300">Quick Start Guide</h3>
          <ol className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">1</span>
              <div>
                <strong>Sign Up</strong> - Create a free account on QuantumSim
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">2</span>
              <div>
                <strong>Launch the Composer</strong> - Navigate to the Quantum Composer
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">3</span>
              <div>
                <strong>Create a Circuit</strong> - Start building your quantum circuit
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">4</span>
              <div>
                <strong>Run Simulation</strong> - Execute your circuit and view results
              </div>
            </li>
          </ol>
        </div>
      </div>
    ),
    'quantum-gates': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Quantum Gates</h2>
        <p className="text-gray-300">
          Quantum gates are the building blocks of quantum circuits. They operate on qubits, manipulating their states. 
          Here are some of the most commonly used quantum gates:
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">Pauli Gates</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• X-gate (NOT) - Flips the qubit state</li>
              <li>• Y-gate - Rotates by π around Y-axis</li>
              <li>• Z-gate - Rotates by π around Z-axis</li>
            </ul>
          </div>
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">Hadamard Gate</h3>
            <p className="text-gray-300">
              Creates superposition states. Turns |0⟩ into (|0⟩ + |1⟩)/√2 and |1⟩ into (|0⟩ - |1⟩)/√2.
            </p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">Phase Gates</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• S-gate (√Z) - Rotates by π/2</li>
              <li>• T-gate - Rotates by π/4</li>
              <li>• Phase shift gates</li>
            </ul>
          </div>
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">Multi-qubit Gates</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• CNOT (Controlled-NOT)</li>
              <li>• Toffoli (CCNOT)</li>
              <li>• Swap gates</li>
              <li>• Entanglement operations</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'circuit-design': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Circuit Design</h2>
        <p className="text-gray-300">
          Designing quantum circuits involves arranging quantum gates in specific sequences to perform computations. 
          QuantumSim's visual composer makes this process intuitive.
        </p>
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
          <h3 className="font-semibold mb-3 text-purple-300">Best Practices</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Start with simple circuits and gradually complexity</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Use Hadamard gates to create superposition early</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Apply measurement gates only at the end of circuits</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Use controlled operations to create entanglement</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    'simulation': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Simulation</h2>
        <p className="text-gray-300">
          QuantumSim uses advanced simulation algorithms to execute quantum circuits. Our cloud-based simulation engine 
          provides accurate results quickly.
        </p>
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
          <h3 className="font-semibold mb-3 text-purple-300">Simulation Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>State vector simulation for up to 20 qubits</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Probability distribution calculation</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Real-time results visualization</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Support for large numbers of shots</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    'visualization': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Visualization</h2>
        <p className="text-gray-300">
          Understanding quantum states is crucial for quantum computing. QuantumSim provides powerful visualization tools 
          to help you see what's happening.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">Bloch Sphere</h3>
            <p className="text-gray-300">
              Visualizes single qubit states as points on a sphere. Provides intuitive understanding of superposition and phase.
            </p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">Q-sphere</h3>
            <p className="text-gray-300">
              Shows the quantum state vector in a spherical representation for multi-qubit systems.
            </p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">Probability Histogram</h3>
            <p className="text-gray-300">
              Displays the probability distribution of measurement outcomes for your quantum circuit.
            </p>
          </div>
          <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
            <h3 className="font-semibold mb-3 text-purple-300">State Vector</h3>
            <p className="text-gray-300">
              Shows the complex amplitude of each computational basis state in tabular format.
            </p>
          </div>
        </div>
      </div>
    ),
    'advanced': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Advanced Topics</h2>
        <p className="text-gray-300">
          For more experienced users, QuantumSim supports advanced quantum computing concepts and techniques.
        </p>
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600">
          <h3 className="font-semibold mb-3 text-purple-300">Advanced Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Quantum teleportation</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Quantum error correction</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Grover's search algorithm</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Quantum Fourier transform</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Quantum machine learning</span>
            </li>
          </ul>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
              <span className="text-sm font-semibold text-purple-300">Documentation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Quantum Computing Guide
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Learn everything you need to know about quantum computing with our comprehensive documentation.
            </p>
          </div>
        </div>
      </section>

      {/* External Reference Links */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Reference Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="https://quantum.cloud.ibm.com/composer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-600 bg-slate-900/60 hover:border-blue-500 transition"
              >
                <p className="text-white font-semibold">IBM Quantum Composer</p>
                <p className="text-gray-400 text-sm mt-1">Official UI inspiration and workflow.</p>
              </a>
              <a
                href="https://zxcalc.github.io/book/html/main_html.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-600 bg-slate-900/60 hover:border-blue-500 transition"
              >
                <p className="text-white font-semibold">ZX Calculus Book</p>
                <p className="text-gray-400 text-sm mt-1">Conceptual reference for diagram reasoning.</p>
              </a>
              <a
                href="https://zxcalculus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-600 bg-slate-900/60 hover:border-blue-500 transition"
              >
                <p className="text-white font-semibold">ZXCalculus.com</p>
                <p className="text-gray-400 text-sm mt-1">Interactive ZX examples and terminology.</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 sticky top-24">
                <h3 className="text-lg font-semibold mb-4 text-purple-300">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 min-h-[600px]">
                {content[activeSection]}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(sections[currentIndex - 1].id);
                    }
                  }}
                  disabled={activeSection === sections[0].id}
                  className="px-6 py-3 bg-slate-700/50 backdrop-blur-sm text-white rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1].id);
                    }
                  }}
                  disabled={activeSection === sections[sections.length - 1].id}
                  className="px-6 py-3 bg-slate-700/50 backdrop-blur-sm text-white rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center">
                    Next
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Practice What You've Learned?</h2>
          <p className="text-xl text-white/80 mb-10">Apply your knowledge in the Quantum Composer</p>
          <a href="/circuit-composer" className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-white/30">
            Launch Quantum Composer
          </a>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
