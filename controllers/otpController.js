// const axios = require('axios');
// const db = require('../db');
// const moment = require('moment');

// const otpController = {
//     // Send OTP
//     sendOTP: async (req, res) => {
//         const { mobile_number, user_name } = req.body;

//         // Validate input
//         if (!mobile_number || !user_name) {
//             return res.status(400).json({ error: 'Mobile number and user name are required' });
//         }

//         try {
//             // Generate a random 6-digit OTP
//             const otp = Math.floor(100000 + Math.random() * 900000);

//             // Construct SMS message
//             const msg = `Your one-time password (OTP) to proceed on iPaisa is ${otp}. This OTP is valid for 5 minutes. Remember, never share your OTP with anyone. Thank you, Team iPaisa - Edsom Fintech.`;

//             // Construct the SMS API URL
//             const otpApi = `http://sms.hspsms.com/sendSMS?username=ramkumar.ramdhani9@gmail.com&message=${encodeURIComponent(msg)}&sendername=IPESSA&smstype=TRANS&numbers=${mobile_number}&apikey=503c34a4-c484-4d6e-8f55-bf7102c71242`;

//             // Send the OTP via the SMS API
//             const response = await axios.get(otpApi);

//             if (response.status !== 200) {
//                 return res.status(500).json({ error: 'Failed to send OTP' });
//             }

//             // Current timestamp for database
//             const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

//             // Check if the user already exists
//             db.query('SELECT * FROM tbappuser WHERE mobile_number = ?', [mobile_number], (error, results) => {
//                 if (error) {
//                     console.error('Error checking user:', error);
//                     return res.status(500).json({ error: 'Internal server error' });
//                 }

//                 if (results.length === 0) {
//                     // Insert a new record if the user doesn't exist
//                     const queryString = 'INSERT INTO tbappuser (mobile_number, user_name, otp, created_date, updated_date) VALUES (?, ?, ?, ?, ?)';
//                     db.query(queryString, [mobile_number, user_name, otp, currentTimestamp, currentTimestamp], (insertError) => {
//                         if (insertError) {
//                             console.error('Error storing OTP:', insertError);
//                             return res.status(500).json({ error: 'Internal server error' });
//                         }
//                         res.status(200).json({ message: 'OTP sent successfully' });
//                     });
//                 } else {
//                     // Update the existing OTP if the user exists
//                     const queryString = 'UPDATE tbappuser SET user_name = ?, otp = ?, updated_date = ? WHERE mobile_number = ?';
//                     db.query(queryString, [user_name, otp, currentTimestamp, mobile_number], (updateError) => {
//                         if (updateError) {
//                             return res.status(500).json({ error: 'Internal server error' });
//                         }
//                         res.status(200).json({ message: 'OTP updated successfully' });
//                     });
//                 }
//             });
//         } catch (error) {
//             console.error('Error sending OTP:', error);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//     },

//     // Verify OTP
//     verifyOTP: async (req, res) => {
//         const { mobile_number, otp } = req.body;

//         if (!mobile_number || otp == null) {
//             return res.status(400).json({ error: 'Mobile number and OTP are required' });
//         }

//         try {
//             db.query('SELECT * FROM tbappuser WHERE mobile_number = ? AND otp = ?', [mobile_number, otp], (error, results) => {
//                 if (error) {
//                     console.error('Error verifying OTP:', error);
//                     return res.status(500).json({ error: 'Internal server error' });
//                 }

//                 if (results.length === 0) {
//                     return res.status(400).json({ error: 'Invalid OTP' });
//                 }

//                 // Check if the OTP has expired
//                 const otpSentAt = moment(results[0].created_date); // OTP creation time
//                 const now = moment();
//                 const otpValidFor = moment.duration(5, 'minutes');

//                 if (now.diff(otpSentAt) > otpValidFor) {
//                     return res.status(400).json({ error: 'OTP has expired' });
//                 }

//                 res.status(200).json({ message: 'OTP verified successfully' });
//             });
//         } catch (error) {
//             console.error('Error verifying OTP:', error);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//     }
// };

// module.exports = otpController;




const axios = require('axios');
const db = require('../db');
const moment = require('moment');
const pool = require('../db');

const otpController = {
    // Send OTP
    sendOTP: async (req, res) => {
        const { mobile_number, user_name } = req.body;

        // Check if mobile_number and user_name are provided
        if (!mobile_number || !user_name) {
            return res.status(400).json({ error: 'Mobile number and user name are required' });
        }

        try {
            // Generate a random OTP (6 digits)
            const otp = Math.floor(100000 + Math.random() * 900000);

            // Send the OTP via SMS
            const msg = `Your one-time password (OTP) to proceed on iPaisa is ${otp}. This OTP is valid for 5 minutes. Remember, never share your OTP with anyone for security reasons. Thank you, Team iPaisa - Edsom Fintech.`;
            const otpApi = `http://sms.hspsms.com/sendSMS?username=ramkumar.ramdhani9@gmail.com&message=${encodeURIComponent(msg)}&sendername=IPESSA&smstype=TRANS&numbers=${mobile_number}&apikey=503c34a4-c484-4d6e-8f55-bf7102c71242`;

            // Make a request to the SMS API
            const response = await axios.get(otpApi);
            if (response.status !== 200) {
                return res.status(500).json({ error: 'Failed to send OTP' });
            }

            // Current timestamp
            const currentTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

            // Check if the user already exists
            pool.query('SELECT * FROM tbappuser WHERE mobile_number = ?', [mobile_number], (error, results) => {
                if (error) {
                    console.error('Error checking user:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (results.length === 0) {
                    // User doesn't exist, insert a new record
                    const queryString = 'INSERT INTO tbappuser (mobile_number, user_name, otp, created_date, updated_date) VALUES (?, ?, ?, ?, ?)';
                    pool.query(queryString, [mobile_number, user_name, otp, currentTimestamp, currentTimestamp], (insertError) => {
                        if (insertError) {
                            console.error('Error storing OTP:', insertError);
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        res.status(200).json({ message: 'OTP sent successfully' });
                    });
                } else {
                    // User exists, update the OTP, user_name, and timestamp
                    const queryString = 'UPDATE tbappuser SET user_name = ?, otp = ?, updated_date = ? WHERE mobile_number = ?';
                    pool.query(queryString, [user_name, otp, currentTimestamp, mobile_number], (updateError) => {
                        if (updateError) {
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                        res.status(200).json({ message: 'OTP updated successfully' });
                    });
                }
            });
        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Verify OTP
    verifyOTP: async (req, res) => {
        const { mobile_number, otp } = req.body;

        // Validate input
        if (!mobile_number || otp == null) {
            return res.status(400).json({ error: 'Mobile number and OTP are required' });
        }

        try {
            pool.query('SELECT * FROM tbappuser WHERE mobile_number = ? AND otp = ?', [mobile_number, otp], (error, results) => {
                if (results.length > 0) {
                    // Assuming successful verification if a row is found
                    return res.status(200).json({ message: 'OTP verified successfully', user: results[0] });
                }
                if (error) {
                    console.error('Error verifying OTP:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (results.length === 0) {
                    return res.status(400).json({ error: 'Invalid OTP' });
                }

                const otpSentAt = moment(results[0].created_date); // OTP creation time
                const now = moment();
                const otpValidFor = moment.duration(5, 'minutes');

                if (now.diff(otpSentAt) > otpValidFor) {
                    return res.status(400).json({ error: 'OTP has expired' });
                }

                // Mark OTP as used (inactive)
                const queryString = 'UPDATE tbappuser SET updated_date = ? WHERE mobile_number = ?';
                pool.query(queryString, [now.format('YYYY-MM-DD HH:mm:ss'), mobile_number], (updateError) => {
                    if (updateError) {
                        console.error('Error updating OTP status:', updateError);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    res.status(200).json({ message: 'OTP verified successfully' });
                });
            });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = otpController;

