const query = {
  userQueries: {
    getEmail: 'SELECT * FROM users WHERE email = $1',
    insertUser: 'INSERT INTO users( firstname, lastname, email, phoneNumber, password)VALUES($1, $2, $3, $4, $5) RETURNING *',
    getUser: 'select * from users where id = $1',
  },

  messageQueries: {
    getReceived: 'SELECT created_on, subject, message, parentmessageid, status FROM inbox where receiverid = $1',
    getUnread: 'SELECT * FROM messages WHERE (receiverid = $1 AND status  = $2)',
    getSent: 'SELECT created_on, subject, message, parentmessageid, status FROM sent where senderid = $1',
    getSpecific: 'SELECT * FROM messages WHERE (receiverid = $1 OR senderid  = $2)',
    getSentMessage: 'select * from sent where (message_id = $1 AND senderid =$2)',
    getInboxMessage: 'select * from inbox where message_id = $1 AND receiverid =$2',
    compose: 'INSERT INTO messages( subject, message, parentmessageid, receiverid, status, senderid)VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    updateSent: 'INSERT INTO sent( message_id, subject, message, parentmessageid, receiverid, status, senderid)VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    updateInbox: 'INSERT INTO inbox( message_id, subject, message, parentmessageid, receiverid, status, senderid)VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    selectMessage: 'SELECT senderid, receiverid FROM messages WHERE (senderid = $1 OR receiverid = $2) AND id = $3',
    deleteInbox: 'DELETE FROM inbox WHERE (message_id = $1 AND receiverid = $2)',
    deleteSent: 'DELETE FROM sent WHERE (message_id = $1 AND senderid = $2)',
  },

  groupQueries: {
    group: 'SELECT * FROM groups where name = $1',
    createGroup: 'INSERT INTO groups( name, role, roleid )VALUES($1,$2,$3) RETURNING *',
    addUser: 'INSERT INTO members( user_id, group_id, user_role, admin_id )VALUES($1,$2,$3, $4) RETURNING *',
    check: 'select * FROM groups where roleid = $1',
    selectGroup: 'select * from groups where roleid = $1 AND id = $2',
    updateName: 'UPDATE groups SET name = $1 WHERE (roleid = $2 AND id = $3) RETURNING name ',
    specificGroup: 'select * from groups where (id = $1 AND roleid = $2)',
    deleteGroup: 'Delete from groups where (id = $1 AND roleid = $2)',
    selectMember: 'select * from members where user_id = $1 AND group_id = $2',
    selectUser: 'select * from members where group_id = $1 AND user_id = $2 AND admin_id = $3',
    deleteUser: 'delete from members where group_id = $1 AND user_id = $2 AND admin_id = $3',
    checkMember: 'select * from members where group_id = $1 AND (user_id = $2 OR admin_id = $3)',
    selectUserId: 'select user_id from members where group_id = $1',
  },
};
export default query;
