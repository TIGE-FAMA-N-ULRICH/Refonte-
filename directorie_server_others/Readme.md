# 🔐 **Secure Chatroom with MFA Integration**  

---

## 🔓 **Overview of Processes and Component Interactions**  

This document outlines the interactions and workflows between the components of the secure chatroom project, focusing on user registration, authentication with **Multi-Factor Authentication (MFA)**, and encrypted messaging.  

---

### **1. User Registration Workflow**  

1. **Frontend (Registration Form)**  
   - The user fills out a registration form (name, email, password, etc.).  
   - The frontend sends the data to the backend via the `POST /register` API endpoint.  

2. **Backend (Python)**  
   - Receives the registration details and forwards them to the MFA Service via `POST /mfa/register`.  
   - The MFA Service generates a **QR code** and returns it to the backend, which sends it to the frontend.  
   - The user scans the QR code using an authentication app (e.g., Google Authenticator).  

3. **Client-Side Key Generation**  
   - After completing the MFA setup, the frontend triggers a script (`client.py`) to generate **private and public keys** locally.  
   - The public key is sent to the backend via `POST /register/key` and stored in the main database.  

---

### **2. User Login Workflow**  

1. **Frontend (Login Form)**  
   - The user enters their email and password to log in.  
   - The frontend sends these credentials to the backend via the `POST /login` API.  

2. **Backend (Python)**  
   - Validates the user's credentials.  
   - Sends a request to the MFA Service (`POST /mfa/verify`) to validate the user's MFA token.  
   - Upon successful validation, the user is authenticated and gains access to the chatroom.  

---

### **3. Messaging Workflow**  

1. **Message Exchange (Sockets)**  
   - Users send encrypted messages to other users via sockets.  
   - The backend manages the sockets to transmit these encrypted messages.  

2. **Message Storage**  
   - Messages are stored in the main database in encrypted form.  
   - When a recipient retrieves their messages, they are transmitted via sockets and decrypted locally.  

---

## 📂 **Component Architecture**  

### **Frontend**  
- Hosts user-facing forms (registration, login) and the messaging interface.  
- Handles key generation using `client.py`.  
- Communicates with:  
  - The **backend** for user data and chat functionalities.  
  - The **MFA Service** for authentication workflows.  

### **Backend**  
- Manages business logic, including:  
  - Communication with the database for user and message management.  
  - Interactions with the MFA Service for authentication.  
- Provides centralized APIs for the frontend.  

### **MFA Service**  
- Independent service responsible for:  
  - User registration for MFA.  
  - Generating and verifying MFA tokens.  
- Maintains its own database for storing MFA-specific user details.  

### **Database**  
- **Primary Database**:  
  - Stores user profiles (e.g., public keys) and encrypted messages.  
- **MFA Database**:  
  - Maintains MFA-specific data (e.g., emails, tokens).  

---

## 📊 **Server Requirements**  

### **Minimum Configuration (3 Servers)**  

1. **Server 1**: Backend + Frontend  
   - The backend (Python) and frontend (React/Vite) are hosted together.  
   - The frontend is served statically via the backend (e.g., using Flask or Nginx).  

2. **Server 2**: MFA Service  
   - The MFA Service (JavaScript-based) runs independently to handle user authentication securely.  

3. **Server 3**: Primary Database  
   - Hosts the main database for user and message data.  

---

### **Advanced Configuration (4 Servers or More)**  

1. **Server 1**: Backend Only  
   - Handles core logic and socket communication independently.  

2. **Server 2**: Frontend Only  
   - Dedicated to serving the React/Vite frontend, optionally hosted on a CDN like Cloudflare.  

3. **Server 3**: MFA Service  
   - Remains independent for modularity and security.  

4. **Server 4**: Primary Database  
   - Dedicated to storing encrypted messages and user profiles, potentially hosted on a cloud service (e.g., AWS RDS).  

---

## 🛠️ **Server Integration and Deployment**  

### **Can Multiple Servers Be Used in a Single Project?**  
Yes. Each component (frontend, backend, MFA, database) functions as a service, communicating through **REST APIs** or **sockets**, regardless of being hosted on the same machine or separate servers.  

**Example**:  
- The frontend communicates with the backend via `http://backend-server-ip:5000`.  
- The backend calls the MFA Service at `http://mfa-server-ip:3000`.  

---

## 🔄 **Should Frontend and Backend Share the Same Server?**  

### **Advantages of Sharing Servers**  
1. **Simplified Management**: Easier to configure and deploy.  
2. **Cost-Effective**: Requires fewer resources.  
3. **Direct Communication**: Avoids cross-server latency.  

### **Disadvantages**  
1. **Limited Scalability**: Cannot handle high loads efficiently.  
2. **Reduced Security**: A compromised server affects both frontend and backend.  
3. **Deployment Challenges**: Any update requires redeploying both parts.  

---

## 🔒 **Should MFA Service Be Independent?**  

### **Advantages of a Separate MFA Service**  
1. **Modularity**: Can be reused across multiple projects.  
2. **Enhanced Security**: Isolated from other components, reducing the attack surface.  
3. **Ease of Updates**: Changes to MFA logic won’t affect other services.  

### **Disadvantages**  
1. **Increased Cost**: Requires additional resources.  
2. **Setup Complexity**: Requires secure communication setup between services.  

---

## 📂 **Architecture Overview**  

### **Frontend**  
- **Hosted on Server 1** (or separately).  
- Manages user interaction and requests to the backend for:  
  - Registration and login.  
  - Encrypted message exchange.  

### **Backend**  
- **Hosted on Server 2**.  
- Handles:  
  - Business logic and socket communication.  
  - Integration with the MFA Service and database.  

### **MFA Service**  
- **Hosted on Server 3**.  
- Provides REST APIs for:  
  - MFA configuration (QR code generation).  
  - MFA token validation during login.  

### **Database**  
- **Hosted on Server 4**.  
- Stores:  
  - User profiles (email, public keys).  
  - Encrypted messages.  

---

## 🔄 **Communication Workflow**  

1. **Registration**:  
   - Frontend sends registration data to the backend.  
   - Backend contacts the MFA Service for MFA setup.  
   - MFA Service generates a QR code, which is returned to the frontend for scanning.  

2. **Login**:  
   - Frontend sends login credentials and MFA tokens to the backend.  
   - Backend validates credentials and tokens with the MFA Service.  

3. **Messaging**:  
   - Frontend sends encrypted messages to the backend via sockets.  
   - Backend stores messages and delivers them to recipients.  

---  

This **README.md** is designed to be clear, professional, and comprehensive, ensuring effective communication of your project’s architecture and workflows. Let me know if you need further refinements! 🚀  
