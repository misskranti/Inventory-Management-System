const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',          
  database: 'postgres',      
  password: 'kranti123',  
  port: 5432,                 
});

pool.query('SELECT NOW()')
  .then(res => console.log("Connected to PostgreSQL at:", res.rows[0].now))
  .catch(err => console.error("PostgreSQL connection error:", err.message));

module.exports = pool;
