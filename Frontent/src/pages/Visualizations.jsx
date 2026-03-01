import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import SimulatorPanel from '../components/SimulatorPanel';

const Visualizations = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-700 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/circuit-composer')}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 transition"
            >
              <ArrowLeft size={20} />
              Back to Composer
            </button>
            <div className="flex items-center gap-2">
              <Eye size={24} className="text-cyan-400" />
              <h1 className="text-xl font-semibold">Visualizations</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <SimulatorPanel />
      </div>
    </div>
  );
};

export default Visualizations;
