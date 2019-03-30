import pool from '../config/config';

async function deleteTable() {
  try {
    await pool.query('DROP TABLE users');
    await pool.query('DROP TABLE messages');
    await pool.query('DROP TABLE groups');
    await pool.query('DROP TABLE members');
    console.log('Tables successfully deleted');
  } catch (error) {
    console.log('Tables doesn\'t exist');
  }
}

deleteTable();
