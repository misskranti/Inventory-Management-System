const { sendPurchaseEvent, sendSaleEvent } = require('../kafka/producer');

exports.simulateEvent = async (req, res) => {
  try {
    const { event_type, product_id, quantity, unit_price } = req.body;

    if (event_type === 'purchase') {
      await sendPurchaseEvent(product_id, quantity, unit_price);
    } else if (event_type === 'sale') {
      await sendSaleEvent(product_id, quantity);
    } else {
      return res.status(400).json({ error: 'Invalid event_type' });
    }

    res.status(200).json({ message: 'Event simulated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to simulate event' });
  }
};
