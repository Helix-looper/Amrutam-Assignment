const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

// Configure SMS sender
const twilioClient = twilio(process.env.acc_ssid, process.env.auth_token);

// Function to send SMS notification
function sendSMS(to, message) {
  twilioClient.messages
    .create({
      body: message,
      from: process.env.acc_num,
      to,
    })
    .then((message) => console.log("SMS sent:", message.sid))
    .catch((error) => console.error("Error sending SMS:", error));
}

module.exports = sendSMS;