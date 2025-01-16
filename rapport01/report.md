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
curl -X POST http://192.168.1.101:7002/api/auth/register \
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
    "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```  

---

### **2. User Login (`POST /api/auth/login`)**  
**Request**:  
```bash
curl -X POST http://192.168.1.101:7002/api/auth/login \
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

### **3. MFA Setup (`POST /api/auth/2fa/setup`)**  
**Request**:  
```bash
curl -X POST http://192.168.1.101:7002/api/auth/2fa/setup \
-H "Content-Type: application/json" \
--cookie "connect.sid=<session_id>"
```  

**Response**:  
```json
{
    "secret": "ABC123456...",
    "message": "2FA setup successfully",
    "QRCode": "data:image/png;base64,iVBORw0KGgoAAA..."
}
```  

---

### **4. MFA Verification (`POST /api/auth/2fa/verify`)**  
**Request**:  
```bash
curl -X POST http://192.168.1.101:7002/api/auth/2fa/verify \
-H "Content-Type: application/json" \
--cookie "connect.sid=<session_id>" \
-d '{
    "token": "123456"
}'
```  

**Success Response**:  
```json
{
    "message": "2FA verified successfully",
    "token": "<jwt_token>"
}
```  

**Failure Response**:  
```json
{
    "message": "Invalid token"
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

