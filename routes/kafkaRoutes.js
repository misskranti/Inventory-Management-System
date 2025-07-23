const express = require('express');
const router = express.Router();
const { simulateEvent } = require('../controller/kafkaController');

router.post('/simulate', simulateEvent);

module.exports = router;
