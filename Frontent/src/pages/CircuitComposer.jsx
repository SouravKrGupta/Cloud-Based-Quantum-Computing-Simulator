import React, { useState } from 'react';
import { HelpCircle, Mic, Layers, Eye, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCircuit } from '../context/CircuitContext';
import Toolbar from '../components/Toolbar';
import GatePalette from '../components/GatePalette';
import CircuitCanvas from '../components/CircuitCanvas';
import ExecuteDialog from '../components/ExecuteDialog';
import ResultsView from '../components/ResultsView';
import VoiceCommand from '../components/VoiceCommand';

const CircuitComposer = () => {
  const navigate = useNavigate();
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showVoiceCommand, setShowVoiceCommand] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { execution, circuitName, setExecution, circuit } = useCircuit();

  const handleCircuitGenerated = async (circuit) => {
    setIsProcessing(false);
    // Handle circuit generation from voice command
    console.log('Generated circuit:', circuit);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <Toolbar onRun={() => setShowExecuteDialog(true)} />

      <div className="flex flex-1 overflow-hidden gap-px bg-slate-800">
        {/* Operations Section */}
        <div className="flex flex-col bg-slate-900 border-r border-slate-700 w-80">
          <div className="p-3 border-b border-slate-700 bg-slate-800">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Operations</h3>
          </div>
          <div className="flex-1 ">
            <GatePalette />
          </div>
        </div>

        {/* Quantum Circuit Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-slate-900">
            <div className="p-3 border-b border-slate-700 bg-slate-800 sticky top-0 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{circuitName || 'Untitled Circuit'}</h2>
              <button
                onClick={() => setShowHelp((prev) => !prev)}
                className="p-2 hover:bg-slate-700 rounded transition"
                title="Help"
              >
                <HelpCircle size={18} className="text-gray-300 hover:text-cyan-400" />
              </button>
            </div>
            
            {/* Main Canvas */}
            <CircuitCanvas />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-slate-900 border-t border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVoiceCommand((prev) => !prev)}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mic size={18} />
              Voice Command
            </button>

            <button
              onClick={() => navigate('/visualizations')}
              disabled={circuit.length === 0}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              Visualizations
            </button>

            <button
              onClick={() => navigate('/code-view')}
              disabled={circuit.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Code size={18} />
              View Code
            </button>

            <button
              onClick={() => navigate('/zx-graph')}
              disabled={circuit.length === 0 || isProcessing}
              className="bg-gradient-to-r from-teal-600 to-green-700 hover:from-teal-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Layers size={18} />
              View ZX-Graph
            </button>
          </div>
        </div>
      </div>

      {showExecuteDialog && <ExecuteDialog onClose={() => setShowExecuteDialog(false)} />}

      {execution.result && (
        <ResultsView
          result={execution.result}
          onClose={() => setExecution((prev) => ({ ...prev, result: null }))}
        />
      )}

       {showVoiceCommand && (
        <div className="fixed bottom-6 right-6 w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-indigo-400">Voice Command</h4>
            <button
              onClick={() => setShowVoiceCommand(false)}
              className="p-1 hover:bg-gray-700 rounded transition"
            >
              ✕
            </button>
          </div>
          <VoiceCommand onCircuitGenerated={handleCircuitGenerated} />
        </div>
      )}

      {showHelp && (
        <div className="fixed bottom-6 right-6 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 max-w-xs z-50">
          <h4 className="font-semibold mb-2 text-cyan-400">Quick Tips</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>- Drag gates from the Operations panel onto circuit wires</li>
            <li>- Click gates to select and edit parameters</li>
            <li>- Use Ctrl+Click to select multiple gates</li>
            <li>- Press Delete to remove selected gates</li>
            <li>- Click Run to execute circuit</li>
            <li>- Use Voice Command for hands-free circuit creation</li>
            <li>- Click Visualizations to see quantum state representations</li>
            <li>- Click View Code to see OpenQASM representation</li>
            <li>- Click ZX-Graph to see quantum circuit representation</li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-4 w-full px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default CircuitComposer;
