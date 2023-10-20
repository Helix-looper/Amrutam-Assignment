const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

app.use(bodyParser.json());

// Store reminders in memory (replace with a database in production)
let reminders = [];

// Configure email transporter (replace with your own email service)
const emailTransporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

// Configure SMS sender (replace with your own Twilio account credentials)
const twilioClient = twilio('your-account-sid', 'your-auth-token');

// API endpoint to set a reminder
app.post('/reminders', (req, res) => {
  const { medicine, time, email, phone } = req.body;

  // Create a new reminder object
  const reminder = {
    id: Math.floor(Math.random() * 1000), // Generate a random ID (replace with a UUID in production)
    medicine,
    time,
    email,
    phone
  };

  // Schedule the reminder using node-schedule
  const scheduledReminder = schedule.scheduleJob(time, function() {
    console.log(`Time to take ${medicine}!`);

    // Send email notification
    sendEmail(email, `Time to take ${medicine}!`);

    // Send SMS notification
    sendSMS(phone, `Time to take ${medicine}!`);
  });

  // Add the reminder to the list
  reminders.push({
    ...reminder,
    scheduledReminder
  });

  res.status(201).json(reminder);
});

// API endpoint to get all reminders
app.get('/reminders', (req, res) => {
  res.json(reminders);
});

// API endpoint to delete a reminder
app.delete('/reminders/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Find the reminder by ID
  const reminderIndex = reminders.findIndex(reminder => reminder.id === id);

  if (reminderIndex !== -1) {
    // Cancel the scheduled reminder job
    const reminder = reminders[reminderIndex];
    reminder.scheduledReminder.cancel();

    // Remove the reminder from the list
    reminders.splice(reminderIndex, 1);

    res.json({ message: 'Reminder deleted' });
  } else {
    res.status(404).json({ error: 'Reminder not found' });
  }
});

// Function to send email notification
function sendEmail(to, message) {
  const mailOptions = {
    from: 'your-email@gmail.com', // Replace with your own email address
    to,
    subject: 'Medicine Reminder',
    text: message
  };

  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Function to send SMS notification
function sendSMS(to, message) {
  twilioClient.messages.create({
    body: message,
    from: 'your-twilio-phone-number', // Replace with your own Twilio phone number
    to
  })
  .then(message => console.log('SMS sent:', message.sid))
  .catch(error => console.error('Error sending SMS:', error));
}

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});