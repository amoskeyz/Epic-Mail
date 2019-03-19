import pool from '../config/config';

const dropUserTable = 'DROP TABLE users';


async function deleteUser() {
  try {
    await pool.query(dropUserTable);
    console.log('Tables successfully deleted');
  } catch (error) {
    console.log('user doesn\'t exist');
  }
}

deleteUser();
