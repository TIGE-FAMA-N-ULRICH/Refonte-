## 🖥 **1. Interface Utilisateur (Frontend Standard)**  
Cette section regroupe les éléments et pages visibles par les utilisateurs finaux (ceux qui utilisent l'application de messagerie).  

### **🔹 Accueil / Page d’authentification**  
- Formulaire de **connexion** (Username + Mot de passe + Code MFA)  
- Option **Mot de passe oublié**  
- Option **S’inscrire** (lien vers la page d’inscription)  

### **🔹 Inscription**  
- Champ **Nom d’utilisateur**  
- Champ **Mot de passe**  
- Confirmation du mot de passe  
- Scan du **QR Code MFA**  
- Vérification du **code OTP**  
- Téléchargement de la **clé privée** (si applicable)  
- Validation et redirection vers la messagerie  

### **🔹 Tableau de bord (Espace de discussion / Chat)**  
- Liste des contacts disponibles  
- Barre de recherche des contacts  
- Section affichage des messages  
- Envoi et réception de messages sécurisés (affichage des statuts : envoyé, reçu, lu)  
- Indicateur de **connexion en ligne/hors ligne** pour chaque utilisateur  
- Option de **chiffrement bout en bout** (indicateur visuel montrant que les messages sont sécurisés)  
- Affichage des fichiers partagés (option de **téléchargement sécurisé**)  
- Option **"Ajouter un contact"**  
- Option **"Supprimer un contact"**  

### **🔹 Paramètres utilisateur**  
- Modifier les informations du compte (mot de passe, nom d’utilisateur, etc.)  
- Gérer l’activation/désactivation du **MFA**  
- Télécharger une nouvelle clé privée en cas de perte  
- Option de **déconnexion sécurisée**  

### **🔹 Historique des connexions & appareils autorisés**  
- Liste des **connexions récentes** avec IP et appareil  
- Option de **déconnexion forcée** depuis un autre appareil  
- Notification en cas de tentative de connexion suspecte  

---

## 🔥 **2. Interface Admin (Surveillance et Sécurité du Système)**  
L’interface admin est dédiée à l’administration du système. Elle permettra une **visualisation avancée des logs**, un **monitoring en temps réel**, et des **outils d'intervention rapide**.

### **🔹 Tableau de bord général (Monitoring en temps réel)**  
- Affichage en **temps réel des connexions utilisateur**  
- Visualisation des **IP connectées actuellement**  
- Affichage des **sessions actives** (nom d'utilisateur, IP, timestamp)  
- Indicateur d'**activité des serveurs** (MFA, Backend principal, Base de données)  
- Nombre de **messages échangés par seconde**  
- Détection d’activité suspecte (tentatives de connexion répétées, attaques possibles)  

### **🔹 Logs et Historique des Activités**  
- **Logs d’authentification** (tentatives réussies et échouées)  
- **Logs d’échanges de messages** (uniquement les métadonnées, pas le contenu des messages chiffrés)  
- **Logs des erreurs système** (problèmes serveurs, base de données)  
- **Logs des actions administratives** (ajout/suppression d’un utilisateur, bannissement)  

### **🔹 Analyse des logs et reporting avancé**  
- **Graphique d’évolution des connexions** (nombre de connexions par heure/jour)  
- **Carte géographique des connexions** (localisation des adresses IP connectées)  
- **Histogramme des tentatives échouées** par utilisateur/IP  
- **Affichage des logs en temps réel** avec un filtre par **IP**, **Utilisateur**, **Type d’action**  
- **Statistiques sur les messages échangés** (volume, temps de réponse, erreurs)  

### **🔹 Gestion des utilisateurs**  
- Liste des utilisateurs inscrits  
- Activation/Désactivation de **MFA** pour un utilisateur  
- Option de **bannissement d’un utilisateur suspect**  
- **Réinitialisation du MFA** pour un utilisateur en cas de problème  

### **🔹 Sécurité & Firewall**  
- **Blocage manuel d'une adresse IP suspecte**  
- **Mise en liste noire automatique** d’une IP après plusieurs tentatives échouées  
- **Système de détection des attaques** (ex. trop de requêtes en peu de temps = tentative de brute-force)  
- Intégration avec **fail2ban** pour bloquer les IP malveillantes  

### **🔹 Gestion des serveurs**  
- Surveillance des **performances du serveur** (CPU, RAM, utilisation réseau)  
- Surveillance du **trafic réseau** entre les serveurs (MFA, Backend, Base de données)  
- Détection des **erreurs et crashs**  
- Option pour **redémarrer un serveur à distance**  

