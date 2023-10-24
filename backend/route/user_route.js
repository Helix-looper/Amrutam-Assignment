const express = require("express");
const router = express.Router();
const User = require("../model/user_model");
const authenticateToken = require("./authenticateToken");

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
      user.password = undefined;
      res.json(user);
    } else {
      console.log(error);
      res.status(404).json({ error: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch user data!" });
  }
});

module.exports = router;