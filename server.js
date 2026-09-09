const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'
});

// Multer Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gym_website_assets',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage: storage });

// Initial State / Memory Database
let gymContent = {
  gymName: "IRON PULSE",
  heroTagline: "TRANSFORM YOUR BODY. ELEVATE YOUR MIND.",
  heroSubtext: "State-of-the-art equipment, elite personal trainers, and high-intensity energy. Join the ultimate fitness community today.",
  announcement: "🔥 SPECIAL EID OFFER: Join annual plan and get 2 months free + custom meal plan!",
  heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
};

// API Endpoint to get current site content
app.get('/api/content', (req, res) => {
  res.json({ success: true, data: gymContent });
});

// API Endpoint for Admin to update site details & upload hero picture
app.post('/api/admin/update', upload.single('gymPhoto'), (req, res) => {
  try {
    const { gymName, heroTagline, heroSubtext, announcement } = req.body;

    if (gymName) gymContent.gymName = gymName;
    if (heroTagline) gymContent.heroTagline = heroTagline;
    if (heroSubtext) gymContent.heroSubtext = heroSubtext;
    if (announcement) gymContent.announcement = announcement;

    if (req.file && req.file.path) {
      gymContent.heroImage = req.file.path; // Cloudinary secure URL
    }

    res.json({ success: true, message: "Website updated successfully!", data: gymContent });
  } catch (error) {
    console.error("Admin update error:", error);
    res.status(500).json({ success: false, error: "Failed to update content." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server executing at http://localhost:${PORT}`);
});