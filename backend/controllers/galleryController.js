const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

// ─── GET /api/gallery ────────────────────────────────────────────────────────
// Public — Get all gallery images (FR9)
const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ uploadDate: -1 }).populate('eventId', 'title');
    return res.json(images);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve gallery images.' });
  }
};

// ─── GET /api/gallery/all ─────────────────────────────────────────────────────
// Admin only — Get all gallery images with uploader info (FR7)
const getAllGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find()
      .sort({ uploadDate: -1 })
      .populate('uploadedBy', 'username')
      .populate('eventId', 'title');
    return res.json(images);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve gallery images.' });
  }
};

// ─── POST /api/gallery ───────────────────────────────────────────────────────
// Admin only — Upload a new gallery image (FR7)
// Uses multer — file is available as req.file
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const { caption, eventId } = req.body;

    // Build the public URL — use BASE_URL env var in production (e.g. https://your-app.onrender.com)
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const image = await Gallery.create({
      imageUrl,
      caption: caption || null,
      eventId: eventId || null,
      uploadedBy: req.admin.id,
    });

    return res.status(201).json({ message: 'Image uploaded successfully.', image });
  } catch (err) {
    console.error('uploadImage error:', err.message);
    return res.status(500).json({ error: 'Failed to upload image.' });
  }
};

// ─── PUT /api/gallery/:id ────────────────────────────────────────────────────
// Admin only — Update caption or eventId for an image (FR7)
const updateImage = async (req, res) => {
  try {
    const { caption, eventId } = req.body;
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { caption: caption || null, eventId: eventId || null },
      { new: true }
    );
    if (!image) return res.status(404).json({ error: 'Image not found.' });
    return res.json({ message: 'Image updated successfully.', image });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update image.' });
  }
};

// ─── DELETE /api/gallery/:id ─────────────────────────────────────────────────
// Admin only — Delete a gallery image and remove file from disk
const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found.' });

    // Remove physical file from uploads directory
    const filename = path.basename(image.imageUrl);
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Image deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete image.' });
  }
};

module.exports = { getGalleryImages, getAllGalleryImages, uploadImage, updateImage, deleteImage };
