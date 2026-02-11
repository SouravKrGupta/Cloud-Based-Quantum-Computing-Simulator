# Developer Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd Frontent
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

## 📁 Project Structure Overview

```
Frontent/src/
├── context/
│   └── CircuitContext.jsx          # Global state management
├── components/
│   ├── Toolbar.jsx                 # Top navigation & file operations
│   ├── GatePalette.jsx             # Gate catalog sidebar
│   ├── CircuitCanvas.jsx           # Main circuit editor
│   ├── SimulatorPanel.jsx          # Visualizations
│   ├── ExecuteDialog.jsx           # Run dialog
│   ├── ResultsView.jsx             # Results display
│   ├── Navbar.jsx                  # Top navbar
│   └── Footer.jsx                  # Footer
├── pages/
│   ├── CircuitComposer.jsx         # Main app page
│   ├── CodeView.jsx                # QASM code editor
│   ├── Results.jsx                 # Results history
│   ├── CustomGates.jsx             # Custom gate manager
│   ├── FileManager.jsx             # File operations
│   ├── Home.jsx                    # Landing page
│   ├── Documentation.jsx           # Help & docs
│   └── [Auth pages]                # Login, signup, etc.
├── App.jsx                         # App router & provider
├── main.jsx                        # App entry point
├── index.css                       # Global styles
└── ...
```

## 🔗 How to Use the CircuitContext

### In Any Component:
```jsx
import { useCircuit } from '../context/CircuitContext';

function MyComponent() {
  const { 
    circuit,
    addGate, 
    removeGate,
    generateOpenQASM 
  } = useCircuit();

  // Use the values and functions
  return <div>{circuit.length} gates</div>;
}
```

## 🎨 Styling Guidelines

All components use **Tailwind CSS** classes. Dark theme by default.

### Color Palette:
- **Primary**: Blue (`bg-blue-600`)
- **Secondary**: Purple (`bg-purple-600`)
- **Backgrounds**: Gray (`bg-gray-800`, `bg-gray-900`)
- **Text**: White/Gray (`text-white`, `text-gray-300`)
- **Success**: Green (`bg-green-600`)
- **Danger**: Red (`bg-red-600`)
- **Warning**: Yellow (`bg-yellow-600`)

### Common Patterns:
```jsx
// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" />

// Card
<div className="bg-gray-800 rounded-lg border border-gray-700 p-6" />

// Modal
<div className="fixed inset-0 bg-black/50 flex items-center justify-center" />
```

## 📝 Adding New Gates

1. Edit `src/context/CircuitContext.jsx` - update `generateOpenQASM()` function
2. Edit `src/components/GatePalette.jsx` - add gate to the appropriate category
3. Test in CircuitComposer

Example:
```jsx
// In GatePalette.jsx gates object
singleQubit: [
  { name: 'NewGate', label: 'New Gate', description: 'Description' },
  // ... other gates
]

// In CircuitContext.jsx generateOpenQASM()
case 'NewGate':
  qasm += `newgate q[${g.qubitIndex}];\n`;
  break;
```

## 🔌 Backend Integration

### Step 1: Implement API Endpoint
```python
# Backend: api/views.py
@api_view(['POST'])
def execute_circuit(request):
    qasm = request.data.get('qasm')
    backend = request.data.get('backend', 'simulator')
    shots = request.data.get('shots', 1000)
    
    # Execute circuit
    result = simulate_circuit(qasm, shots)
    
    return Response({
        'job_id': f'JOB-{uuid4()}',
        'status': 'COMPLETED',
        'result': result.dict()
    })
```

### Step 2: Update ExecuteDialog
```jsx
// In ExecuteDialog.jsx
const response = await fetch('/api/execute/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ qasm, backend, shots })
});
```

## 🧪 Testing Components

### Test a Single Component:
```jsx
// Create a test file: components/__tests__/Toolbar.test.jsx
import { render, screen } from '@testing-library/react';
import { CircuitProvider } from '../context/CircuitContext';
import Toolbar from '../Toolbar';

test('renders toolbar', () => {
  render(
    <CircuitProvider>
      <Toolbar />
    </CircuitProvider>
  );
  expect(screen.getByText(/File/i)).toBeInTheDocument();
});
```

## 🐛 Common Issues & Solutions

### Issue: "useCircuit must be used within CircuitProvider"
**Solution**: Make sure the component is rendered inside `<CircuitProvider>`, which it is in App.jsx.

### Issue: Styles not loading
**Solution**: Make sure Tailwind CSS is imported in index.css with `@import "tailwindcss";`

### Issue: Gates not appearing
**Solution**: Check if gates array is being rendered properly in GatePalette.jsx

## 📚 Key Functions to Know

### CircuitContext Functions:
```jsx
// Add a gate at time position
addGate(time, qubitIndex, gateName, params)

// Remove a gate by ID
removeGate(gateId)

// Update gate parameters
updateGate(gateId, {params: {...}})

// Generate OpenQASM code
generateOpenQASM() // Returns string

// Save to localStorage
saveCircuit()

// Load from localStorage
loadCircuit(name)

// Get all saved circuits
getSavedCircuits()
```

## 🔄 Data Flow

```
User Action (e.g., drag gate)
    ↓
Component Handler (e.g., onDrop)
    ↓
Update Context (addGate)
    ↓
Re-render Components
    ↓
Visualizations Update
```

## 💻 Environment Setup

### Required:
- Node.js 16+
- npm 7+

### Optional:
- VS Code with Tailwind CSS IntelliSense
- ES7+ JavaScript snippets

## 📖 File Organization Tips

- Keep components focused on UI only
- Put business logic in CircuitContext
- Use meaningful component/file names
- Keep files under 300 lines

## 🎯 Next Development Tasks

1. **Implement Backend API** for circuit execution
2. **Add Unit Tests** for critical functions
3. **Implement Undo/Redo** using state history
4. **Add Circuit Templates** for common algorithms
5. **Implement Real-time Collaboration**
6. **Add PWA Support** for offline access

---

**Happy Coding! 🚀**

For questions or issues, refer to:
- [Tailwind Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)
