# 🔐 **Detailed Report: Validation of MFA Server Connection to MariaDB**  

---

## **1. Context and Objective**  

The objective of this task was to connect a **Node.js-based MFA server** to a **MariaDB database** and validate the interaction. The focus was on:  

1. Establishing a secure connection to MariaDB with appropriate configuration.  
2. Replacing old MongoDB commands with equivalent SQL queries for MariaDB.  
3. Testing key functionalities: user registration, login, 2FA setup and verification, and logout.  
4. Addressing errors encountered during testing and implementing robust solutions.  

---

## **2. Work Accomplished**  

### **2.1. Connection Configuration**  

The connection between the Node.js server and MariaDB was set up in the `dbConnect.js` file. The following configuration was used:  

```javascript
import mysql from "mysql2/promise";

export const dbConnect = async () => {
    try {
        const connection = await mysql.createConnection({
            host: "192.168.150.143",   // MariaDB server IP
            user: "mfa_server",        // MariaDB username
            password: "mfaP@ssw97ord", // MariaDB password
            database: "project_db",    // Database name
        });
        console.log("MariaDB connection SUCCESS");
        return connection;
    } catch (error) {
        console.error(`MariaDB connection FAIL: ${error.message}`);
        process.exit(1);
    }
};
```  

#### **Changes from MongoDB Configuration**  
- Replaced MongoDB's connection string (`mongodb+srv`) with MariaDB configuration.  
- Removed MongoDB dependencies and replaced them with the `mysql2/promise` package.  

---

### **2.2. Backend Functionality Adaptation**  

All MongoDB-based functions (`findOne`, `save`, etc.) were rewritten as SQL queries using `mysql2/promise`.  

- **Finding a User by Username**:  
   ```javascript
   export const findUserByUsername = async (username) => {
       const connection = await dbConnect();
       const [rows] = await connection.execute("SELECT * FROM users WHERE username = ?", [username]);
       await connection.end();
       return rows[0]; // Return the first matching user
   };
   ```  

- **Updating User Information**:  
   ```javascript
   export const updateUser = async (username, data) => {
       const connection = await dbConnect();
       await connection.execute(
           "UPDATE users SET twoFactorSecret = ?, isMfaActive = ? WHERE username = ?",
           [data.twoFactorSecret, data.isMfaActive, username]
       );
       await connection.end();
   };
   ```  

These adjustments replaced all MongoDB logic with equivalent SQL queries for MariaDB.  

---

## **3. Challenges Encountered and Solutions Implemented**  

### **3.1. Error During User Insertion**  

#### **Error**:  
```text
Field '_id' doesn't have a default value
```  

#### **Cause**:  
The `_id` field in the `users` table was defined as `NOT NULL`, but no UUID was being provided during user insertion.  

#### **Solution**:  
Manually generated a UUID in the application using the `uuid` library:  

```javascript
import { v4 as uuidv4 } from "uuid";

const _id = uuidv4(); // Generate a UUID
await connection.execute("INSERT INTO users (_id, username, password) VALUES (?, ?, ?)", [_id, username, hashedPassword]);
```  

---

### **3.2. Error in `twoFactorSecret` Field**  

#### **Error**:  
```text
Bind parameters must not contain undefined. To pass SQL NULL specify JS null
```  

#### **Cause**:  
A typo in the code caused an `undefined` value to be passed for the `twoFactorSecret` column.  

#### **Solution**:  
Corrected the typo in the `updateUser` function. Updated implementation:  

```javascript
await connection.execute(
    "UPDATE users SET twoFactorSecret = ?, isMfaActive = ? WHERE username = ?",
    [data.twoFactorSecret, data.isMfaActive, username]
);
```  

---

### **3.3. Undefined `req.user` in `/api/2fa/verify`**  

#### **Error**:  
When calling the `/api/2fa/verify` endpoint, the `req.user` property was empty, resulting in errors.  

#### **Cause**:  
The middleware for decoding JWTs was not applied to this endpoint.  

#### **Solution**:  
Added a global JWT middleware to validate tokens and populate `req.user`.  

```javascript
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, "my-jwt-secret");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
```  

Applied the middleware to the `/api/2fa/verify` route:  

```javascript
router.post("/api/2fa/verify", authenticate, verify2FA);
```  

---

### **3.4. `ERR_HTTP_HEADERS_SENT` Error During Logout**  

#### **Error**:  
```text
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```  

#### **Cause**:  
This occurred when multiple responses were being sent in the `logout` function due to errors in `req.logout` or `req.session.destroy`.  

#### **Solution**:  
Added checks to ensure only one response is sent:  

```javascript
if (res.headersSent) {
    console.warn("Headers already sent for this request.");
    return;
}
```  

Implemented in the `logout` controller:  

```javascript
export const logout = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized user" });

        req.logout((err) => {
            if (err) return res.status(500).json({ message: "Error logging out", error: err.message });

            req.session.destroy((err) => {
                if (err) return res.status(500).json({ message: "Error destroying session", error: err.message });

                res.clearCookie("connect.sid");
                res.status(200).json({ message: "User logged out successfully" });
            });
        });
    } catch (error) {
        if (res.headersSent) {
            console.warn("Headers already sent for this request.");
            return;
        }
        res.status(500).json({ message: "Unexpected error during logout", error: error.message });
    }
};
```  

---

## **4. Conclusion**  

The following functionalities of the MFA server have been successfully adapted and validated with MariaDB:  
- User registration and login.  
- 2FA setup and verification.  
- Secure logout.  

All encountered bugs have been resolved, ensuring a robust and secure system.  

This implementation serves as a solid foundation for future enhancements, including:  
- Adding rate-limiting to prevent brute-force attacks.  
- Enabling SSL/TLS for all API communication.  

