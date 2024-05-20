const Mpin = require("../models/mpin");
const pool = require('../db');

const mpinController = {

    // Update a user's MPIN
    update: async (req, res) => {
        const { mobile_number, mpin } = req.body;

        // Check if mobile_number and new_mpin are provided
        if (!mobile_number || !mpin) {
            return res.status(400).json({ error: "Mobile number and new MPIN are required" });
        }

        try {
            // Update the MPIN for the user
            Mpin.update(mobile_number, mpin, (error, isUpdated) => {
                if (error) {
                    console.error("Error updating MPIN:", error);
                    return res.status(500).json({ error: "Internal server error" });
                }
                if (isUpdated) {
                    res.json({ message: "MPIN updated successfully" });
                } else {
                    res.status(404).json({ error: "User not found" });
                }
            });
        } catch (error) {
            console.error("Error updating MPIN:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    };


module.exports = mpinController;
