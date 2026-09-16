import { Pool, type PoolConfig } from "pg";

const pgConfig: PoolConfig = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  database: process.env.PGDATABASE || "parcial",
  max: 10,
  idleTimeoutMillis: 10000,
};

export const myPool = new Pool(pgConfig);
