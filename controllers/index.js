const router = require('express').Router();

const apiRoutes = require('./api');

// send 404 status if endpoint does not exist
router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;