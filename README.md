# QuantumSim - Cloud-Based Quantum Computing Simulator

## Overview

QuantumSim is a cloud-based quantum computing simulator that provides an intuitive interface for designing, simulating, and visualizing quantum circuits. It supports voice commands, ZX-calculus visualization, and real-time quantum circuit simulation.

## Architecture

### Frontend

- **Technology Stack**: React 19, Tailwind CSS 4, Vite, React Router, Axios, Lucide React
- **Key Features**:
  - Intuitive drag-and-drop quantum circuit composer
  - Real-time quantum state visualization
  - Voice command recognition for circuit creation
  - Quantum state visualization with interactive Bloch spheres and state vector diagrams
  - ZX-calculus graph visualization and simplification

### Backend

- **Technology Stack**: Django 4.2, Django REST Framework, MySQL, Django REST Framework SimpleJWT, Social Django
- **Key Features**:
  - User authentication and authorization
  - Quantum circuit simulation using Qiskit
  - ZX-calculus graph generation and simplification
  - Circuit to ZX-graph conversion and vice versa
  - Contact form handling and storage
  - Real-time statistics endpoint

## Data Flow

### Quantum Circuit Composition and Simulation

1. **User composes quantum circuit** in the frontend using drag-and-drop interface
2. **Circuit data is sent to backend** via POST request to `/api/simulate/`
3. **Backend simulates circuit** using Qiskit and returns results
4. **Frontend visualizes results** with probability distributions and quantum state diagrams

### ZX-Calculus Visualization

1. **User designs quantum circuit** in the frontend
2. **Circuit is converted to ZX-graph** via POST request to `/api/circuit-to-zx/`
3. **Backend processes circuit** using zx-calculus library
4. **ZX-graph is returned** to frontend for visualization
5. **User can simplify ZX-graph** via POST request to `/api/zx-simplify/`
6. **Simplified circuit can be retrieved** from ZX-graph via POST request to `/api/zx-to-circuit/`

### Voice Command Processing

1. **User issues voice command** using frontend voice interface
2. **Voice is recorded and sent to backend** via POST request to `/api/voice-command/`
3. **Backend processes command** using speech recognition
4. **Command is executed** and results are returned to frontend
5. **Frontend updates UI** based on command execution

## User Cases

### User Registration and Authentication

- **New user signs up** by providing email and password
- **User verifies email** using OTP sent to registered email
- **User logs in** using email and password or Google OAuth
- **Password reset** functionality via email verification

### Quantum Circuit Management

- **Create new quantum circuit** with desired number of qubits and gates
- **Save quantum circuits** to user account
- **Load saved circuits** from user profile
- **Share circuits** with other users
- **Make circuits public** for everyone to access

### Contact Form

- **User fills out contact form** with name, email, subject, and message
- **Form data is sent to backend** via POST request to `/api/contact/`
- **Backend stores message** in MySQL database
- **User receives confirmation** that message has been sent

## API Endpoints

### Authentication

- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `POST /api/verify-otp/` - OTP verification
- `POST /api/resend-otp/` - Resend OTP
- `POST /api/forgot-password/` - Forgot password
- `POST /api/reset-password/` - Reset password

### Quantum Circuits

- `GET /api/circuits/` - Get all user's circuits
- `POST /api/circuits/` - Create new circuit
- `GET /api/circuits/<int:circuit_id>/` - Get specific circuit
- `PUT /api/circuits/<int:circuit_id>/` - Update circuit
- `DELETE /api/circuits/<int:circuit_id>/` - Delete circuit
- `POST /api/simulate/` - Simulate circuit

### ZX-Calculus

- `POST /api/circuit-to-zx/` - Convert circuit to ZX-graph
- `POST /api/zx-simplify/` - Simplify ZX-graph
- `POST /api/zx-to-circuit/` - Convert ZX-graph to circuit

### Voice Commands

- `POST /api/voice-command/` - Process voice command
- `POST /api/text-to-circuit/` - Process text command to circuit

### Code Generation

- `POST /api/generate-python/` - Generate Python code from circuit
- `POST /api/generate-qasm/` - Generate QASM code from circuit

### Statistics

- `GET /api/statistics/` - Get platform statistics

### Contact

- `POST /api/contact/` - Submit contact message
- `GET /api/contact/messages/` - Get all contact messages (admin only)
- `GET /api/contact/messages/<int:message_id>/` - Get specific contact message (admin only)

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+

### Backend Setup

1. Navigate to Backend directory:
   ```bash
   cd Backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/macOS:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure MySQL database in `Backend/backend/settings.py`

6. Run migrations:
   ```bash
   python manage.py migrate
   ```

7. Start development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to Frontent directory:
   ```bash
   cd Frontent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Running the Application

- Backend will be available at `http://localhost:8000`
- Frontend will be available at `http://localhost:5173`

## Technologies Used

### Frontend

- React 19
- Tailwind CSS 4
- Vite
- React Router
- Axios
- Lucide React
- Web Speech API

### Backend

- Django 4.2
- Django REST Framework
- MySQL
- Django REST Framework SimpleJWT
- Social Django
- Qiskit
- zx-calculus library

## Contributors

- **Dr. Kuntal Mukherjee** - Project Mentor (Faculty)
- **Ishan Sinha** - M.Tech Student (Frontend & Backend)
- **Kaushik Tirkey** - M.Tech Student (Frontend & Backend)

## License

This project is licensed under the MIT License.
