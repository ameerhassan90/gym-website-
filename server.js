const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root or public folder
app.use(express.static(path.join(__dirname)));

// Root Route - Fixes the "Cannot GET /" error
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Example API Endpoint for Admin Update
app.post('/api/admin/update', (req, res) => {
  try {
    const { gymName, heroTagline, heroSubtext, announcement } = req.body;
    
    // Add your update logic here
    
    res.json({ success: true, message: "Website updated successfully!" });
  } catch (error) {
    console.error("Admin update error:", error);
    res.status(500).json({ success: false, error: "Failed to update content." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server executing at http://localhost:${PORT}`);
});
