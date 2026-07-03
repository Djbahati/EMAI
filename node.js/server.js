import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config({ path: 'mail.env' });

const app = express();
const PORT = process.env.PORT ?? 3000;

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

// Transporter will be created during init
let transporter;

// Send Email Endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    logger.info('Email sent successfully', { messageId: info.messageId });
    // If using Ethereal, expose preview URL in response for local testing
    const preview = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : undefined;
    res.status(200).json({ message: 'Email sent successfully', preview });
  } catch (error) {
    logger.error('Error sending email', { error: error.message || error });
    res.status(500).json({ error: 'Error sending email' });
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  // mongoose v6+ no longer requires these options but keep for compatibility
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => logger.error('MongoDB connection error', { error: err }));

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
    logger.error('Error adding contact', { error: error.message || error });
    res.status(500).send('Error adding contact');
  }
});

// Get Contacts Endpoint
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).send(contacts);
  } catch (error) {
    logger.error('Error fetching contacts', { error: error.message || error });
    res.status(500).send('Error fetching contacts');
  }
});

// Initialize transporter and start server
async function init() {
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: (process.env.SMTP_SECURE === 'true') || false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('Using SMTP host from environment');
  } else {
    // Fallback to Ethereal test account for local/dev testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('No SMTP configured — using Ethereal test account (local testing)');
    console.log('Ethereal user:', testAccount.user);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

init().catch(err => {
  logger.error('Initialization error', { error: err.message || err });
  console.error(err);
  process.exit(1);
});
