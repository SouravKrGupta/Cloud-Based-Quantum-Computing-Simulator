# Class Diagram for QuantumSim

## Overview

This document provides a detailed class diagram of the QuantumSim system, including both frontend and backend components.

## Backend Classes

### User Management Classes

```mermaid
classDiagram
    class CustomUser {
        +id: int
        +email: string
        +password: string
        +first_name: string
        +last_name: string
        +is_verified: boolean
        +created_at: datetime
        +updated_at: datetime
        +__str__(): string
    }
    
    class OTPVerification {
        +id: int
        +user: CustomUser
        +otp_code: string
        +expires_at: datetime
        +created_at: datetime
        +__str__(): string
    }
    
    CustomUser "1" -- "0..1" OTPVerification
```

### Quantum Circuit Classes

```mermaid
classDiagram
    class QuantumCircuit {
        +id: int
        +user: CustomUser
        +name: string
        +description: string
        +qubits: int
        +gates: JSONField
        +is_public: boolean
        +shared_with: CustomUser[]
        +created_at: datetime
        +updated_at: datetime
        +__str__(): string
    }
    
    class SimulationResult {
        +id: int
        +circuit: QuantumCircuit
        +results: JSONField
        +created_at: datetime
        +__str__(): string
    }
    
    CustomUser "1" -- "0..*" QuantumCircuit
    QuantumCircuit "1" -- "0..*" SimulationResult
```

### Contact Message Classes

```mermaid
classDiagram
    class ContactMessage {
        +id: int
        +name: string
        +email: string
        +subject: string
        +message: string
        +created_at: datetime
        +__str__(): string
    }
```

## Frontend Components

### Main Pages

```mermaid
classDiagram
    class Home {
        +isLoggedIn: boolean
        +secondaryCtaRoute: string
        +secondaryCtaLabel: string
        +footerCtaLabel: string
        +statistics: object
        +fetchStatistics(): Promise
    }
    
    class About {
    }
    
    class Contact {
        +formData: object
        +errors: object
        +loading: boolean
        +success: boolean
        +handleSubmit(): Promise
    }
    
    class CircuitComposer {
        +circuit: object
        +gates: object[]
        +qubits: int
        +selectedGate: object
        +handleGateSelect(): void
        +handleGateDrop(): void
        +handleCircuitChange(): void
        +handleSimulation(): void
    }
    
    class VoiceQuantumSimulator {
        +isListening: boolean
        +transcript: string
        +response: string
        +status: string
        +handleStartListening(): void
        +handleStopListening(): void
        +handleTextToCircuit(): Promise
    }
    
    class ZXLab {
        +circuit: object
        +zxGraph: object
        +selectedGate: object
        +showCodePanel: boolean
        +codeLanguage: string
        +handleGateSelect(): void
        +handleGateDrop(): void
        +handleCircuitChange(): void
        +handleSimulate(): void
        +handleSimplify(): void
        +handleConvertToCircuit(): void
        +handleCodeGeneration(): void
    }
```

### Components

```mermaid
classDiagram
    class Navbar {
        +isLoggedIn: boolean
        +handleLogout(): void
    }
    
    class Footer {
    }
    
    class CircuitCanvas {
        +circuit: object
        +gates: object[]
        +selectedGate: object
        +onGateSelect: function
        +onGateDrop: function
        +onCircuitChange: function
    }
    
    class ZXGraphCanvas {
        +zxGraph: object
        +onGraphChange: function
    }
    
    class VoiceCommand {
        +onCommandExecuted: function
        +startListening(): void
        +stopListening(): void
    }
    
    class CodeGeneration {
        +circuit: object
        +language: string
        +onCodeGenerated: function
    }
    
    class GatePalette {
        +onGateSelect: function
    }
    
    class SimulatorPanel {
        +circuit: object
        +onSimulate: function
    }
```

## API Views

```mermaid
classDiagram
    class HealthCheckView {
        +get(): Response
    }
    
    class StatisticsView {
        +get(): Response
    }
    
    class UserRegistrationView {
        +post(): Response
    }
    
    class UserLoginView {
        +post(): Response
    }
    
    class UserLogoutView {
        +post(): Response
    }
    
    class OTPVerificationView {
        +post(): Response
    }
    
    class ResendOTPView {
        +post(): Response
    }
    
    class UserProfileView {
        +get(): Response
        +put(): Response
    }
    
    class ForgotPasswordView {
        +post(): Response
    }
    
    class ResetPasswordView {
        +post(): Response
    }
    
    class QuantumCircuitView {
        +get(): Response
        +post(): Response
    }
    
    class QuantumCircuitDetailView {
        +get(): Response
        +put(): Response
        +delete(): Response
    }
    
    class QuantumCircuitSimulationView {
        +post(): Response
    }
    
    class QuantumCircuitSimulationResultsView {
        +get(): Response
    }
    
    class QuantumCircuitShareView {
        +post(): Response
    }
    
    class QuantumCircuitPublicView {
        +post(): Response
    }
    
    class PublicQuantumCircuitsView {
        +get(): Response
    }
    
    class ContactMessageView {
        +post(): Response
    }
    
    class ContactMessagesListView {
        +get(): Response
    }
    
    class ContactMessageDetailView {
        +get(): Response
    }
    
    class VoiceCommandView {
        +post(): Response
    }
    
    class TextToCircuitView {
        +post(): Response
    }
    
    class PythonCodeGenerationView {
        +post(): Response
    }
    
    class QASMGenerationView {
        +post(): Response
    }
    
    class CircuitToZXGraphView {
        +post(): Response
    }
    
    class ZXGraphSimplificationView {
        +post(): Response
    }
    
    class ZXGraphToCircuitView {
        +post(): Response
    }
```

## API Serializers

```mermaid
classDiagram
    class UserRegistrationSerializer {
    }
    
    class UserLoginSerializer {
    }
    
    class UserSerializer {
    }
    
    class OTPVerificationSerializer {
    }
    
    class ForgotPasswordSerializer {
    }
    
    class ResetPasswordSerializer {
    }
    
    class QuantumCircuitSerializer {
    }
    
    class SimulationResultSerializer {
    }
    
    class ContactMessageSerializer {
    }
```
