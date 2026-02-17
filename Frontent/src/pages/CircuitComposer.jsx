import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useCircuit } from '../context/CircuitContext';
import Toolbar from '../components/Toolbar';
import GatePalette from '../components/GatePalette';
import CircuitCanvas from '../components/CircuitCanvas';
import SimulatorPanel from '../components/SimulatorPanel';
import ExecuteDialog from '../components/ExecuteDialog';
import ResultsView from '../components/ResultsView';
import CodePanel from '../components/CodePanel';

const CircuitComposer = () => {
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { execution, circuitName, setExecution } = useCircuit();

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Toolbar onRun={() => setShowExecuteDialog(true)} />

      <div className="flex flex-1 overflow-hidden gap-px bg-gray-800">
        <div className="flex flex-col bg-gray-900 border-r border-gray-700">
          <GatePalette />
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
            <CircuitCanvas />
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

      {showHelp && (
        <div className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 max-w-xs z-50">
          <h4 className="font-semibold mb-2 text-blue-400">Quick Tips</h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>- Drag gates from the left panel onto circuit wires</li>
            <li>- Click gates to select and edit parameters</li>
            <li>- Use Ctrl+Click to select multiple gates</li>
            <li>- Press Delete to remove selected gates</li>
            <li>- Click Run to execute circuit</li>
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
