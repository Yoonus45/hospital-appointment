// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Enable CORS for frontend (e.g. Netlify)
app.use(cors());

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (optional if using Netlify)
app.use(express.static(path.join(__dirname, 'public')));

// Route: Home test
app.get('/', (req, res) => {
  res.send('🎉 Supabase backend is working!');
});

// Route: Handle contact form submissions
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log("📩 Received:", { name, email, phone, message });

    const { data, error } = await supabase
      .from('contacts')  // ⚠️ Must match your table name in Supabase
      .insert([{ name, email, phone, message }]);

    if (error) {
      console.error('❌ Supabase error:', error.message);
      return res.status(500).json({ error: 'Failed to save to Supabase.' });
    }

    console.log("✅ Saved to Supabase:", data);
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});