const express = require('express');
const router = express.Router();
const {
  getInventoryOverview,
  getTransactionLedger
} = require('../controller/dashboardController');

router.get('/inventory', getInventoryOverview);
router.get('/ledger', getTransactionLedger);

module.exports = router;