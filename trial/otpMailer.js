const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* 🔢 OTP GENERATOR (YOU NEED THIS) */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* 📧 BEAUTIFUL OTP MAIL */
async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"StockVision Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Your StockVision OTP Code",
    html: `
      <div style="
        max-width:520px;
        margin:auto;
        padding:30px;
        font-family:Arial,sans-serif;
        background:#0f172a;
        border-radius:12px;
        color:#e5e7eb;
      ">
        <h2 style="text-align:center;color:#38bdf8;margin-bottom:5px;">
          StockVision
        </h2>
        <p style="text-align:center;color:#94a3b8;font-size:14px;">
          Smarter Insights. Stronger Decisions.
        </p>

        <hr style="border:0;border-top:1px solid #1e293b;margin:20px 0;" />

        <p>Hello 👋,</p>

        <p style="line-height:1.6;">
          Use the following One-Time Password (OTP) to complete your signup.
          This OTP is valid for <b>5 minutes</b>.
        </p>

        <div style="text-align:center;margin:25px 0;">
          <span style="
            display:inline-block;
            font-size:28px;
            letter-spacing:6px;
            padding:14px 26px;
            background:linear-gradient(90deg,#7c3aed,#06b6d4);
            color:white;
            border-radius:10px;
            font-weight:bold;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px;color:#cbd5f5;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style="font-size:12px;color:#64748b;margin-top:30px;">
          © ${new Date().getFullYear()} StockVision AI<br>
          This is an automated message. Do not reply.
        </p>
      </div>
    `
  });
}

module.exports = { generateOTP, sendOTP };
