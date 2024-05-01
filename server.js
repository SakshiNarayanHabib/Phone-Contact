const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'contact_app_phone'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Create Database if not exists
// db.query('CREATE DATABASE IF NOT EXISTS contact_app', (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Database created');
// });

// // Create Contacts Table if not exists
// db.query(`CREATE TABLE IF NOT EXISTS contacts (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   phone VARCHAR(10) NOT NULL
// )`, (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Contacts table created');
// });

// // Insert sample data
// db.query(`INSERT INTO contacts (name, phone) VALUES
// ('Sakshi Habib', '7795843157'),
// ('Chaitanya Muley', '9980301481'),
// ('Prathit Kulkarni', '7259720480'),
// ('Prathamesh Jadi', '8951356555'),
// ('Shubham N B', '9916847425')`, (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Sample data inserted');
// });

// Get all contacts
app.get('/contacts', (req, res) => {
  const sql = 'SELECT * FROM contacts';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(result);
  });
});

// Add a new contact
app.post('/contacts', (req, res) => {
  const { name, phone } = req.body;
  if (!isValidPhone(phone)) {
      res.status(400).json({ message: "Phone number must be 10 digits long" });
      return;
  }
  const sql = 'INSERT INTO contacts (name, phone) VALUES (?, ?)';
  db.query(sql, [name, phone], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: 'Contact added successfully', contact: { id: result.insertId, name, phone } });
  });
});

// Delete a contact
app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM contacts WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: 'Contact deleted successfully', contactId: id });
  });
});

// Modify a contact
app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  if (!isValidPhone(phone)) {
      res.status(400).json({ message: "Phone number must be 10 digits long" });
      return;
  }
  const sql = 'UPDATE contacts SET name = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, phone, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: 'Contact updated successfully', contact: { id, name, phone } });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Function to validate phone number
function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
}
