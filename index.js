const express = require('express');
const app = express();
const port = 5000;
const mysql = require('mysql2');
const cors = require('cors');

app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  port: '3307',
  database: 'users',
  user: 'root',
  password: '1234',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// API GET
app.get('/allusers', (req, res) => {
  pool.query('SELECT * FROM users2', function (err, result) {
    if (err) {
      console.error('Error retrieving data from database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

app.get('/allusers/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM users2 WHERE id = ?', [id], function (err, result) {
    if (err) {
      console.error('Error retrieving data from database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.json({ msg: 'Not found' });
    }
  });
});

// API POST
app.post('/addusers', (req, res) => {
  const { fname, lname, username, password } = req.body;
  pool.query(
    'INSERT INTO users2 (fname, lname, username, password) VALUES (?, ?, ?, ?)',
    [fname, lname, username, password],
    function (err, result) {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(result);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
