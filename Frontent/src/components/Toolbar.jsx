import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCircuit } from '../context/CircuitContext';
import {
  RotateCcw,
  RotateCw,
  AlignLeft,
  Layers,
  Menu,
  Save,
  Upload,
  Eye,
  Code,
  Play,
  Download,
} from 'lucide-react';

const Toolbar = ({ onRun }) => {
  const navigate = useNavigate();
  const {
    mode,
    setMode,
    alignment,
    setAlignment,
    generateOpenQASM,
    circuitName,
    setCircuitName,
    saveCircuit,
  } = useCircuit();

  const [showMenu, setShowMenu] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const handleUndo = () => {
    console.log('Undo clicked');
    // Implement undo logic
  };

  const handleRedo = () => {
    console.log('Redo clicked');
    // Implement redo logic
  };

  const handleSaveCircuit = () => {
    saveCircuit();
    setShowSave(false);
    alert(`Circuit "${circuitName}" saved!`);
  };

  const handleExportQASM = () => {
    const qasm = generateOpenQASM();
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(qasm)
    );
    element.setAttribute('download', `${circuitName}.qasm`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLoadCircuit = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.qasm';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setCircuitName(file.name.replace('.qasm', ''));
          console.log('Loaded QASM:', content);
          // Parse and load circuit
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-gray-900 text-white border-b border-gray-700 py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section: File operations */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition"
            >
              <Menu size={20} />
              File
            </button>
            {showMenu && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowSave(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700 text-left"
                >
                  <Save size={16} />
                  Save Circuit
                </button>
                <button
                  onClick={() => {
                    handleLoadCircuit();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700 text-left"
                >
                  <Upload size={16} />
                  Load Circuit
                </button>
                <button
                  onClick={() => {
                    handleExportQASM();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700 text-left"
                >
                  <Download size={16} />
                  Export QASM
                </button>
              </div>
            )}
          </div>

          {showSave && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Save Circuit</h3>
                <input
                  type="text"
                  value={circuitName}
                  onChange={(e) => setCircuitName(e.target.value)}
                  placeholder="Circuit name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-4"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowSave(false)}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCircuit}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Middle section: Edit & View operations */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            className="p-2 rounded hover:bg-gray-800 transition"
            title="Undo"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 rounded hover:bg-gray-800 transition"
            title="Redo"
          >
            <RotateCw size={20} />
          </button>

          <div className="flex items-center gap-1 border-l border-r border-gray-700 px-2">
            <button
              onClick={() => setAlignment('free')}
              className={`p-2 rounded transition ${
                alignment === 'free' ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
              title="Free alignment"
            >
              Free
            </button>
            <button
              onClick={() => setAlignment('left')}
              className={`p-2 rounded transition flex items-center gap-1 ${
                alignment === 'left' ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
              title="Left align"
            >
              <AlignLeft size={16} /> Left
            </button>
            <button
              onClick={() => setAlignment('layers')}
              className={`p-2 rounded transition flex items-center gap-1 ${
                alignment === 'layers' ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
              title="Layer alignment"
            >
              <Layers size={16} /> Layers
            </button>
          </div>

          <button
            onClick={() =>
              setMode(mode === 'edit' ? 'inspect' : 'edit')
            }
            className={`p-2 rounded transition flex items-center gap-1 ${
              mode === 'inspect' ? 'bg-green-600' : 'hover:bg-gray-800'
            }`}
            title="Toggle Inspect mode"
          >
            <Eye size={20} />
            {mode === 'inspect' ? 'Inspect' : 'Edit'}
          </button>
        </div>

        {/* Right section: View & Execute */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/code-view')}
            className="p-2 rounded hover:bg-gray-800 transition flex items-center gap-1"
            title="View Code"
          >
            <Code size={20} />
          </button>
          <button
            onClick={onRun}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition flex items-center gap-2"
            title="Run Circuit"
          >
            <Play size={18} />
            Run
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
