const db = require('../db');

exports.getInventoryOverview = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        p.id AS product_id,
        p.name,
        COALESCE(SUM(b.quantity), 0) AS current_quantity,
        COALESCE(SUM(b.quantity * b.unit_price), 0) AS total_cost,
        CASE WHEN SUM(b.quantity) > 0 THEN ROUND(SUM(b.quantity * b.unit_price) / SUM(b.quantity), 2) ELSE 0 END AS avg_unit_cost
      FROM products p
      LEFT JOIN inventory_batches b ON p.id = b.product_id
      GROUP BY p.id, p.name
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory overview' });
  }
};

exports.getTransactionLedger = async (req, res) => {
  try {
    const purchases = await db.query('SELECT * FROM purchases ORDER BY timestamp');
    const sales = await db.query('SELECT * FROM sales ORDER BY timestamp');

    const ledger = [
      ...purchases.rows.map(row => ({ ...row, type: 'purchase' })),
      ...sales.rows.map(row => ({ ...row, type: 'sale' }))
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json(ledger);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transaction ledger' });
  }
};

