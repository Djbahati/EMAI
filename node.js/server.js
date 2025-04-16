const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Email Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Email Endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    logger.info('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  notes: String,
});

const Contact = mongoose.model('Contact', ContactSchema);

// Add Contact Endpoint
app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    logger.info('Contact added successfully');
    res.status(201).send(contact);
  } catch (error) {
    logger.error('Error adding contact:', error);
    res.status(500).send('Error adding contact');
  }
});

// Get Contacts Endpoint
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    res.status(500).send('Error fetching contacts');
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${5252}`);
});
