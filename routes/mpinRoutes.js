const express = require("express");
const mpinController = require("../controllers/mpinController");

const router = express.Router();

// Define the routes for MPIN-related operations

// Update a user's MPIN
router.put("/update", mpinController.update);

// Endpoint to verify the M-PIN
router.post("/verify-mpin", (req, res) => {
  const { mpin } = req.body;

  if (!mpin) {
    return res.status(400).json({ error: "M-PIN is required" });
  }

  // Query the database to find a user with the given M-PIN
  db.query("SELECT * FROM tbappuser WHERE mpin = ?", [mpin], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, error: "Incorrect M-PIN" });
    }

    res.status(200).json({ success: true, message: "M-PIN verified" });
  });
});

module.exports = router;
