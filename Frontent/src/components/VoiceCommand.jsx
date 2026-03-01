import React, { useState } from 'react';
import { Mic, StopCircle, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const VoiceCommand = ({ onCircuitGenerated }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const sampleCommands = [
    'Create a bell state with two qubits',
    'Make three qubits in superposition and measure',
    'Entangle two qubits then measure',
    'Create three qubits',
    'Create a GHZ state with three qubits',
    'Make a two-qubit circuit and measure',
    'Add H gate to qubit 0',
    'Add X gate to q1',
    'Add CNOT from q0 to q1',
    'Add Hadamard gate to qubit 2',
    'Add CX gate from qubit 1 to qubit 3',
    'Add Z gate to q0 and q2'
  ];

  const startListening = async () => {
    setIsListening(true);
    setError('');
    setRecognizedText('');
    setTranscript('Listening...');

    try {
      // Simulate voice recognition with longer duration
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Randomly select a sample command
      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      setRecognizedText(randomCommand);
      setTranscript(`Recognized: "${randomCommand}"`);
    } catch (err) {
      setError('Voice recognition failed. Please try again.');
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const processCommand = async () => {
    if (!recognizedText) {
      setError('Please speak a command or select a sample command');
      return;
    }

    setIsProcessing(true);
    setError('');
    setTranscript(`Processing: "${recognizedText}"...`);

    try {
      const response = await fetch('http://localhost:8000/api/voice-command/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: recognizedText })
      });

      if (!response.ok) {
        throw new Error('Failed to process voice command');
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('===== Voice command succeeded =====');
        console.log('Circuit data:', data.data.circuit);
        setTranscript(`✅ Command processed: "${recognizedText}"`);
        onCircuitGenerated(data.data.circuit);
      } else {
        throw new Error(data.error || 'Failed to process voice command');
      }
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const useSampleCommand = (command) => {
    setRecognizedText(command);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Mic size={20} className="text-purple-400" />
          Voice Command
        </h3>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showHelp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <div className="mb-4 p-3 bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-sm">Listening... Speak your command</span>
        </div>
      )}

      {showHelp && (
        <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 mb-6">
          <h4 className="text-purple-400 font-medium mb-2">How to use voice commands:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Click the microphone button to start listening</li>
            <li>• Speak your quantum circuit command</li>
            <li>• The system will recognize and process your command</li>
            <li>• Example commands: "Create a bell state with two qubits", "Make three qubits in superposition"</li>
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-3">
          {!isListening ? (
            <button
              onClick={startListening}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mic size={20} />
              Start Listening
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <StopCircle size={20} />
              Stop Listening
            </button>
          )}

          {recognizedText && !isProcessing && (
            <button
              onClick={processCommand}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Process
            </button>
          )}
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <div className="animate-pulse">Processing command...</div>
          </div>
        )}

        {recognizedText && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Recognized Command:</p>
            <p className="text-white font-medium">{recognizedText}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {transcript && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <p className="text-green-400 text-sm">{transcript}</p>
          </div>
        )}

        {!recognizedText && !isListening && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Try these sample commands:</p>
            <div className="flex flex-wrap gap-2">
              {sampleCommands.slice(0, 4).map((command, index) => (
                <button
                  key={index}
                  onClick={() => useSampleCommand(command)}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded-lg transition-colors"
                >
                  {command}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCommand;
