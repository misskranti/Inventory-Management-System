require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { runConsumer } = require('./kafka/consumer');

const productRoutes = require('./routes/productRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const kafkaRoutes = require('./routes/kafkaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/kafka', kafkaRoutes);

runConsumer();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
