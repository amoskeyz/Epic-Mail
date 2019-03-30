import { Pool } from 'pg';

import dotenv from 'dotenv';

dotenv.config();
const enviroment = process.env.NODE_ENV === 'test' ? process.env.DB_TEST : process.env.DB_CONNECTIONSTRING;
const pool = new Pool({
  connectionString: enviroment,
});

export default pool;
