import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
//import { initDB, addMember, getMembers } from './db.js';
//import user from './db.js';
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.json());

// Initialize DB
import mongoose from 'mongoose';
mongoose.connect("mongodb+srv://i220609:ahmad2772@cluster0.1qzyfep.mongodb.net/roohai").then(()=>{
    console.log("Connected")
}).catch(err=>{
   console.log(err) 
})

const userSchema = mongoose.Schema({
  email: {
    type: String
  }
}, { timestamps: true });

const Waitlist = mongoose.model("User", userSchema);
// Add waitlist member
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    await Waitlist.create({ email });
    res.status(201).json({ message: 'Added to waitlist' });
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: error });
    }
  }
});

// GET: All waitlist entries
app.get('/api/waitlist', async (req, res) => {
  try {
    const members = await Waitlist.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch waitlist members',
      details: error.message  // Optional: for debugging
    });
  }
});


app.listen(PORT, () => {
  console.log(`Waitlist backend running on port ${PORT}`);
}); 