
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventory_system",
  password: "kranti123",
  port: 5432,
});

module.exports = pool;
