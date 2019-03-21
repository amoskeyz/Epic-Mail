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
const messageTable = `CREATE TABLE IF NOT EXISTS messages(
  id serial PRIMARY KEY,
  createdon text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  receiverid integer NOT NULL,
  senderid integer NOT NULL,
  parentmessageid integer,
  status text NOT NULL
);
`;


const date = new Date().toString();

async function create() {
  const createTable = `${userTable}${messageTable}`;
  const user = {
    text: `INSERT INTO users (firstname, lastname, email, phonenumber, password) 
    VALUES($1, $2, $3, $4, $5)`,
    values: ['amos', 'oruaroghene', 'amoserve@gmail.com', 667, 'seven'],
  };

  const message = {
    text: `INSERT INTO messages (createdon, subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [date, 'things to do in life', 'i have a very big ball', 5, 4, 3, 'unread'],
  };

  const messageSent = {
    text: `INSERT INTO messages (createdon, subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [date, 'things to do in life', 'i have a very big ball', 5, 1, 1, 'sent'],
  };

  const messageSent1 = {
    text: `INSERT INTO messages (createdon, subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [date, 'things to do in life', 'i have a very big ball', 5, 2, 1, 'sent'],
  };

  const messageSent2 = {
    text: `INSERT INTO messages (createdon, subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [date, 'things to do in life', 'i have a very big ball', 5, 3, 1, 'sent'],
  };

  try {
    await pool.query(createTable);
    await pool.query(user.text, user.values);
    await pool.query(message.text, message.values);
    await pool.query(messageSent.text, messageSent.values);
    await pool.query(messageSent1.text, messageSent1.values);
    await pool.query(messageSent2.text, messageSent2.values);
    console.log('Created tables');
  } catch (error) {
    console.log(error);
  }
}

create();
