const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const app = express();
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

const authRoute = require("./route/auth_route");
const userRoute = require("./route/user_route");
const reminderRoute = require("./route/reminder_route");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/reminder", reminderRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
