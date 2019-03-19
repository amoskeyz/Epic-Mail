import pool from '../config/config';
// import { hash } from '../helper/passwordHash';


const userTable = `CREATE TABLE IF NOT EXISTS users(
  id serial PRIMARY KEY,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  phonenumber integer NOT NULL,
  password text NOT NULL
  );
`;


// const date = new Date().toString();
// const nextDate = new Date('March 13, 2019 05:35:32').toString();

async function create() {
  const createTable = `${userTable}`;
  const user = {
    text: `INSERT INTO users (  
    firstname,
    lastname,
    email,
    phonenumber,
    password) VALUES($1, $2, $3, $4, $5)`,
    values: ['amos', 'oruaroghene', 'amoserve@gmail.com', 667, 'seven'],

  };

  try {
    await pool.query(userTable);
    await pool.query(user.text, user.values);
    const output = await pool.query('SELECT * FROM users WHERE email = $1', ['amoser@gmail.com']);
    console.log(output.rows[0]);
    console.log('Created tables');
  } catch (error) {
    console.log(error);
  }
}

create();
