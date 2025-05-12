const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());
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
    console.error('Error connecting to PostgreSQL:', err.stack);
    process.exit(1);
  }
  console.log('Connected to PostgreSQL');
});

// Email transporter setup (using Ethereal for testing)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'your-ethereal-email@ethereal.email', // Replace with your Ethereal email
    pass: 'your-ethereal-password', // Replace with your Ethereal password
  },
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    console.error('Health check error:', error.message);
    res.status(500).json({ status: 'Error', database: 'Disconnected', error: error.message });
  }
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Check authentication status
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ isAuthenticated: true, user: { id: decoded.userId, email: decoded.email } });
  } catch (error) {
    res.status(200).json({ isAuthenticated: false });
  }
});

// Signup endpoint with email verification
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('Signup request received:', { email, password: password ? '[Provided]' : '[Missing]' });

  if (!email || !password) {
    console.log('Signup failed: Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const query = `
      INSERT INTO users (email, password, is_verified, verification_token)
      VALUES ($1, $2, false, $3)
      RETURNING id, email
    `;
    const result = await pool.query(query, [email, hashedPassword, verificationToken]);
    const user = result.rows[0];
    console.log('User created successfully:', user);

    // Send verification email
    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: 'support@yatra.com',
      to: email,
      subject: 'Verify Your Email - Yatra Auto Rickshaw',
      html: `
        <h2>Welcome to Yatra Auto Rickshaw!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you did not sign up, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (error) {
    console.error('Signup error:', error.message, error.stack);
    if (error.code === '23505') {
      console.log('Signup failed: Email already exists:', email);
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.log('Signup failed: Server error:', error.message);
      res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
  }
});

// Verify email endpoint
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const query = `
      UPDATE users
      SET is_verified = true, verification_token = NULL
      WHERE email = $1 AND verification_token = $2
      RETURNING id, email
    `;
    const result = await pool.query(query, [decoded.email, token]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error.message);
    res.status(400).json({ error: 'Invalid or expired verification token' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      console.log('User not verified:', email);
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });
    console.log('Login successful:', email);
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  console.log('User logged out');
  res.json({ message: 'Logout successful' });
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = `
      INSERT INTO contacts (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    const result = await pool.query(query, [name, email, message]);
    console.log('Contact message saved:', result.rows[0]);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Protected booking endpoints
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, customer_name, pickup_location, dropoff_location, phone, status
      FROM bookings
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { customerName, pickupLocation, dropoffLocation, phone } = req.body;
  if (!customerName || !pickupLocation || !dropoffLocation || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    INSERT INTO bookings (customer_name, pickup_location, dropoff_location, phone, user_id, status)
    VALUES ($1, $2, $3, $4, $5, 'Pending')
    RETURNING id, customer_name, pickup_location, dropoff_location, phone, status
  `;
  try {
    const result = await pool.query(query, [customerName, pickupLocation, dropoffLocation, phone, req.user.userId]);
    console.log('Booking created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Booking error:', error.message);
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