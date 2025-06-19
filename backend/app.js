const express = require('express');
const mysql = require('mysql');
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));
const PORT = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'birthdaydb'
});

db.connect(err => {
  if (err) throw err;
  console.log('DB connected');
});

// Add user
app.post('/add-user', (req, res) => {
  const { name, phone, dob } = req.body;
  const sql = `INSERT INTO users (name, phone, dob) VALUES (?, ?, ?)`;
  db.query(sql, [name, phone, dob], (err, result) => {
    if (err) throw err;
    res.send('User added!');
  });
});

// Add notifier
app.post('/add-notifier', (req, res) => {
  const { user_id, phone } = req.body;
  const sql = `INSERT INTO notifiers (user_id, phone) VALUES (?, ?)`;
  db.query(sql, [user_id, phone], (err, result) => {
    if (err) throw err;
    res.send('Notifier added!');
  });
});

// Get users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Send WhatsApp
const sendWhatsApp = async (phone, message) => {
  await axios.get(`https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`, {
    params: {
      token: process.env.ULTRAMSG_TOKEN,
      to: phone,
      body: message
    }
  });
};

// Daily cron job at 8 AM
cron.schedule('0 8 * * *', () => {
  const today = new Date().toISOString().slice(5, 10);
  const sql = `SELECT * FROM users WHERE DATE_FORMAT(dob, '%m-%d') = ?`;
  db.query(sql, [today], (err, users) => {
    if (err) throw err;
    users.forEach(user => {
      sendWhatsApp(user.phone, `🎉 Happy Birthday, ${user.name}! 🎂`);
      db.query(`SELECT phone FROM notifiers WHERE user_id = ?`, [user.id], (err, notifiers) => {
        if (err) throw err;
        notifiers.forEach(n => {
          const msg = `🎂 Reminder: It's ${user.name}'s birthday today! Wish them at ${user.phone}`;
          sendWhatsApp(n.phone, msg);
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});