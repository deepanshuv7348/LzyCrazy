const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Ad = require('../models/Ad');
const { body, validationResult } = require('express-validator');

// Create new ad
router.post('/', auth, [
  body('title').trim().notEmpty(),
  body('description').notEmpty(),
  body('price').isNumeric(),
  body('category').notEmpty(),
  body('location').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ad = new Ad({
      ...req.body,
      user: req.user._id
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all ads
router.get('/', async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice, search } = req.query;
    const query = { isBlocked: false, status: 'active' };

    if (category) query.category = category;
    if (location) query.location = location;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const ads = await Ad.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's ads
router.get('/my-ads', auth, async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single ad
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('user', 'username');
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ad
router.put('/:id', auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(ad, req.body);
    await ad.save();

    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete ad
router.delete('/:id', auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ad.remove();
    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Block/unblock ad (admin only)
router.patch('/:id/block', auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    ad.isBlocked = !ad.isBlocked;
    await ad.save();

    res.json({ message: `Ad ${ad.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 