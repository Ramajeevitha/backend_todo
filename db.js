const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "Jeevitha@2004",
  host: "localhost",
  port: 5432,
  database: "pern_db"
});

module.exports = pool;
