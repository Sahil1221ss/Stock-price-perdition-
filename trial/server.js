require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { generateOTP, sendOTP } = require("./otpMailer");

const app = express();
app.use(cors());
app.use(express.json());

const otpStore = {}; // temporary OTP store

/* SEND OTP */
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const otp = generateOTP();
  otpStore[email] = otp;

  try {
    await sendOTP(email, otp);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

/* VERIFY OTP */
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ verified: true });
  }

  res.status(400).json({ verified: false });
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://127.0.0.1:${process.env.PORT}`);
});
