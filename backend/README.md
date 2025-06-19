# 🎉 Birthday WhatsApp Alert

A Node.js app that sends WhatsApp birthday wishes and notifies friends or admins using UltraMsg API.

## 📦 Setup

1. Install Node.js and MySQL
2. Create MySQL DB:

```sql
CREATE DATABASE birthdaydb;

USE birthdaydb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(20),
  dob DATE
);

CREATE TABLE notifiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

3. Install dependencies:

```bash
cd backend
npm install
```

4. Set `.env`:

```
ULTRAMSG_TOKEN=your_token
INSTANCE_ID=your_instance_id
```

5. Run:

```bash
node app.js
```

Open: `http://localhost:3000`

## ✨ Features

- Add users (name, phone, DOB)
- Add notifiers for each user
- Daily WhatsApp wishes at 8 AM
- HTML frontend included