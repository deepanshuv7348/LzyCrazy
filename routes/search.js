const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

// Advanced search
router.get('/', async (req, res) => {
  try {
    const {
      query,
      category,
      location,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10
    } = req.query;

    const searchQuery = { isBlocked: false, status: 'active' };

    // Text search
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Location filter
    if (location) {
      searchQuery.location = location;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    // Sorting
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort by newest
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      Ad.find(searchQuery)
        .populate('user', 'username')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Ad.countDocuments(searchQuery)
    ]);

    res.json({
      ads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json([]);
    }

    const suggestions = await Ad.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isBlocked: false,
      status: 'active'
    })
      .select('title')
      .limit(5);

    res.json(suggestions.map(ad => ad.title));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get search filters
router.get('/filters', async (req, res) => {
  try {
    const [categories, locations] = await Promise.all([
      Ad.distinct('category'),
      Ad.distinct('location')
    ]);

    res.json({
      categories: categories.filter(Boolean),
      locations: locations.filter(Boolean)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 