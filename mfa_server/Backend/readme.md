# 🔐 **Backend - Multi-Factor Authentication (MFA)**  

---

## 📖 **Description**  

This directory contains the backend code for the **MFA** application. The backend is responsible for:  
- **User Registration and Login**: Securely managing user accounts.  
- **2FA Configuration and Verification**: Enabling and validating two-factor authentication.  

---

## 🛠️ **Technologies Used**  

- **Node.js**  
- **Express.js**  
- **Passport.js**  
- **Speakeasy**  

---

## 🏗️ **Architecture**  

The backend is organized for maintainability and scalability:  

```plaintext
backend/
├── routes/                   # Authentication routes
├── models/                   # Data models for users and sessions
├── config/                   # Configuration files (Passport.js, database, etc.)
└── app.js                    # Main server file
```  

---

## 🚀 **Installation**  

### **Step 1: Navigate to the Backend Directory**  
```bash
cd backend
```  

### **Step 2: Install Dependencies**  
```bash
npm install
```  

### **Step 3: Configure Environment Variables**  
- Create a `.env` file in the `backend` directory.  
- Use the provided `.env.example` file as a template to set up your variables.  

### **Step 4: Start the Server**  
```bash
npm start
```  

---

## ✨ **Key Features**  

- **2FA with Speakeasy**:  
   - Securely generates and verifies time-based one-time passwords (TOTP).  
- **Session Management with Passport.js**:  
   - Handles user authentication and session management.  
