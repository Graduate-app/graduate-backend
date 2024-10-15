import * as dotenv from 'dotenv';

dotenv.config();

// export enviroments
export default {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  db: process.env.POSTGRES_DB,
  serverPort: process.env.SERVER_PORT,
  corsOrigin: process.env.CORS_ORIGIN,
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpired: process.env.ACCESS_TOKEN_EXPIRATION,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpired: process.env.REFRESH_TOKEN_EXPIRATION,
  },
  email: {
    email: process.env.EMAIL,
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
};
