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
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = "MFA_server_IP_Add"; 
const DB_PORT = 3306;        
const DB_USER = "mfa_server";      
const DB_PASS = "passwword"; 
const DB_NAME = "database";   

export const dbConnect = async () => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
        });
        console.log(`MariaDB conection SUCCESS: ${connection.config.host}`)
        return connection;
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
        console.error(`MariaDB connection FAIL`);
        process.exit(1);
    }
}

export default dbConnect;


```  

#### **Changes from MongoDB Configuration**  
- Replaced MongoDB's connection string (`mongodb+srv`) with MariaDB configuration.  
- Removed MongoDB dependencies and replaced them with the `mysql2/promise` package.  

---

### **2.2. Backend Functionality Adaptation**  

All MongoDB-based functions (`findOne`, `save`, etc.) were rewritten as SQL queries using `mysql2/promise`.  

- **Finding a User by Username**:  
   ```javascript
   export const findUserByUsername = async (username) =>{
        const connection = await dbConnect();
        const query = `SELECT * FROM users WHERE username = ?`;
        const [rows] = await connection.execute(query, [username]);
        await connection.end();
        return rows[0]; 
    };

   ```  

- **Updating User Information**:  
   ```javascript
    export const updateUser = async (username, data) =>{
        const connection = await dbConnect();
        const query = `UPDATE users SET twoFactorSecret = ?, isMfaActive = ? WHERE username = ?`;
        await connection.execute(query, [data.twoFactorSecret, data.isMfaActive, username]);
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
import { v4 as uuidv4 } from 'uuid';

const query = `INSERT INTO users (_id, username, password, isMfaActive) VALUES (?, ?, ?, ?)`;
const _id = uuidv4();
await connection.execute(query, [_id, username, hashedPassword, false]);
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

const query = `UPDATE users SET twoFactorSecret = ?, isMfaActive = ? WHERE username = ?`;
await connection.execute(query, [data.twoFactorSecret, data.isMfaActive, username]);
```  

---

### **3.3. `ERR_HTTP_HEADERS_SENT` Error During Logout**  

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
        // Vérifie si l'utilisateur est authentifié
        if (!req.user) {
            console.warn("Unauthorized user trying to log out");
            return res.status(401).json({ message: "Unauthorized user" });
        }

        // Vérifie si les en-têtes ont déjà été envoyés
        if (res.headersSent) {
            console.warn("Headers already sent before logout");
            return;
        }

        // Déconnexion de l'utilisateur
        req.logout((err) => {
            if (err) {
                if (res.headersSent) {
                    console.warn("Headers already sent during req.logout");
                    return;
                }

                console.error("Error during logout:", err.message);
                return res.status(500).json({ message: "Error logging out", error: err.message });
            }

            // Détruire la session
            req.session.destroy((err) => {
                if (err) {
                    if (res.headersSent) {
                        console.warn("Headers already sent during session destruction");
                        return;
                    }

                    console.error("Error during session destruction:", err.message);
                    return res.status(500).json({ message: "Error destroying session", error: err.message });
                }

                // Effacer les cookies
                if (res.headersSent) {
                    console.warn("Headers already sent before clearing cookies");
                    return;
                }

                res.clearCookie("connect.sid");

                // Vérifie avant d'envoyer la réponse finale
                if (res.headersSent) {
                    console.warn("Headers already sent before final response");
                    return;
                }

                // Envoie la réponse finale
                console.log("Sending response: User logged out");
                return res.status(200).json({ message: "User logged out successfully" });
            });
        });
    } catch (error) {
        if (res.headersSent) {
            console.warn("Headers already sent during unexpected error handling");
            return;
        }

        console.error("Unexpected error during logout:", error.message);
        return res.status(500).json({ message: "Unexpected error during logout", error: error.message });
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

