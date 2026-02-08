# QuantumSim - Cloud-Based Quantum Computing Simulator

A cloud-based quantum computing simulator with user authentication and quantum circuit design capabilities.

## Features

- **User Authentication**: Secure login, signup, and OTP verification
- **Quantum Circuit Simulation**: Build and simulate quantum circuits
- **Cloud Storage**: Save and load quantum circuits from the cloud
- **Collaboration**: Share quantum circuits with other users
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios

### Backend
- Django 4.x
- Django REST Framework
- Simple JWT
- PostgreSQL

### Database
- PostgreSQL (production)
- SQLite (development)

## Installation

### Prerequisites
- Node.js 16+
- Python 3.8+
- PostgreSQL (optional, for production)

### Frontend
```bash
cd Frontent
npm install
npm run dev
```

### Backend
```bash
cd Backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=postgres://user:password@localhost:5432/quantumsim
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## API Documentation

API documentation is available at:
- Swagger: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Usage

1. **Sign up**: Create a new account with your email
2. **Verify OTP**: Check your email for verification code
3. **Login**: Use your credentials to access the dashboard
4. **Create Quantum Circuit**: Start building your quantum circuit
5. **Simulate**: Run the simulation to see results
6. **Save/Share**: Save your circuit to the cloud or share with others

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License

## Contact

For questions or support, please email us at quantum@example.com
