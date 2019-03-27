import pool from '../config/config';
// import { hash } from '../helper/passwordHash';


const userTable = `CREATE TABLE IF NOT EXISTS users(
  id serial PRIMARY KEY,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  phonenumber text NOT NULL,
  password text NOT NULL
  );
`;
const messageTable = `CREATE TABLE IF NOT EXISTS messages(
  id serial PRIMARY KEY,
  createdon text NOT NULL,
  subject text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  receiverid integer NOT NULL,
  senderid integer NOT NULL,
  parentmessageid integer,
  status text NOT NULL
);
`;
const groupTable = `CREATE TABLE IF NOT EXISTS groups(
  id serial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  roleid integer NOT NULL
);
`;

const date = new Date().toString();

async function create() {
  const createTable = `${userTable}${messageTable}${groupTable}`;
  const user = {
    text: `INSERT INTO users (firstname, lastname, email, phonenumber, password) 
    VALUES($1, $2, $3, $4, $5)`,
    values: ['amos', 'oruaroghene', 'amoserve@gmail.com', 667, 'seven'],
  };

  const message = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amosq@gmail.com', 5, 4, 3, 'unread'],
  };

  const messageSent = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amos@gmail.com', 5, 1, 1, 'sent'],
  };

  const messageSent1 = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amosww@gmail.com', 5, 2, 1, 'sent'],
  };

  const messageSent2 = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amosw@gmail.com', 5, 3, 1, 'sent'],
  };

  const messageSent3 = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amosuw@gmail.com', 3, 3, 1, 'unread'],
  };

  const messageSent4 = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amose@gmail.com', 2, 3, 1, 'unread'],
  };

  const messageSent5 = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amosr@gmail.com', 2, 3, 1, 'unread'],
  };
  const messageSent6 = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amostt@gmail.com', 2, 2, 1, 'unread'],
  };

  const messageSent7 = {
    text: `INSERT INTO messages (createdon, subject, message, email, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    values: [date, 'things to do in life', 'i have a very big ball', 'amost@gmail.com', 1, 1, 1, 'unread'],
  };

  const group = {
    text: `INSERT INTO groups (name, roleid, role) 
    VALUES($1, $2, $3)`,
    values: ['Old school 2016', 1, 'Owner'],
  };

  try {
    await pool.query(createTable);
    await pool.query(user.text, user.values);
    await pool.query(message.text, message.values);
    await pool.query(messageSent.text, messageSent.values);
    await pool.query(messageSent1.text, messageSent1.values);
    await pool.query(messageSent2.text, messageSent2.values);
    await pool.query(messageSent3.text, messageSent3.values);
    await pool.query(messageSent4.text, messageSent5.values);
    await pool.query(messageSent5.text, messageSent5.values);
    await pool.query(messageSent6.text, messageSent6.values);
    await pool.query(messageSent7.text, messageSent7.values);
    await pool.query(group.text, group.values);
    console.log('Tables Successfullly Created');
  } catch (error) {
    console.log(error);
  }
}

create();
