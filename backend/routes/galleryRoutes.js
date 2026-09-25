const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const {
  getGalleryImages,
  getAllGalleryImages,
  uploadImage,
  updateImage,
  deleteImage,
} = require('../controllers/galleryController');

// Public
router.get('/', getGalleryImages);

// Admin protected
router.get('/admin/all',           protect, getAllGalleryImages);
router.post('/', protect, upload.single('image'), uploadImage); // multer processes 'image' field
router.put('/:id',    protect, updateImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
