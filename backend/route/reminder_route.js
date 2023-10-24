const express = require("express");
const schedule = require("node-schedule");
const router = express.Router();
const Reminder = require("../model/reminder_model");
const sendSMS = require("../twilioConfig");
const sendEmail = require("../mailerConfig");
const authenticateToken = require("./authenticateToken");

// API endpoint to set a reminder
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { medicine, time, email, phone } = req.body;

    // Create a new reminder object
    const reminder = new Reminder({
      medicine,
      time,
      email,
      phone,
    });

    // Schedule the reminder using node-schedule
    const scheduledReminder = schedule.scheduleJob(time, function () {
      console.log(`Time to take ${medicine}!`);

      // Send email notification
      sendEmail(email, `Time to take ${medicine}!`);

      // Send SMS notification
      sendSMS(phone, `Time to take ${medicine}!`);
    });

    // Add the reminder to the list
    await reminder.save();
    res.status(201).json({ message: "Reminder created successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create reminder!" });
  }
});

// API endpoint to get all reminders
router.get("/", async (req, res) => {
  try {
    const userId = req.body;

    const reminder = await Reminder.find({ user: userId });
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found!" });
    }

    res.status(200).json({ reminder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve reminder!" });
  }
});

// API endpoint to delete a reminder
router.delete("/:id", authenticateToken, (req, res) => {
  const id = req.params.id;

  // Find the reminder by ID and delete it
  Reminder.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        // Cancel the scheduled reminder job
        const scheduledReminder = schedule.scheduledJobs[result._id.toString()];
        if (scheduledReminder) {
          scheduledReminder.cancel();
        }

        res.json({ message: "Reminder deleted" });
      } else {
        res.status(404).json({ error: "Reminder not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
