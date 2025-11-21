const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const todosRoute = require('./routes/todos');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error:", err.message));


app.use('/api/todos', todosRoute(pool));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
