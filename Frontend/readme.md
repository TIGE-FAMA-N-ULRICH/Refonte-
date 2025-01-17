# 🖥️ **Frontend Development Guide for Secure Chatroom Project**

---

## **1. Introduction**  

The **Secure Chatroom Project** integrates **Multi-Factor Authentication (MFA)** to enhance user security. As the backend and database implementations are complete, this guide provides details to help develop the **frontend components** related to:  
1. User **registration** and **login**.  
2. **2FA setup** using QR codes.  
3. **2FA verification** during login.  

This document includes the required endpoints, functionality, and implementation tips for building a modern, user-friendly interface using **React**.

---

## **2. Context: Completed Backend and Database**  

The backend has been implemented in **Node.js**, and the database is managed using **MariaDB**. It handles key user authentication tasks, including:  
- **Registration**: Users can create accounts with hashed passwords.  
- **Login**: Users authenticate using passwords and optionally 2FA tokens.  
- **2FA Setup**: QR codes are generated for users to enable 2FA in apps like Google Authenticator.  
- **2FA Verification**: Token verification ensures only authorized users can access the system.  

---

## **3. API Endpoints for Frontend Integration**  

### **3.1. User Registration**  
**Endpoint**: `/api/auth/register`  
**Method**: `POST`  
**Request Payload**:  
```json
{
  "username": "newuser",
  "password": "securepassword123"
}
```  
**Response**:  
- **Success**:  
  ```json
  {
    "message": "User registered successfully"
  }
  ```  
- **Error**:  
  ```json
  {
    "error": "Error registering user",
    "message": "Duplicate username"
  }
  ```

---

### **3.2. User Login**  
**Endpoint**: `/api/auth/login`  
**Method**: `POST`  
**Request Payload**:  
```json
{
  "username": "newuser",
  "password": "securepassword123"
}
```  
**Response**:  
- **Success**:  
  ```json
  {
    "message": "User logged in successfully",
    "username": "newuser",
    "isMfaActive": true
  }
  ```  
- **Error**:  
  ```json
  {
    "message": "Invalid credentials"
  }
  ```  

---

### **3.3. 2FA Setup**  
**Endpoint**: `/api/2fa/setup`  
**Method**: `POST`  
**Headers**:  
- Authorization: `Bearer <JWT Token>`  

**Response**:  
- **Success**:  
  ```json
  {
    "secret": "LASEE4TEJM4FULC6KQYEASL2LNKG422HMI6D422JHESXWVKSJA6A",
    "message": "2FA setup successfully",
    "QRCode": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }
  ```  
- **Error**:  
  ```json
  {
    "message": "Error setting up 2FA"
  }
  ```

---

### **3.4. 2FA Verification**  
**Endpoint**: `/api/2fa/verify`  
**Method**: `POST`  
**Headers**:  
- Authorization: `Bearer <JWT Token>`  

**Request Payload**:  
```json
{
  "username": "newuser",
  "token": "542736"
}
```  
**Response**:  
- **Success**:  
  ```json
  {
    "message": "2FA verified successfully",
    "token": "<JWT Token>"
  }
  ```  
- **Error**:  
  ```json
  {
    "message": "Invalid token"
  }
  ```

---

## **4. Frontend Features to Implement**  

### **4.1. Registration Page**  
- **Fields**:  
  - Username  
  - Password  
- **API Integration**:  
  - Use the `/api/auth/register` endpoint to create a new user.  
- **UX Considerations**:  
  - Validate inputs (e.g., non-empty, strong password).  
  - Display success or error messages clearly.  

---

### **4.2. Login Page**  
- **Fields**:  
  - Username  
  - Password  
- **API Integration**:  
  - Use the `/api/auth/login` endpoint.  
  - If `isMfaActive` is `true`, redirect the user to the **2FA Verification** page.  
- **UX Considerations**:  
  - Provide feedback for incorrect credentials.  
  - Optionally, remember the user with cookies or local storage.  

---

### **4.3. 2FA Setup Page**  
- **UI Components**:  
  - QR Code Viewer: Display the QR code received from the `/api/2fa/setup` endpoint.  
  - Success Message: Notify the user when 2FA is successfully enabled.  
- **API Integration**:  
  - Call `/api/2fa/setup` to retrieve the QR code and secret.  

---

### **4.4. 2FA Verification Page**  
- **Fields**:  
  - Token (6-digit code from Google Authenticator or similar app).  
- **API Integration**:  
  - Use `/api/2fa/verify` to validate the token.  
- **UX Considerations**:  
  - Validate the token format (numeric, 6 digits).  
  - Provide clear feedback for invalid tokens.  

---

## **5. UX Design Tips**  

### **5.1. Registration and Login**  
- Use a **clean layout** with simple, clear input fields.  
- Add input validation messages (e.g., password strength, invalid format).  
- Use **visual cues** for success or failure (e.g., green checkmarks, red error icons).  

### **5.2. 2FA Setup**  
- Display a **large QR code** for easy scanning.  
- Include instructions for using Google Authenticator or similar apps.  

### **5.3. 2FA Verification**  
- Make the token input field prominent.  
- Include a **timer** to indicate the token expiration time.  

---

## **6. Development Tools**  

- **Frontend Framework**: React.js with Vite for development.  
- **HTTP Client**: Axios for API requests.  
- **Styling**:  
  - Use TailwindCSS or Material-UI for responsive and modern design.  
- **Icons**: FontAwesome or HeroIcons for adding visual cues.  

---

## **7. Next Steps**  

1. Set up the project structure in React and initialize the Vite app.  
2. Create **routes** for:  
   - `/register`  
   - `/login`  
   - `/2fa/setup`  
   - `/2fa/verify`  
3. Integrate the provided API endpoints with Axios.  
4. Focus on **user-friendly design** for smooth interaction.  

---

## **8. Conclusion**  

By following this guide, you will develop the frontend components for registration, login, 2FA setup, and verification. This foundation will enable us to integrate secure messaging functionality in the next phase.  

Feel free to reach out if you have questions or need additional resources! 😊  
