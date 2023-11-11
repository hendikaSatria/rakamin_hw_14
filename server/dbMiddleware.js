import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dbMiddleware = (req, res, next) => {
  req.db = pool;
  next();
};
