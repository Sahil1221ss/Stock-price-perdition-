require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { generateOTP, sendOTP } = require("./otpMailer");

const app = express();
app.use(cors());
app.use(express.json());

const otpStore = {}; // temporary OTP store

/* ================= SEND OTP ================= */
app.post("/send-otp", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = generateOTP().toString();

  otpStore[email] = {
    otp,
    createdAt: Date.now()
  };

  try {
    await sendOTP(email, otp);
    res.json({ success: true });
  } catch (err) {
    console.error("OTP Send Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

/* ================= VERIFY OTP ================= */
app.post("/verify-otp", (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const otp = req.body.otp?.trim();

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ verified: false, error: "OTP expired" });
  }

  // 5 minute expiry
  if (Date.now() - record.createdAt > 5 * 60 * 1000) {
    delete otpStore[email];
    return res.status(400).json({ verified: false, error: "OTP expired" });
  }

  if (record.otp === otp) {
    delete otpStore[email];
    return res.json({ verified: true });
  }

  return res.status(400).json({ verified: false });
});

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("StockVision Backend Running");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
