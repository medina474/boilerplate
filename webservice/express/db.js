require('dotenv').config()

// Empty object {} means no additional config required
const pgp = require('pg-promise')({});

const config = {
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
};

exports.db = pgp(config);
