import React, { useState } from 'react';
import { useCircuit } from '../context/CircuitContext';
import Toolbar from '../components/Toolbar';
import GatePalette from '../components/GatePalette';
import CircuitCanvas from '../components/CircuitCanvas';
import SimulatorPanel from '../components/SimulatorPanel';
import ExecuteDialog from '../components/ExecuteDialog';
import ResultsView from '../components/ResultsView';

const CircuitComposer = () => {
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const { execution } = useCircuit();

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Gate Palette (Left Sidebar) */}
        <GatePalette />

        {/* Circuit Canvas (Main Area) */}
        <CircuitCanvas />
      </div>

      {/* Simulator Panel (Bottom) */}
      <SimulatorPanel />

      {/* Execute Dialog */}
      {showExecuteDialog && (
        <ExecuteDialog onClose={() => setShowExecuteDialog(false)} />
      )}

      {/* Results View */}
      {execution.result && (
        <ResultsView
          result={execution.result}
          onClose={() => {
            // Handle close
          }}
        />
      )}
    </div>
  );
};

export default CircuitComposer;
