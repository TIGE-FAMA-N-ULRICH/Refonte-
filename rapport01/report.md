# 📊 **Team Report: Secure Chatroom Project**

---

## 🖋️ **Introduction**  

The **Secure Chatroom Project** aims to develop a messaging application with the following key features:  
- **Multi-Factor Authentication (MFA)** to secure user access.  
- **End-to-End Encrypted Messaging** with user-managed keys.  
- **Modern and Responsive User Interface** built with React and Vite.  
- **On-Premise Infrastructure Simulation** using dedicated servers for MFA, backend, database, and frontend.  

---

## 🛠️ **Technical Decisions**  

### **1. Database: MariaDB**  
The project uses **MariaDB** as the database management system. Below are the defined tables:  

#### **Table: `users`**  
Stores essential user authentication and management information.  

| Field              | Type         | Constraints                                                  |
|--------------------|--------------|-------------------------------------------------------------|
| `id`               | CHAR(36)     | PRIMARY KEY, UUID                                           |
| `username`         | VARCHAR(255) | UNIQUE, NOT NULL                                            |
| `password`         | TEXT         | NOT NULL                                                   |
| `is_mfa_active`    | BOOLEAN      | DEFAULT FALSE                                               |
| `two_factor_secret`| TEXT         | NULLABLE                                                    |
| `public_key`       | TEXT         | NULLABLE                                                    |
| `private_key`      | TEXT         | NULLABLE                                                    |
| `session_token`    | TEXT         | NULLABLE                                                    |
| `created_at`       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                   |
| `updated_at`       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       |  

---

#### **Table: `messages`**  
Manages exchanged messages between users.  

| Field              | Type         | Constraints                                                  |
|--------------------|--------------|-------------------------------------------------------------|
| `id`               | CHAR(36)     | PRIMARY KEY, UUID                                           |
| `sender_id`        | CHAR(36)     | FOREIGN KEY (`users.id`)                                    |
| `receiver_id`      | CHAR(36)     | FOREIGN KEY (`users.id`)                                    |
| `encrypted_message`| TEXT         | NOT NULL                                                   |
| `signature`        | TEXT         | NULLABLE                                                    |
| `timestamp`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                   |  

---

#### **Table: `mfa_logs`**  
Tracks events related to MFA authentication.  

| Field              | Type         | Constraints                                                  |
|--------------------|--------------|-------------------------------------------------------------|
| `id`               | CHAR(36)     | PRIMARY KEY, UUID                                           |
| `user_id`          | CHAR(36)     | FOREIGN KEY (`users.id`)                                    |
| `event`            | VARCHAR(255) | NOT NULL                                                   |
| `ip_address`       | VARCHAR(255) | NULLABLE                                                    |
| `timestamp`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                   |  

---

### **2. Technologies Used**  
- **MFA Backend**: Node.js with Express and Passport.js  
- **Main Backend**: Python with socket management for messaging  
- **Database**: MariaDB hosted on a dedicated server  
- **Frontend**: React with Vite for a modern and performant UI  

---

## 🔍 **MFA Server API Examples**  

### **1. User Registration (`POST /api/auth/register`)**  
**Request**:  
```bash
curl -X POST http://mfa-server_IP_Addr:7002/api/auth/register \
-H "Content-Type: application/json" \
-d '{
    "username": "newuser",
    "password": "securepassword123"
}'
```  

**Response**:  
```json
{
    "message": "User registered successfully",
}
```  

---

### **2. User Login (`POST /api/auth/login`)**  
**Request**:  
```bash
curl -X POST http://mfa-server_IP_Addr:7002/api/auth/login \
-H "Content-Type: application/json" \
-d '{
    "username": "newuser",
    "password": "securepassword123"
}'
```  

**Response**:  
```json
{
    "message": "User logged in successfully",
    "username": "newuser",
    "isMfaActive": true
}
```  

---

### **3. User Logout (`POST /api/auth/logout`)**  
**Request**:  
```bash
curl -X POST http://192.168.1.101:7002/api/auth/logout \
-H "Content-Type: application/json" \
--cookie "connect.sid=<session_id>"
```

**Success Response**:  
```json
{
  "message": "User logged out successfully"
}
```

**Failure Response**:  
```json
{
    "message":"Unauthorized user"
}
```  

---

### **4. MFA Setup (`POST /api/auth/2fa/setup`)**  
**Request**:  
```bash
curl -X POST http://mfa-server_IP_Addr:7002/api/auth/2fa/setup \
-H "Content-Type: application/json" \
--cookie "connect.sid=<session_id>"
```  

**Success Response**:  
```json
{
  "secret": "LASEE4TEJM4FULC6KQYEASL2LNKG422HMI6D422JHESXWVKSJA6A",
  "message": "2FA setup successfully",
  "QRCode": "data:image/png;base64,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"

```

**Failure Response**:  
```json
{
    "message":"Unauthorized user"
}
```

---

### **5. MFA Verification (`POST /api/auth/2fa/verify`)**  
**Request**:  
```bash
curl -X POST http://mfa-server_IP_Addr:7002/api/auth/2fa/verify \
-H "Content-Type: application/json" \
--cookie "connect.sid=<session_id>" \
-d '{
  "token": "054704"
}'
```  

**Success Response**:  
```json
{
  "message": "2FA verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld3VzZXIiLCJpYXQiOjE3MzcwMjU4MjQsImV4cCI6MTczNzAyOTQyNH0.VPCGD731eGbQ1gV-16v1BX9487vCYgNSJigjKfcUyjw"
}
```  

**Failure Response**:  
```json
{
    "message": "Invalid token"
}
```  

### **6. MFA Verification (`POST /api/auth/2fa/reset`)**  
**Request**:  
```bash
curl -X POST http://mfa-server_IP_Addr:7002/api/auth/2fa/reset \
-H "Content-Type: application/json" \
--cookie "connect.sid=<session_id>"
```  

**Success Response**:  
```json
{
  "message": "2FA reset successfully"
}
```  

**Failure Response**:  
```json
{
    error: "Error resetting 2FA", message: error.message
}
```  

---

## 🔧 **Team Coordination and Tracking**  

### **Tools Used**  
- **GitHub**: For task tracking and version control.  
- **WhatsApp**: Quick communication between team members.  
- **Microsoft Teams**: Weekly calls for team coordination.  

### **Timeline**  

| Task                                      | Deadline              | Responsible         |
|-------------------------------------------|-----------------------|---------------------|
| Configure database and tables             | **Sunday, Jan 21, 2025** | **Tapsoba**        |
| Complete MFA server                       | **Tuesday, Jan 25, 2025** | **Tapsoba**        |
| Implement backend socket logic            | **Friday, Jan 26, 2025**  | **Ulrich**         |
| Start frontend development                | **TBD**                 | **New Recruit**    |  

---

## 🚀 **Next Steps**  

1. Validate the MFA server routes for registration and login.  
2. Create and test tables in MariaDB.  
3. Integrate communication between the main backend and the MFA server.  
4. Finalize backend and frontend tasks before full system integration.  

