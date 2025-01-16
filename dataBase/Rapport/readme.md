# 📖 **Implementation Guide for the Database System**

This document serves as a **comprehensive guide** for the installation, configuration, and connection to the MariaDB database used in this project. It includes all steps taken to ensure a reproducible setup across different environments.

---

## **1. Introduction**

This project consists of:  
1. A **Multi-Factor Authentication (MFA) server**, hosted on a Kali Linux virtual machine.  
2. A **backend server** for managing user messaging, hosted on a Debian virtual machine.  
3. A **MariaDB database server**, hosted on the primary Debian virtual machine.  

This guide details the database configuration and how different servers interact with it.

---

## **2. Architecture**

### **Logical Architecture Overview**  

- **MariaDB Database Server**: Hosted on a primary Debian VM (`DB_SERVER`).  
- **MFA Server**: A Kali Linux VM (`MFA_SERVER`) interacting with `users` and `mfa_logs` tables.  
- **Backend Server**: A Debian VM (`BACKEND_SERVER`) interacting with the `messages` table.  
- **Network Communication**: Servers connect to MariaDB using specified IP addresses.

---

## **3. Database Configuration**

### **3.1. Installing MariaDB on the Database Server**

#### Installation Steps on Debian:  
1. **Update Repositories**:  
   ```bash
   sudo apt update
   ```  

2. **Install MariaDB**:  
   ```bash
   sudo apt install mariadb-server mariadb-client -y
   ```  

3. **Secure the Installation**:  
   ```bash
   sudo mysql_secure_installation
   ```  
   - Set a password for `root`.  
   - Remove anonymous users.  
   - Disable remote root login (optional).  
   - Remove test databases.  

4. **Enable and Start MariaDB**:  
   ```bash
   sudo systemctl enable mariadb
   sudo systemctl start mariadb
   sudo systemctl status mariadb
   ```  

---

### **3.2. Configuring MariaDB for External Connections**

#### Modify Configuration to Allow External Access:  
1. Edit the configuration file:  
   ```bash
   sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
   ```  

2. Find the line:  
   ```ini
   bind-address = 127.0.0.1
   ```  
   Replace it with:  
   ```ini
   bind-address = 0.0.0.0
   ```  

3. Restart MariaDB:  
   ```bash
   sudo systemctl restart mariadb
   ```  

#### Verify MariaDB is Listening on All Interfaces:  
```bash
sudo netstat -tulnp | grep mysqld
```  

You should see MariaDB listening on port `3306`.  

---

### **3.3. Creating the Database and Tables**

#### Create the Main Database:  
1. Connect to MariaDB as the administrator:  
   ```bash
   sudo mysql -u root -p
   ```  

2. Create the project database:  
   ```sql
   CREATE DATABASE project_db;
   ```  

#### Define Tables:

##### **Table: `users`**  
```sql
CREATE TABLE users (
    _id CHAR(36) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isMfaActive BOOLEAN DEFAULT FALSE,
    twoFactorSecret VARCHAR(255),
    publicKey TEXT,
    privateKey TEXT,
    sessionToken VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (_id)
);
```  

##### **Table: `messages`**  
```sql
CREATE TABLE messages (
    id CHAR(36) NOT NULL,
    senderId CHAR(36) NOT NULL,
    receiverId CHAR(36) NOT NULL,
    encryptedMessage TEXT NOT NULL,
    signature TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (senderId) REFERENCES users(_id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES users(_id) ON DELETE CASCADE
);
```  

##### **Table: `mfa_logs`**  
```sql
CREATE TABLE mfa_logs (
    id CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    event VARCHAR(255) NOT NULL,
    ipAddress VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(_id) ON DELETE CASCADE
);
```  

---

### **3.4. Creating MariaDB Users**

#### Create a User for the MFA Server:  
```sql
CREATE USER 'mfa_server'@'MFA_SERVER_IP' IDENTIFIED BY 'mfa_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON project_db.users TO 'mfa_server'@'MFA_SERVER_IP';
GRANT SELECT ON project_db.mfa_logs TO 'mfa_server'@'MFA_SERVER_IP';
FLUSH PRIVILEGES;
```  

#### Create a User for the Backend Server:  
```sql
CREATE USER 'backend_server'@'BACKEND_SERVER_IP' IDENTIFIED BY 'backend_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON project_db.messages TO 'backend_server'@'BACKEND_SERVER_IP';
FLUSH PRIVILEGES;
```  

#### Create a Read-Only User (Optional):  
```sql
CREATE USER 'readonly_user'@'%' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON project_db.* TO 'readonly_user'@'%';
FLUSH PRIVILEGES;
```  

---

## **4. Configuration of MFA and Backend Servers**

### **4.1. Install MariaDB Client**  
Install the MariaDB client on each server (MFA and Backend):  
```bash
sudo apt update
sudo apt install mariadb-client -y
```  

### **4.2. Test Database Connection**  
From each server, test connectivity to the database:  
```bash
mysql -u mfa_server -p -h DB_SERVER_IP
```  
Enter the password for `mfa_server` when prompted.  

---

## **5. Troubleshooting Common Issues**

### **Error: Connection Refused**  
- Ensure MariaDB is listening on all interfaces (`bind-address = 0.0.0.0`).  
- Check that port `3306` is open in your firewall.  

### **Error: Access Denied**  
- Verify the MariaDB user was created for the correct host (`MFA_SERVER_IP` or `%`).  
- Confirm privileges were granted correctly.  

### **MySQL Client Not Found**  
- Install the MariaDB client:  
  ```bash
  sudo apt install mariadb-client
  ```  

---

## **6. Important Notes**

- Replace placeholders (`DB_SERVER_IP`, `MFA_SERVER_IP`, `BACKEND_SERVER_IP`) with the actual IPs in your network.  
- Enable **SSL/TLS** for secure connections in production environments.  
- Set up regular database backups using tools like `mysqldump`.  

---

## **7. Conclusion**

This guide provides a detailed walkthrough of how to set up and configure the MariaDB database system for the project. By following these steps, the setup can be replicated on other machines with minimal effort.  

If you have questions or need further assistance, feel free to ask! 😊  
 
