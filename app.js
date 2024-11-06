const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;
// MySQL configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'pswd',
  database: 'hodlinfo'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Fetch data from WazirX API and store in database
async function fetchAndStoreData() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = Object.values(response.data).slice(0, 10); // Get top 10 results

    // Clear previous data
    db.query('DELETE FROM tickers', (err) => {
      if (err) console.error('Error clearing old data:', err);
    });

    // Insert new data
    const insertQuery = 'INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES (?, ?, ?, ?, ?, ?)';
    data.forEach((ticker) => {
      db.query(insertQuery, [
        ticker.name,
        ticker.last,
        ticker.buy,
        ticker.sell,
        ticker.volume,
        ticker.base_unit
      ], (err) => {
        if (err) console.error('Error inserting data:', err);
      });
    });
    console.log('Data fetched and stored in the database');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Schedule data fetch every 10 minutes (or call once at start for testing)
setInterval(fetchAndStoreData, 10 * 60 * 1000);
fetchAndStoreData();

app.use(express.static(path.join(__dirname,'public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
  });
  


// Route to get data from the database
app.get('/api/tickers', (req, res) => {
  db.query('SELECT * FROM tickers', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      res.json(results);
    }
  });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


