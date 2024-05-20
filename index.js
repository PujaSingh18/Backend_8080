require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Import JWT module
const bcrypt = require("bcrypt"); // Import bcrypt module
const User = require("./models/user.js"); // Import User model
const mpinRoutes = require('./routes/mpinRoutes');
require("./db.js");
const cookieParser = require("cookie-parser");
const pool = require('./db');

const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Hello World route
app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});


// Mount the MPIN routes at the '/mpin' path
app.use('/mpin', mpinRoutes);


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Route to handle user sign-in
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate user
    const user = await User.getByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to handle user sign-out (logout)
app.post("/logout", (req, res) => {
  // Clear token from client-side storage
  res.json({ message: "Logged out successfully" });
});

// Protected route that requires authentication
app.get("/protected", verifyToken, (req, res) => {
  // User is authenticated, handle request
  res.json({ message: "Protected resource accessed" });
});

// Import Routes
const authRoutes = require("./routes/router.js");

app.post("/generate-otp", (req, res) => {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  res.status(200).json({ otp });
});

app.post("/send-otp", (req, res) => {
  const { mobile_number } = req.body;

  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Compose the message to send
  let msg = `Your one-time password (OTP) to proceed on iPaisa is ${otp}. `;
  msg += "This OTP is valid for 5 minutes. Remember, never share your OTP with anyone for security reasons. ";
  msg += "Thank you, Team iPaisa - Edsom Fintech";

  // Construct the URL for the API call
  let otpApi = `http://sms.hspsms.com/sendSMS?username=ramkumar.ramdhani9@gmail.com&message=${msg}&sendername=IPESSA&smstype=TRANS&numbers=${mobile_number}&apikey=503c34a4-c484-4d6e-8f55-bf7102c71242`;

  console.log(otpApi);
  // Redirect to the API endpoint for sending the SMS
  res.redirect(otpApi);
  
  // Respond with a status 200 and the generated OTP
  //res.status(200).json({ otp });
});
app.post("/sendotp", (req, res) => {
  const { mobile_number } = req.body;
  console.log(mobile_number);
  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  const axios = require('axios');
// URL and form data
const url = 'http://sms.hspsms.com/v2/sendSMS';
const data = {
  username: 'ramkumar.ramdhani9@gmail.com',
  message: 'Your one-time password (OTP) to proceed on iPaisa is ' + otp + '. This OTP is valid for 5 minutes. Remember, never share your OTP with anyone for security reasons. Thank you, Team iPaisa - Edsom Fintech',
  sendername: 'IPESSA',
  smstype: 'TRANS',
  numbers: mobile_number,
  apikey: '503c34a4-c484-4d6e-8f55-bf7102c71242',
  peid:'1201161442709656047',
  templateid:'1207171076374359808'
};
console.log(url);
console.log(data);
// Making the POST request
axios.post(url, data)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

});
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  // Implement the storage of OTPs and verification logic here
  // For now, assuming `otpStore` is an object storing OTPs with phone numbers as keys
  if (otpStore[phone] && otpStore[phone] === otp) {
    // If OTP is valid, clear the stored OTP and respond with success
    delete otpStore[phone];
    res.status(200).json({ valid: true });
  } else {
    // If OTP is invalid, respond with error
    res.status(400).json({ valid: false });
  }
});

// Use auth routes
app.use("/api", authRoutes);

app.post('/api/check-user', (req, res) => {
  const { mobile_number, name } = req.body;

  if (!mobile_number || !name) {
    return res.status(400).json({ error: 'Mobile number and name are required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const query = 'SELECT * FROM users WHERE mobile_number = ? AND name = ?';
    connection.query(query, [mobile_number, name], (error, results) => {
      connection.release(); // Always release the connection back to the pool

      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
        res.status(200).json({ message: 'User exists' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  });
});

// PORT configuration
const port = process.env.PORT || 3000;

// Starting the server
const server = app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});
