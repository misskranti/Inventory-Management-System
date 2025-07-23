const db = require('../db');

const processInventoryEvent = async (event) => {
  const { product_id, event_type, quantity, unit_price, timestamp } = event;

  if (event_type === 'purchase') {
    await db.query(
      `INSERT INTO inventory_batches (product_id, quantity, remaining_quantity, unit_price, created_at)
       VALUES ($1, $2, $2, $3, $4)`,
      [product_id, quantity, unit_price, timestamp]
    );
    console.log('✅ Purchase added to inventory');
  }

  if (event_type === 'sale') {
    let remainingQty = quantity;
    let totalCost = 0;

    const { rows: batches } = await db.query(
      `SELECT * FROM inventory_batches
       WHERE product_id = $1 AND remaining_quantity > 0
       ORDER BY created_at ASC`,
      [product_id]
    );

    for (const batch of batches) {
      if (remainingQty <= 0) break;

      const consumeQty = Math.min(batch.remaining_quantity, remainingQty);
      totalCost += consumeQty * batch.unit_price;

      await db.query(
        `UPDATE inventory_batches
         SET remaining_quantity = remaining_quantity - $1
         WHERE id = $2`,
        [consumeQty, batch.id]
      );

      remainingQty -= consumeQty;
    }

    await db.query(
      `INSERT INTO sales (product_id, quantity_sold, total_cost, sold_at)
       VALUES ($1, $2, $3, $4)`,
      [product_id, quantity, totalCost, timestamp]
    );

    console.log(`🛒 Sale recorded: ${quantity} units, Cost: ₹${totalCost}`);
  }
};

module.exports = processInventoryEvent;
