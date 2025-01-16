# 📝 **Post-Mortem Report: Database Implementation for the Secure Chatroom Project**

This document provides a detailed retrospective on the implementation of the project's database system. It outlines the **steps taken**, **challenges encountered**, and **solutions devised** during the process. The goal is to document the technical decisions, best practices, and lessons learned to assist others in understanding and replicating the system.

---

## **1. Introduction**

The objective of this project was to establish a functional architecture comprising:  
1. A **MariaDB database** hosted on a Debian machine, serving as the primary data repository for the project.  
2. An **MFA server** (Multi-Factor Authentication) running on Kali Linux, interacting with the database.  
3. A **backend server** (message management) running on another Debian machine, also connected to the database.  

This report reflects the practical experience gained during the setup of this infrastructure.

---

## **2. Major Steps in the Project**

### **2.1. Setting Up MariaDB on Debian**

#### Actions Taken:  
- Installed MariaDB on a Debian VM by:  
  1. Installing the required packages.  
  2. Securing the installation using `mysql_secure_installation`.  
  3. Configuring MariaDB to allow external connections.  

#### Challenges Encountered:  
1. **MariaDB did not allow external connections.**  
   - **Problem**: By default, MariaDB is configured to listen only on `127.0.0.1`.  
   - **Solution**: Modified `/etc/mysql/mariadb.conf.d/50-server.cnf` to update:  
     ```ini
     bind-address = 0.0.0.0
     ```  
     This allowed MariaDB to accept connections from all network interfaces.  

2. **Port 3306 was blocked by the firewall.**  
   - **Problem**: Client machines could not connect to MariaDB.  
   - **Solution**: Opened port 3306 using `iptables`:  
     ```bash
     sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
     ```  

---

### **2.2. Creating Databases and Tables**

#### Actions Taken:  
- Created the `project_db` database and designed three primary tables: `users`, `messages`, and `mfa_logs`.  
- Ensured tables were modeled with proper relationships, constraints, and primary keys.  

#### Challenges Encountered:  
1. **Issues with Table Relationships.**  
   - **Problem**: Errors occurred when creating foreign key relationships due to circular dependencies.  
   - **Solution**: Adjusted the creation order of tables to ensure valid references at the time of setup.  

2. **UUID Data Type Management.**  
   - **Problem**: Using UUIDs as primary keys required careful handling to avoid size and encoding issues.  
   - **Solution**: Opted for `CHAR(36)` to store UUIDs, ensuring uniqueness and proper constraints.  

---

### **2.3. Managing MariaDB Users**

#### Actions Taken:  
- Created dedicated users for the MFA and backend servers:  
  - **MFA Server**: Granted access to the `users` and `mfa_logs` tables.  
  - **Backend Server**: Granted access to the `messages` table.  
- Added a read-only user for potential reporting needs.  

#### Challenges Encountered:  
1. **IP Restrictions for MariaDB Users.**  
   - **Problem**: Configuring users with specific IP addresses (e.g., `mfa_server@192.168.X.X`) led to issues when IPs changed or were incorrectly assigned.  
   - **Solution**: Used `%` as a wildcard host (e.g., `mfa_server@'%'`) for flexibility during testing. Later, secured access via firewall rules.  

2. **Inconsistent Privileges.**  
   - **Problem**: Certain users faced privilege-related errors during queries.  
   - **Solution**: Verified privileges using:  
     ```sql
     SHOW GRANTS FOR 'user'@'host';
     ```  
     Adjusted privileges as needed with `GRANT` commands.  

---

### **2.4. Testing Connections from MFA and Backend Servers**

#### Actions Taken:  
- Installed the MariaDB client on both the MFA and backend servers.  
- Verified database connections using:  
  ```bash
  mysql -u user -p -h DB_SERVER_IP
  ```  

#### Challenges Encountered:  
1. **Missing MariaDB Client.**  
   - **Problem**: The `mysql` command was unavailable by default on some servers.  
   - **Solution**: Installed the MariaDB client with:  
     ```bash
     sudo apt install mariadb-client -y
     ```  

2. **Connection Errors.**  
   - **Problem**: Errors such as "Connection Refused" or "Access Denied" during connection attempts.  
   - **Solutions**:  
     - Verified user privileges and credentials.  
     - Checked network connectivity using `ping` and `telnet`.  
     - Opened required ports on the database server's firewall.  

---

## **3. Lessons Learned**

### **3.1. Security Best Practices**
- While using `%` for MariaDB users simplifies testing, production environments should restrict access by specific IP addresses and enforce SSL/TLS for connections.  

### **3.2. Effective Error Diagnosis**
- When a connection fails:  
  1. Check MariaDB logs (`/var/log/mysql/error.log`).  
  2. Review firewall rules using tools like `iptables` or `ufw`.  
  3. Validate user privileges with SQL commands.  

### **3.3. Importance of End-to-End Testing**
- Testing database connections from each server (MFA, backend) is critical for identifying network or configuration issues early.  

---

## **4. Conclusion**

This report documents the technical steps, challenges, and solutions involved in implementing the database system for the Secure Chatroom Project. By detailing the process, we aim to facilitate the system's replication and highlight best practices for future projects.

**Key Takeaways**:  
1. Clear and secure MariaDB configuration is essential.  
2. User privileges should align with specific server responsibilities.  
3. Rigorous network and connectivity testing ensures smooth integration.  

---

## **5. Acknowledgments**

A heartfelt thanks to the entire team for their collaboration and dedication throughout this project! 😊  
  
