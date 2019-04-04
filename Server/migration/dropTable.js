import pool from '../config/config';

async function deleteTable() {
  try {
    await pool.query('DROP TABLE users');
    await pool.query('DROP TABLE messages cascade');
    await pool.query('DROP TABLE inbox');
    await pool.query('DROP TABLE sent');
    await pool.query('DROP TABLE groups cascade');
    await pool.query('DROP TABLE members');
    console.log('Tables successfully deleted');
  } catch (error) {
    console.log('Tables doesn\'t exist', error);
  }
}

deleteTable();
