export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, otp } = req.body;
  const record = otpStore?.get(email);

  if (!record) return res.json({ success: false });

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.json({ success: false, message: "Expired" });
  }

  if (record.otp !== otp) {
    return res.json({ success: false });
  }

  otpStore.delete(email);
  res.json({ success: true });
}
