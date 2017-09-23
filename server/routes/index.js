const express = require('express');
const authRoutes = require('./auth.route');

const router = new express.Router();

router.get('/health-check', (req, res) => {
  res.send('OK')
});

// Mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
