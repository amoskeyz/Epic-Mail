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
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  subject text NOT NULL,
  message text NOT NULL,
  receiverid integer NOT NULL,
  senderid integer NOT NULL,
  parentmessageid integer,
  status text NOT NULL
);
`;

const inboxTable = `CREATE TABLE IF NOT EXISTS inbox(
  id serial PRIMARY KEY,
  message_id integer,
  created_on TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  subject text NOT NULL,
  message text NOT NULL,
  receiverid integer NOT NULL,
  senderid integer NOT NULL,
  parentmessageid integer,
  status text NOT NULL,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);
`;

const sentTable = `CREATE TABLE IF NOT EXISTS sent(
  id serial PRIMARY KEY,
  message_id integer,
  created_on TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  subject text NOT NULL,
  message text NOT NULL,
  receiverid integer NOT NULL,
  senderid integer NOT NULL,
  parentmessageid integer,
  status text NOT NULL,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);
`;
const groupTable = `CREATE TABLE IF NOT EXISTS groups(
  id serial,
  created_on TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(255) NOT NULL,
  role text NOT NULL,
  roleid int NOT NULL,
  PRIMARY KEY (id)
);
`;
const membersTable = `CREATE TABLE IF NOT EXISTS members(
  id serial,
  user_id int not null,
  group_id int not null,
  admin_id int not null,
  user_role text not null,
  PRIMARY KEY (id),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
  );
  `;


async function create() {
  const createTable = `${userTable}${messageTable}${groupTable}${membersTable}${inboxTable}${sentTable}`;
  const user = {
    text: `INSERT INTO users (firstname, lastname, email, phonenumber, password) 
    VALUES($1, $2, $3, $4, $5)`,
    values: ['amos', 'oruaroghene', 'amoserve@gmail.com', 667, 'seven'],
  };
  const user1 = {
    text: `INSERT INTO users (firstname, lastname, email, phonenumber, password) 
    VALUES($1, $2, $3, $4, $5)`,
    values: ['Marv', 'Tina', 'amoslv@gmail.com', 667, 'seven'],
  };

  const message = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 5, 4, 3, 'unread'],
  };

  const messageSent = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 5, 1, 1, 'sent'],
  };

  const messageSent1 = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 5, 2, 1, 'sent'],
  };

  const messageSent2 = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 5, 3, 1, 'sent'],
  };

  const messageSent3 = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 3, 3, 1, 'unread'],
  };

  const messageSent4 = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 2, 3, 1, 'unread'],
  };

  const messageSent5 = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 2, 3, 1, 'unread'],
  };
  const messageSent6 = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 2, 2, 1, 'unread'],
  };

  const messageSent7 = {
    text: `INSERT INTO messages (subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6)`,
    values: ['things to do in life', 'i have a very big ball', 1, 1, 1, 'unread'],
  };
  const inbox = {
    text: `INSERT INTO inbox (message_id, subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [1, 'things to do in life', 'i have a very big ball', 3, 1, 1, 'unread'],
  };
  const sent = {
    text: `INSERT INTO sent (message_id, subject, message, receiverid, senderid, parentmessageid, status) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [4, 'things to do in life', 'i have a very big ball', 5, 3, 1, 'sent'],
  };
  const group = {
    text: `INSERT INTO groups (name, roleid, role) 
    VALUES($1, $2, $3)`,
    values: ['Old school 2016', 1, 'Admin'],
  };

  try {
    await pool.query(createTable);
    await pool.query(user.text, user.values);
    await pool.query(user1);
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
    await pool.query(inbox.text, inbox.values);
    await pool.query(sent.text, sent.values);
    console.log('Tables Successfully Created');
  } catch (error) {
    console.log(error);
  }
}

create();
