const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    return;
  }
  console.log('Connected to PostgreSQL');
});

// Endpoint to create a booking
app.post('/api/bookings', async (req, res) => {
  const { customerName, pickupLocation, dropoffLocation, phone } = req.body;
  const query = `
    INSERT INTO bookings (customer_name, pickup_location, dropoff_location, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING id, customer_name, pickup_location, dropoff_location, phone
  `;
  try {
    const result = await pool.query(query, [customerName, pickupLocation, dropoffLocation, phone]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Yatra Auto Rickshaw Service API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});