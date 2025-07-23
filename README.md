# Inventory Management System (FIFO) - Real-Time Dashboard

A fully functional inventory management tool for small trading businesses using FIFO (First-In-First-Out) costing methodology with real-time data ingestion through Apache Kafka and live dashboard updates.

## 🎯 Project Overview

This system simulates a real-world inventory management scenario where:
- Inventory transactions flow through Kafka in real-time
- FIFO costing ensures accurate inventory valuation
- Live dashboard provides instant visibility into stock levels and costs
- Complete audit trail of all transactions

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Kafka Topic   │───▶│   Backend    │───▶│   PostgreSQL    │
│inventory-events │    │  (Node.js)   │    │   Database      │
└─────────────────┘    └──────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   React.js      │
                       │   Frontend      │
                       └─────────────────┘
```

### Tech Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Message Queue**: Apache Kafka (Confluent Cloud)
- **Frontend**: React.js with Material-UI
- **Deployment**: Railway (Backend), Vercel (Frontend)

## 💡 FIFO Logic Explanation

**First-In-First-Out (FIFO)** is an inventory valuation method where the oldest inventory items are sold first. This ensures:

### Purchase Flow:
1. New inventory batches are stored with purchase price and timestamp
2. Each batch maintains its original cost basis
3. Batches are stored in chronological order

### Sale Flow:
1. When a sale occurs, the system consumes from the oldest available batches first
2. If a sale quantity exceeds a single batch, multiple batches are consumed
3. The cost of goods sold (COGS) is calculated based on the actual costs of consumed batches
4. Remaining inventory reflects the cost of newer batches

### Example:
```
Purchases:
- Batch 1: 100 units at $10 each (Total: $1,000)
- Batch 2: 50 units at $12 each (Total: $600)

Sale: 120 units
- Consume: 100 units from Batch 1 ($1,000)
- Consume: 20 units from Batch 2 ($240)
- Total COGS: $1,240
- Remaining: 30 units from Batch 2 at $12 each ($360)

```
## 🔌 API Endpoints

### Authentication

#### Login
```bash
curl -X POST https://inventory-api.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "inventory123"
  }'
```
**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### Products Management

#### Get All Products
```bash
curl -X GET https://inventory-api.railway.app/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": "PRD001",
      "product_name": "Laptop Computer",
      "current_quantity": 45,
      "total_inventory_cost": 22500.00,
      "average_cost_per_unit": 500.00
    }
  ]
}
```

#### Create Product
```bash
curl -X POST https://inventory-api.railway.app/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "product_id": "PRD002",
    "product_name": "Wireless Mouse"
  }'
```

### Inventory Operations

#### Get Product Inventory Summary
```bash
curl -X GET https://inventory-api.railway.app/api/inventory/PRD001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "product_id": "PRD001",
    "current_quantity": 45,
    "total_inventory_cost": 22500.00,
    "average_cost_per_unit": 500.00,
    "batches": [
      {
        "id": 1,
        "remaining_quantity": 25,
        "unit_price": 480.00,
        "purchase_date": "2025-07-20T10:00:00Z"
      },
      {
        "id": 2,
        "remaining_quantity": 20,
        "unit_price": 520.00,
        "purchase_date": "2025-07-21T14:30:00Z"
      }
    ]
  }
}
```

#### Get All Inventory Summary
```bash
curl -X GET https://inventory-api.railway.app/api/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Transaction Ledger

#### Get Transaction History
```bash
curl -X GET https://inventory-api.railway.app/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": "PRD001",
      "transaction_type": "purchase",
      "quantity": 50,
      "unit_price": 480.00,
      "total_amount": 24000.00,
      "timestamp": "2025-07-20T10:00:00Z"
    },
    {
      "id": 2,
      "product_id": "PRD001",
      "transaction_type": "sale",
      "quantity": 25,
      "average_cost_per_unit": 480.00,
      "total_cost": 12000.00,
      "timestamp": "2025-07-21T16:45:00Z"
    }
  ]
}
```

#### Get Product-Specific Transactions
```bash
curl -X GET https://inventory-api.railway.app/api/transactions/PRD001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Sales Analysis

#### Get Sales Summary
```bash
curl -X GET https://inventory-api.railway.app/api/sales/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total_sales_value": 156000.00,
    "total_quantity_sold": 325,
    "average_selling_price": 480.00,
    "number_of_sales": 12
  }
}
```

### Kafka Event Simulation

#### Trigger Purchase Event
```bash
curl -X POST https://inventory-api.railway.app/api/kafka/simulate/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "product_id": "PRD001",
    "quantity": 100,
    "unit_price": 525.00
  }'
```

#### Trigger Sale Event
```bash
curl -X POST https://inventory-api.railway.app/api/kafka/simulate/sale \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "product_id": "PRD001",
    "quantity": 30
  }'
```

#### Bulk Simulation (Generate Multiple Events)
```bash
curl -X POST https://inventory-api.railway.app/api/kafka/simulate/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "events_count": 10,
    "product_ids": ["PRD001", "PRD002", "PRD003"]
  }'
```

## 📝 Kafka Event Schema

### Purchase Event
```json
{
  "product_id": "PRD001",
  "event_type": "purchase",
  "quantity": 50,
  "unit_price": 100.0,
  "timestamp": "2025-07-23T10:00:00Z"
}
```

### Sale Event
```json
{
  "product_id": "PRD001",
  "event_type": "sale",
  "quantity": 25,
  "timestamp": "2025-07-23T14:30:00Z"
}
```

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Docker (for Kafka)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/inventory-management-fifo.git
cd inventory-management-fifo/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC=inventory-events

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

4. **Database Setup**
```bash
# Create database
createdb inventory_db

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

5. **Start Kafka (Docker)**
```bash
# Start Kafka with docker-compose
docker-compose up -d kafka zookeeper

# Create topic
npm run kafka:create-topic
```

6. **Start the backend server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

4. **Start the frontend**
```bash
npm start
```

### Kafka Producer Script

Run the included producer script to simulate real-time events:

```bash
cd scripts
node kafka-producer.js

```
## 🌐 Frontend Features

### Dashboard Components

1. **Stock Overview Widget**
   - Real-time inventory levels
   - Current stock value
   - Average cost per unit
   - Low stock alerts

2. **Transaction Ledger**
   - Chronological transaction history
   - Purchase and sale details
   - FIFO cost calculations
   - Export capabilities

3. **Live Event Feed**
   - Real-time Kafka event stream
   - WebSocket connections
   - Event type indicators

4. **Analytics Charts**
   - Inventory value trends
   - Sales volume graphs
   - Cost analysis charts

### Key Features
- **Real-time Updates**: WebSocket integration for live data
- **Responsive Design**: Mobile-friendly interface
- **Data Export**: CSV/Excel export functionality
- **Search & Filter**: Advanced filtering options
- **User Authentication**: Secure login system

## 🔧 Deployment Configuration

### Backend (Railway)
```yaml
# railway.toml
[build]
command = "npm install"

[deploy]
startCommand = "npm start"

[env]
DATABASE_URL = "${{Postgres.DATABASE_URL}}"
KAFKA_BROKERS = "your-kafka-cluster.confluent.cloud:9092"
```

### Frontend (Vercel)
```json
{
  "name": "inventory-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": { "cache-control": "s-maxage=31536000,immutable" },
      "dest": "/static/$1"
    },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 📋 Testing

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests
```bash
# API integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

### Load Testing
```bash
# Kafka performance test
npm run test:kafka-load

# API load test
npm run test:api-load
```

## 🐛 Troubleshooting

### Common Issues

1. **Kafka Connection Issues**
```bash
# Check if Kafka is running
docker ps | grep kafka

# View Kafka logs
docker logs kafka-container
```

2. **Database Connection Problems**
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check table exists
psql $DATABASE_URL -c "\dt"
```

3. **Frontend Not Updating**
- Verify WebSocket connection in browser dev tools
- Check CORS configuration in backend
- Ensure JWT token is valid

### Performance Optimization

1. **Database Indexing**
```sql
CREATE INDEX idx_inventory_batches_product_id ON inventory_batches(product_id);
CREATE INDEX idx_inventory_batches_purchase_date ON inventory_batches(purchase_date);
CREATE INDEX idx_sales_product_id ON sales(product_id);
```

2. **Kafka Consumer Optimization**
- Adjust batch size and timeout settings
- Implement consumer groups for scaling
- Monitor consumer lag
