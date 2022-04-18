import { config } from 'dotenv'
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })

export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  ORIGIN,
  SECRET_KEY,
  SECRET_REFRESH,
  EXPIRES_TOKEN,
  EXPIRES_REFRESH,
  REDIS_HOST,
  REDIS_PORT
} = process.env
