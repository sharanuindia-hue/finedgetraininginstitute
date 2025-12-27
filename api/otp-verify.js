import { OTP_STORE } from "./send-otp";

export default function handler(req, res) {
  const { email, otp } = req.body;

  if (OTP_STORE[email] && OTP_STORE[email] == otp) {
    delete OTP_STORE[email];
    return res.json({ success: true });
  }

  res.status(400).json({ success: false });
}
