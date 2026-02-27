import React, { useState } from 'react';
import { HelpCircle, Mic, Layers } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';
import Toolbar from '../components/Toolbar';
import GatePalette from '../components/GatePalette';
import CircuitCanvas from '../components/CircuitCanvas';
import SimulatorPanel from '../components/SimulatorPanel';
import ExecuteDialog from '../components/ExecuteDialog';
import ResultsView from '../components/ResultsView';
import CodePanel from '../components/CodePanel';
import VoiceCommand from '../components/VoiceCommand';
import ZXGraphCanvas from '../components/ZXGraphCanvas';

const CircuitComposer = () => {
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showVoiceCommand, setShowVoiceCommand] = useState(false);
  const [showZXGraph, setShowZXGraph] = useState(false);
  const [zxGraph, setZxGraph] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { execution, circuitName, setExecution } = useCircuit();

  const handleCircuitGenerated = async (circuit) => {
    setIsProcessing(false);
    // Handle circuit generation from voice command
    console.log('Generated circuit:', circuit);
  };

  const convertToZXGraph = async () => {
    setIsProcessing(true);
    // This would connect to the backend API to convert circuit to ZX-graph
    // For now, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 1000));
    setZxGraph({
      nodes: [
        { id: 1, x: 100, y: 100, type: 'z', phase: '0', label: 'Z', color: '#3B82F6' },
        { id: 2, x: 200, y: 150, type: 'x', phase: 'π/2', label: 'X', color: '#EF4444' },
        { id: 3, x: 300, y: 100, type: 'z', phase: 'π', label: 'Z', color: '#3B82F6' },
        { id: 4, x: 400, y: 150, type: 'x', phase: 'π/4', label: 'X', color: '#EF4444' },
        { id: 5, x: 500, y: 100, type: 'z', phase: '3π/2', label: 'Z', color: '#3B82F6' },
      ],
      edges: [
        { source: 1, target: 2 },
        { source: 2, target: 3 },
        { source: 3, target: 4 },
        { source: 4, target: 5 },
        { source: 2, target: 4 },
      ]
    });
    setIsProcessing(false);
    setShowZXGraph(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Toolbar onRun={() => setShowExecuteDialog(true)} />

      <div className="flex flex-1 overflow-hidden gap-px bg-gray-800">
        <div className="flex flex-col bg-gray-900 border-r border-gray-700">
          <GatePalette />
          
          {/* Voice Command Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => setShowVoiceCommand((prev) => !prev)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mic size={20} />
              Voice Command
            </button>
          </div>

          {/* ZX-Graph Conversion Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={convertToZXGraph}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Layers size={20} />
              View ZX-Graph
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-gray-900 border-b border-gray-700">
            <div className="p-3 border-b border-gray-700 bg-gray-800 sticky top-0 flex justify-between items-center">
              <h2 className="text-lg font-semibold">{circuitName || 'Untitled Circuit'}</h2>
              <button
                onClick={() => setShowHelp((prev) => !prev)}
                className="p-2 hover:bg-gray-700 rounded transition"
                title="Help"
              >
                <HelpCircle size={18} className="text-gray-300 hover:text-blue-400" />
              </button>
            </div>
            
            {/* Main Canvas */}
            {showZXGraph ? (
              <ZXGraphCanvas zxGraph={zxGraph} />
            ) : (
              <CircuitCanvas />
            )}
          </div>

          <div className="border-t border-gray-700">
            <SimulatorPanel />
          </div>
        </div>

        <div className="flex flex-col bg-gray-900 border-l border-gray-700">
          <CodePanel />
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
        <div className="fixed bottom-6 right-6 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-purple-400">Voice Command</h4>
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
        <div className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 max-w-xs z-50">
          <h4 className="font-semibold mb-2 text-blue-400">Quick Tips</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>- Drag gates from the left panel onto circuit wires</li>
            <li>- Click gates to select and edit parameters</li>
            <li>- Use Ctrl+Click to select multiple gates</li>
            <li>- Press Delete to remove selected gates</li>
            <li>- Click Run to execute circuit</li>
            <li>- Use Voice Command for hands-free circuit creation</li>
            <li>- View ZX-Graph to see quantum circuit representation</li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-4 w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default CircuitComposer;
