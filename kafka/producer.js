const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'inventory-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  console.log('🚀 Kafka producer connected');

  
  const saleEvent = {
    product_id: 'PRD001',
    event_type: 'sale',
    quantity: 15, 
    timestamp: new Date().toISOString(),
  };

  await producer.send({
    topic: 'inventory-events',
    messages: [{ value: JSON.stringify(saleEvent) }],
  });

  console.log('📤 Sale event sent:', saleEvent);

  await producer.disconnect();
};

run().catch(console.error);
