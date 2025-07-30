const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Add movie to favorites
router.post('/favorites', auth, async (req, res) => {
  try {
    const { movieId, title, posterPath } = req.body;
    
    const user = await User.findById(req.user._id);
    const existingFavorite = user.favorites.find(fav => fav.movieId === movieId);
    
    if (existingFavorite) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }

    user.favorites.push({ movieId, title, posterPath });
    await user.save();

    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove movie from favorites
router.delete('/favorites/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(fav => fav.movieId !== parseInt(movieId));
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add movie to watchlist
router.post('/watchlist', auth, async (req, res) => {
  try {
    const { movieId, title, posterPath } = req.body;
    
    const user = await User.findById(req.user._id);
    const existingWatchlist = user.watchlist.find(watch => watch.movieId === movieId);
    
    if (existingWatchlist) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    user.watchlist.push({ movieId, title, posterPath });
    await user.save();

    res.json({ message: 'Added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove movie from watchlist
router.delete('/watchlist/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter(watch => watch.movieId !== parseInt(movieId));
    await user.save();

    res.json({ message: 'Removed from watchlist', watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Rate and review a movie
router.post('/ratings', auth, async (req, res) => {
  try {
    const { movieId, rating, review } = req.body;
    
    const user = await User.findById(req.user._id);
    const existingRating = user.ratings.find(r => r.movieId === movieId);
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
      existingRating.ratedAt = new Date();
    } else {
      // Add new rating
      user.ratings.push({ movieId, rating, review });
    }
    
    await user.save();

    res.json({ message: 'Rating saved', ratings: user.ratings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();

    res.json({ 
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 