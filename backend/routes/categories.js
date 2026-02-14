const express = require('express');
const router = express.Router();
const pool = require('../connections/db');

// GET /api/categories — List all active categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT category_id, category_name 
       FROM item_category 
       WHERE is_active = TRUE 
       ORDER BY category_name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('[Categories] List error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
