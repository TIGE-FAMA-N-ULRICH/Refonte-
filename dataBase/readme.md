# **Database: MariaDB*  
The project uses **MariaDB** as the database management system. Below are the defined tables:  

#### **Table: `users`**  
Stores essential user authentication and management information.  

| Field              | Type         | Constraints                                                  |
|--------------------|--------------|-------------------------------------------------------------|
| `_id`               | CHAR(36)     | PRIMARY KEY, UUID                                           |
| `username`         | VARCHAR(255) | UNIQUE, NOT NULL                                            |
| `password`         | TEXT         | NOT NULL                                                   |
| `isMfaActive`    | BOOLEAN      | DEFAULT FALSE                                               |
| `twoFactorSecret`| TEXT         | NULLABLE                                                    |
| `publicKey`       | TEXT         | NULLABLE                                                    |
| `privateKey`      | TEXT         | NULLABLE                                                    |
| `sessionToken`    | TEXT         | NULLABLE                                                    |
| `createdAt`       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                   |
| `updatedAt`       | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       |  

```sql
CREATE TABLE users (
    _id CHAR(36) PRIMARY KEY, -- UUID pour conserver un identifiant complexe
    username VARCHAR(255) NOT NULL UNIQUE, -- Identique à l'ancien modèle
    password TEXT NOT NULL, -- Identique à l'ancien modèle
    isMfaActive BOOLEAN DEFAULT FALSE, -- Identique à l'ancien modèle
    twoFactorSecret TEXT, -- Identique à l'ancien modèle
    publicKey TEXT, -- Nouveau champ (clé publique pour chiffrement)
    privateKey TEXT, -- Nouveau champ (clé privée pour chiffrement)
    sessionToken TEXT, -- Nouveau champ (token pour gestion des sessions)
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Identique à l'ancien modèle
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Identique à l'ancien modèle
);

```  


| **Attribut**         | **Rôle / Description**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------------|
| `_id`                | Identifiant unique (UUID). Utilisé pour identifier chaque utilisateur de manière sécurisée.            |
| `username`           | Nom d'utilisateur choisi par l'utilisateur. Doit être unique.                                         |
| `password`           | Mot de passe de l'utilisateur, stocké sous forme hachée pour des raisons de sécurité.                 |
| `isMfaActive`        | Indique si l'utilisateur a activé l'authentification multi-facteurs (MFA).                            |
| `twoFactorSecret`    | Clé secrète utilisée pour générer les OTP (One-Time Passwords) dans le cadre du MFA.                  |
| `publicKey`          | Clé publique pour le chiffrement des messages.                                                        |
| `privateKey`         | Clé privée, utilisée pour déchiffrer les messages. Elle est chiffrée et stockée pour plus de sécurité. |
| `sessionToken`       | Jeton de session généré après la connexion. Utilisé pour maintenir la session utilisateur.            |
| `createdAt`          | Horodatage de la création de l'utilisateur dans la base de données.                                   |
| `updatedAt`          | Horodatage de la dernière mise à jour des informations de l'utilisateur.                              |

---
---

#### **Table: `messages`**  
Manages exchanged messages between users.  

| Field              | Type         | Constraints                                                  |
|--------------------|--------------|-------------------------------------------------------------|
| `id`               | CHAR(36)     | PRIMARY KEY, UUID                                           |
| `senderId`        | CHAR(36)     | FOREIGN KEY (`users.id`)                                    |
| `receiverId`      | CHAR(36)     | FOREIGN KEY (`users.id`)                                    |
| `encryptedMessage`| TEXT         | NOT NULL                                                   |
| `signature`        | TEXT         | NULLABLE                                                    |
| `timestamp`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                   |  


```sql
CREATE TABLE messages (
    id CHAR(36) PRIMARY KEY, -- UUID pour garantir un identifiant unique complexe
    senderId CHAR(36) NOT NULL, -- Référence vers users._id
    receiverId CHAR(36) NOT NULL, -- Référence vers users._id
    encryptedMessage TEXT NOT NULL, -- Contenu chiffré du message
    signature TEXT, -- Signature pour vérifier l'intégrité
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Horodatage automatique
);

```  


| **Attribut**         | **Rôle / Description**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------------|
| `id`                 | Identifiant unique (UUID) pour chaque message.                                                        |
| `senderId`           | Référence à `users._id`. Identifie l'utilisateur qui a envoyé le message.                             |
| `receiverId`         | Référence à `users._id`. Identifie l'utilisateur qui doit recevoir le message.                        |
| `encryptedMessage`   | Contenu chiffré du message. Le chiffrement garantit que seul le destinataire peut lire le message.     |
| `signature`          | Signature numérique pour vérifier l'intégrité du message.                                            |
| `timestamp`          | Horodatage indiquant quand le message a été envoyé.                                                  |

---

#### **Table: `mfa_logs`**  
Tracks events related to MFA authentication.  

| Field              | Type         | Constraints                                                  |
|--------------------|--------------|-------------------------------------------------------------|
| `id`               | CHAR(36)     | PRIMARY KEY, UUID                                           |
| `userId`          | CHAR(36)     | FOREIGN KEY (`users.id`)                                    |
| `event`            | VARCHAR(255) | NOT NULL                                                   |
| `ipAddress`       | VARCHAR(255) | NULLABLE                                                    |
| `timestamp`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                   |  


```sql
CREATE TABLE mfa_logs (
    id CHAR(36) PRIMARY KEY, -- UUID pour garantir un identifiant unique complexe
    userId CHAR(36) NOT NULL, -- Référence vers users._id
    event VARCHAR(255) NOT NULL, -- Événements (MFA_SUCCESS, MFA_FAILURE, etc.)
    ipAddress VARCHAR(255), -- Adresse IP de l'utilisateur
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Horodatage automatique
);

```  


| **Attribut**         | **Rôle / Description**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------------------|
| `id`                 | Identifiant unique (UUID) pour chaque événement MFA.                                                  |
| `userId`             | Référence à `users._id`. Identifie l'utilisateur associé à l'événement.                               |
| `event`              | Type d'événement (par exemple : `MFA_SUCCESS`, `MFA_FAILURE`, etc.).                                   |
| `ipAddress`          | Adresse IP de l'utilisateur qui a initié l'événement. Utile pour détecter des tentatives suspectes.   |
| `timestamp`          | Horodatage indiquant quand l'événement s'est produit.                                                |



