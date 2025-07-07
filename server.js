// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend (e.g. Netlify)
app.use(cors());

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (optional if using Netlify for frontend)
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

// Define Mongoose schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Route: Home (test purpose)
app.get('/', (req, res) => {
  res.send('🎉 Backend is working!');
});

// Route: Handle form submissions
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
