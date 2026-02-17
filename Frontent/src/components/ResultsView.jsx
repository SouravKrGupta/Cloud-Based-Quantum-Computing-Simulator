import React, { useMemo, useState } from 'react';
import { Download, Copy, X } from 'lucide-react';

const ResultsView = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState('histogram');
  const [copied, setCopied] = useState(false);

  const normalizedCounts = useMemo(() => {
    if (!result) return {};
    if (result.counts && Object.keys(result.counts).length > 0) return result.counts;

    if (result.probability_distribution) {
      const shots = result.shots || 1000;
      return Object.fromEntries(
        Object.entries(result.probability_distribution).map(([state, probability]) => [
          state,
          Math.round((probability || 0) * shots),
        ])
      );
    }

    return {};
  }, [result]);

  if (!result) return null;

  const totalShots =
    result.shots || Object.values(normalizedCounts).reduce((acc, count) => acc + count, 0) || 1000;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format) => {
    let content = '';
    let filename = '';

    if (format === 'json') {
      content = JSON.stringify({ ...result, counts: normalizedCounts }, null, 2);
      filename = 'results.json';
    } else {
      const headers = ['State', 'Count', 'Probability'];
      const rows = Object.entries(normalizedCounts).map(([state, count]) => [
        state,
        count,
        `${((count / totalShots) * 100).toFixed(2)}%`,
      ]);
      content = [headers, ...rows].map((row) => row.join(',')).join('\n');
      filename = 'results.csv';
    }

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sortedHistogram = Object.entries(normalizedCounts).sort(([, a], [, b]) => b - a);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
          <h2 className="text-2xl font-bold text-white">Execution Results</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('histogram')}
              className={`px-4 py-2 border-b-2 font-semibold transition ${
                activeTab === 'histogram'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Histogram
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 border-b-2 font-semibold transition ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-2 border-b-2 font-semibold transition ${
                activeTab === 'raw'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Raw Data
            </button>
          </div>

          {activeTab === 'histogram' && (
            <div className="space-y-3">
              {sortedHistogram.slice(0, 20).map(([state, count]) => {
                const percentage = (count / totalShots) * 100;
                return (
                  <div key={state} className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm w-24 font-mono">|{state}&gt;</span>
                    <div className="flex-1 bg-gray-700 rounded h-8 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="absolute right-2 top-0 h-full flex items-center text-xs text-white font-semibold">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-400 text-sm">Total Shots</div>
                <div className="text-2xl font-bold text-white">{totalShots.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-400 text-sm">Unique States</div>
                <div className="text-2xl font-bold text-white">{Object.keys(normalizedCounts).length}</div>
              </div>
              <div className="p-4 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-400 text-sm">Most Probable</div>
                <div className="text-xl font-bold text-white font-mono">
                  {sortedHistogram[0]?.[0] || 'N/A'}
                </div>
              </div>
              <div className="p-4 bg-gray-900 rounded border border-gray-700">
                <div className="text-gray-400 text-sm">Execution Time</div>
                <div className="text-xl font-bold text-white">
                  {result.execution_time ? `${Number(result.execution_time).toFixed(3)} s` : 'N/A'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="relative">
              <pre className="bg-gray-900 p-4 rounded border border-gray-700 text-gray-300 text-xs overflow-x-auto max-h-56">
                {JSON.stringify({ ...result, counts: normalizedCounts }, null, 2)}
              </pre>
              <button
                onClick={() => handleCopy(JSON.stringify({ ...result, counts: normalizedCounts }, null, 2))}
                className="absolute top-2 right-2 p-2 bg-blue-600 rounded hover:bg-blue-700 text-white transition"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
              {copied && (
                <div className="absolute top-12 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-2 pt-6 border-t border-gray-700">
            <button
              onClick={() => handleDownload('json')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              <Download size={16} />
              JSON
            </button>
            <button
              onClick={() => handleDownload('csv')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              <Download size={16} />
              CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
