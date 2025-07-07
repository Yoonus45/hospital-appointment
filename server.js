const cors = require('cors');
app.use(cors());
require('dotenv').config();
// Import dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config(); // 👈 Needed to load .env in Render

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS to allow frontend (Netlify) to call this backend
const cors = require('cors');
app.use(cors());

// Serve static files (only needed if hosting frontend from backend)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas using .env variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
});

// Mongoose schema/model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Route: Home test (for Render check)
app.get('/', (req, res) => {
  res.send('🎉 Backend is working!');
});

// Route: Handle form submission
app.post('/contact', async (req, res) => {
  try {
    console.log("📩 Data received from frontend:", req.body);
    const { name, email, phone } = req.body;

    const newContact = new Contact({ name, email, phone });
    const savedContact = await newContact.save();

    console.log("✅ Saved to database:", savedContact);
    res.status(200).json({ message: 'Thank you! Your data was saved.' });
  } catch (err) {
    console.error('❌ Error saving data:', err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});