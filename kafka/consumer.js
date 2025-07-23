const { Kafka } = require('kafkajs');
const pool = require('../db');
const { processFIFO } = require('../utils/fifo'); 

const kafka = new Kafka({
  clientId: 'inventory-app',
  brokers: ['localhost:9092'], 
});

const consumer = kafka.consumer({ groupId: 'inventory-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log('📩 Consumed Event:', event);

      await processFIFO(event);
    },
  });
};

module.exports = { runConsumer };
