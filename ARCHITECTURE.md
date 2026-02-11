# System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React SPA)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           CircuitProvider (Context)                     │   │
│  │  - Global circuit state                                 │   │
│  │  - Gate operations                                      │   │
│  │  - Visualization data                                   │   │
│  │  - Execution tracking                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           △                                     │
│                           │ useCircuit()                        │
│                           │                                     │
│  ┌────────────┬─────────────────┬──────────────┬──────────┐   │
│  │            │                 │              │          │   │
│  v            v                 v              v          v   │
│┌──────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──┐│
││Pages │  │Components│  │Dialogs/Modal │  │Services  │  │UI││
│└──────┘  └──────────┘  └──────────────┘  └──────────┘  └──┘│
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │  Pages:                                                  │   │
│ │  ├─ CircuitComposer (Main)                              │   │
│ │  ├─ CodeView (QASM Editor)                              │   │
│ │  ├─ Results (History)                                   │   │
│ │  ├─ CustomGates (Manager)                               │   │
│ │  ├─ FileManager (Save/Load)                             │   │
│ │  └─ [Auth & Info Pages]                                 │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │  Components:                                             │   │
│ │  ├─ Toolbar (File ops, mode control)                    │   │
│ │  ├─ GatePalette (Gate catalog)                          │   │
│ │  ├─ CircuitCanvas (Circuit builder)                     │   │
│ │  ├─ SimulatorPanel (Visualizations)                     │   │
│ │  └─ [Layout components]                                 │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌──────────────────────┐  ┌─────────────────────┐             │
│ │  Dialogs:            │  │  Business Logic:    │             │
│ │  ├─ExecuteDialog     │  │  ├─ Circuit ops     │             │
│ │  └─ ResultsView      │  │  ├─ State mgmt      │             │
│ └──────────────────────┘  │  ├─ LocalStorage    │             │
│                           │  └─ QASM generation │             │
│                           └─────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                           △
                           │ HTTP/REST
                           │
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Django REST API)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Views.py   │  │ Simulators   │  │  Database    │           │
│  │              │  │              │  │              │           │
│  │ ├─ execute   │  │ ├─ Qiskit    │  │ ├─ Circuits  │           │
│  │ ├─ status    │  │ ├─ CustomSim │  │ ├─ Results   │           │
│  │ ├─ results   │  │ └─ Utils     │  │ └─ Jobs      │           │
│  │ └─ auth      │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  External Services:                                      │  │
│  │  ├─ IBM Quantum (for real hardware execution)            │  │
│  │  └─ Qiskit (open-source quantum computing framework)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Creates Circuit
```
User Action (Drag Gate)
    ↓
GatePalette.onDragStart()
    ↓ 
CircuitCanvas.onDrop()
    ↓
useCircuit().addGate()
    ↓
CircuitContext state updated
    ↓
All consuming components re-render:
├─ CircuitCanvas (visual)
├─ SimulatorPanel (visualizations)
├─ [Auto-save to localStorage]
└─ Toolbar (updates stats)
```

### User Runs Circuit
```
User clicks "Run"
    ↓
ExecuteDialog opens
    ↓
User selects backend & shots
    ↓
useCircuit().generateOpenQASM()
    ↓
POST /api/execute/ {qasm, backend, shots}
    ↓
Backend receives & queues job
    ↓
Returns job_id & status
    ↓
CircuitContext.setExecution()
    ↓
ResultsView displays
```

### Save/Load Circuit
```
Save:
  User clicks Save
    ↓
  Input circuit name
    ↓
  useCircuit().saveCircuit()
    ↓
  localStorage.setItem(`circuit_${name}`, JSON.stringify(data))
    ↓
  Success message

Load:
  User selects circuit from FileManager
    ↓
  useCircuit().loadCircuit(name)
    ↓
  localStorage.getItem(`circuit_${name}`)
    ↓
  CircuitContext state updated
    ↓
  All components re-render with loaded circuit
```

## Component Dependency Tree

```
App
├── CircuitProvider
│   ├── Navbar
│   ├── Routes
│   │   ├── Home (/)
│   │   │   └── [Static page]
│   │   │
│   │   ├── CircuitComposer (/circuit-composer)
│   │   │   ├── Toolbar
│   │   │   │   ├── File Menu
│   │   │   │   ├── Alignment Controls
│   │   │   │   └── Mode Toggle
│   │   │   ├── GatePalette
│   │   │   │   ├── Search Input
│   │   │   │   └── Gate Categories
│   │   │   ├── CircuitCanvas
│   │   │   │   ├── Qubit Wires
│   │   │   │   └── Gate Blocks
│   │   │   ├── SimulatorPanel
│   │   │   │   ├── Statevector View
│   │   │   │   ├── Histogram View
│   │   │   │   └── Q-Sphere View
│   │   │   ├── ExecuteDialog (conditional)
│   │   │   └── ResultsView (conditional)
│   │   │
│   │   ├── CodeView (/code-view)
│   │   │   └── Code Display
│   │   │
│   │   ├── Results (/results)
│   │   │   └── Results List/Modal
│   │   │
│   │   ├── CustomGates (/custom-gates)
│   │   │   └── Gate List/Dialog
│   │   │
│   │   ├── FileManager (/file-manager)
│   │   │   └── Circuit List/Dialog
│   │   │
│   │   ├── Documentation (/documentation)
│   │   │   └── [Static content]
│   │   │
│   │   └── [Other Pages]
│   │
│   └── Footer
```

## State Management Structure

```typescript
CircuitContext = {
  // Circuit Definition
  circuit: [
    {
      id: number,
      time: number,
      qubitIndex: number,
      gate: string,
      params: object
    },
    ...
  ],
  qubits: number,
  classicalBits: number,
  circuitName: string,

  // UI State
  mode: 'edit' | 'inspect',
  inspectIndex: number,
  alignment: 'free' | 'left' | 'layers',

  // Visualizations
  visualizations: {
    type: 'statevector' | 'histogram' | 'qsphere',
    data: object
  },

  // Execution
  execution: {
    jobId: string | null,
    status: 'pending' | 'submitted' | 'completed' | 'failed',
    result: object | null
  },

  // Custom Gates
  customGates: [
    {
      id: number,
      name: string,
      gates: array
    },
    ...
  ],

  // Functions
  addGate: (time, qubitIndex, gate, params?) => void,
  removeGate: (gateId) => void,
  updateGate: (gateId, updates) => void,
  clearCircuit: () => void,
  generateOpenQASM: () => string,
  addCustomGate: (name, gates) => void,
  removeCustomGate: (gateId) => void,
  saveCircuit: () => void,
  loadCircuit: (name) => boolean,
  getSavedCircuits: () => array,
  // ... setters for state values
}
```

## API Integration Points

### Execute Circuit
```
POST /api/execute/
Content-Type: application/json

Request:
{
  "qasm": "OPENQASM 2.0;...",
  "backend": "simulator" | "ibm_quantum",
  "shots": 100-10000
}

Response:
{
  "job_id": "JOB-xxxxx",
  "status": "submitted" | "running" | "completed" | "failed",
  "result": {
    "counts": {"00": 512, "11": 488},
    "execution_time": 123,
    "statevector": [...],
    ...
  }
}
```

### Get Job Status
```
GET /api/jobs/{job_id}/

Response:
{
  "job_id": "JOB-xxxxx",
  "status": "completed",
  "counts": {...},
  "execution_time": 123,
  ...
}
```

## Technology Stack

### Frontend
- **React 19.2.0** - UI framework
- **React Router 7.13.0** - Routing
- **Tailwind CSS 4.1.18** - Styling
- **Lucide React 0.563.0** - Icons
- **Vite 7.2.4** - Build tool

### Backend
- **Django** - Web framework
- **Django REST Framework** - API
- **Qiskit** - Quantum computing SDK
- **PostgreSQL** - Database

### DevTools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Pytest** - Testing

## Deployment Architecture

```
┌────────────────────────────────────────┐
│         CDN / Static Hosting            │
│  (Frontend built with npm run build)    │
└────────────────────────────────────────┘
           △
           │ API calls
           │
┌────────────────────────────────────────┐
│        Django Backend Server            │
│  ├─ REST API endpoints                  │
│  ├─ Quantum simulators                  │
│  └─ Database                            │
└────────────────────────────────────────┘
           △
           │ Submit jobs
           │
┌────────────────────────────────────────┐
│       IBM Quantum Platform              │
│  (For real quantum processor access)    │
└────────────────────────────────────────┘
```

## Security Considerations

1. **Frontend**
   - Input validation for circuit parameters
   - XSS protection via React's automatic escaping
   - CORS policy enforcement

2. **Backend**
   - CSRF protection
   - Input validation (QASM parsing)
   - Rate limiting for API endpoints
   - Authentication/Authorization
   - Secure job queuing

3. **Data**
   - LocalStorage for temporary circuit storage
   - Database for persistent user data
   - Encrypted API communications (HTTPS)
   - User isolation (owned circuits)

## Performance Optimization

### Frontend
- Code splitting by routes
- Lazy loading of components
- Memoization of expensive computations
- Virtual scrolling for large lists (future)

### Backend
- Async task queue for long-running simulations
- Circuit caching
- Result pagination
- Database indexing

## Scalability Plan

1. **Horizontal Scaling**
   - Load balancer for backend
   - Distributed job queue (Celery)
   - Database replication

2. **Caching**
   - Redis for job status caching
   - Frontend caching strategies

3. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Usage analytics

---

**Architecture Version**: 1.0
**Last Updated**: February 11, 2026
