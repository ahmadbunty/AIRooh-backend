import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initDB, addMember, getMembers } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'https://myroohai.com'
}));
app.use(bodyParser.json());

// Initialize DB
initDB();

// Add waitlist member
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const result = await addMember(email);
  if (result.success) {
    res.status(201).json({ message: 'Added to waitlist' });
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Get all waitlist members (optional, for admin)
app.get('/api/waitlist', async (req, res) => {
  const members = await getMembers();
  res.json(members);
});

app.listen(PORT, () => {
  console.log(`Waitlist backend running on port ${PORT}`);
}); 