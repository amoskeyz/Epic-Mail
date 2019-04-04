import pool from '../config/config';

class groupController {
  static async createGroup(req, res) {
    const idd = req.decoder;
    const { name } = req.body;
    try {
      const response = await pool.query('SELECT * FROM groups where name = $1', [name]);
      if (response.rows[0] !== undefined) {
        return res.status(400).json({
          status: 400,
          error: 'group already exist',
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 500,
        error: 'server Error',
      });
    }
    const roleId = idd;
    const role = 'Admin';
    const group = {
      text: `INSERT INTO groups(
            name,
            role,
            roleid
        )VALUES($1,$2,$3) RETURNING *`,
      values: [name, role, roleId],
    };

    const groupArray = await pool.query(group);
    const { id } = groupArray.rows[0];
    const addAdmin = {
      text: `INSERT INTO members(
            user_id,
            group_id,
            user_role,
            admin_id
        )VALUES($1,$2,$3, $4) RETURNING *`,
      values: [roleId, id, 'Admin', roleId],
    };
    await pool.query(addAdmin);
    return res.status(201).json({
      status: 201,
      data: { id, name, role },
    });
  }

  static async groups(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query('select id, name, role FROM groups where roleid = $1', [id]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 401,
          Error: 'You do not own or belong to any group',
        });
      }
      return res.status(200).json({
        status: 200,
        data: (response.rows),
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'server error',
      });
    }
  }

  static async updateGroup(req, res) {
    const id = req.decoder;
    let { name } = req.body;
    const groupId = req.params.id;
    name = name.trim();
    try {
      const response = await pool.query('select * from groups where roleid = $1 AND id = $2', [id, groupId]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 404,
          Error: 'Group does not exist',
        });
      }
      const respon = await pool.query('select * from groups where name = $1', [name]);
      if (respon.rows[0] !== undefined) {
        return res.status(404).json({
          status: 404,
          Error: 'Group name already exist',
        });
      }
      const output = await pool.query('UPDATE groups SET name = $1 WHERE (roleid = $2 AND id = $3) RETURNING name ', [name, id, groupId]);
      return res.status(200).json({
        status: 'successful',
        data: output.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        ststus: 500,
        Error: 'server error',
      });
    }
  }

  static async deleteGroup(req, res) {
    const id = req.decoder;
    const groupId = req.params.id;
    try {
      const response = await pool.query('select * from groups where (id = $1 AND roleid = $2)', [groupId, id]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 404,
          Error: 'Message does not exist',
        });
      }
      await pool.query('Delete from groups where (id = $1 AND roleid = $2)', [groupId, id]);
      return res.status(200).json({
        status: 200,
        message: 'Delete Successful',
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        Error: 'Server Error',
      });
    }
  }

  static async addUser(req, res) {
    const adminId = req.decoder;
    const groupId = req.params.id;
    const { email } = req.body;
    try {
      const response = await pool.query('select * from users where email = $1', [email]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 404,
          Error: 'User does not exist',
        });
      }
      const userId = response.rows[0].id;
      const isExist = await pool.query('select * from members where user_id = $1 AND group_id = $2', [userId, groupId]);
      if (isExist.rows[0] !== undefined) {
        return res.status(404).json({
          status: 404,
          Error: 'Already a member',
        });
      }
      if (userId === adminId) {
        return res.status(404).json({
          status: 404,
          Error: 'Cannot add self',
        });
      }
      const userRole = 'member';
      const addUser = {
        text: `INSERT INTO members(
              user_id,
              group_id,
              user_role,
              admin_id
          )VALUES($1,$2,$3, $4) RETURNING *`,
        values: [userId, groupId, userRole, adminId],
      };

      const groupArray = await pool.query(addUser);
      const { id } = groupArray.rows[0];
      return res.status(201).json({
        status: 201,
        data: { id, userId, userRole },
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        Error: 'Server Error',
      });
    }
  }

  static async deleteUser(req, res) {
    const adminId = req.decoder;
    const { groupId, userId } = req.params;
    try {
      const isExist = await pool.query('select * from users where id = $1', [userId]);
      if (isExist.rows[0].id === undefined) {
        return res.status(404).json({
          status: 404,
          Message: 'user does not exist',
        });
      }
      const response = await pool.query('select * from members where group_id = $1 AND user_id = $2 AND admin_id = $3', [groupId, userId, adminId]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 404,
          Message: 'user not found in group',
        });
      }
      await pool.query('delete from members where group_id = $1 AND user_id = $2 AND admin_id = $3', [groupId, userId, adminId]);
      return res.status(200).json({
        status: 200,
        Message: 'Delete Successful',
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        Error: 'Server Error',
      });
    }
  }

  static async messageGroup(req, res) {
    const { subject, message } = req.body;
    const id = req.decoder;
    const { groupId } = req.params;
    try {
      const resp = await pool.query('select * from members where group_id = $1 AND user_id = $2 OR admin_id = $3', [groupId, id, id]);
      if (!resp.rows[0]) { return res.status(404).json({ status: 404, Error: 'NOT A MEMBER OF THIS GROUP' }); }
      const response = await pool.query('select user_id from members where group_id = $1', [groupId]);
      if (!response.rows[0]) { return res.status(404).json({ status: 404, Error: 'NO GROUP MEMBER FOUND' }); }
      const senderid = id;
      const status = 'unread';
      let collect = '';
      const index = response.rows.findIndex(add => add.user_id === id);
      let dataObj = [];
      if (response.rows.length > 1) {
        for (let i = 0; i < response.rows.length; i += 1) {
          if (i !== index) {
            const messager = {
              text: `INSERT INTO inbox(  
              subject,
              message,
              parentmessageid,
              receiverid,
              status,
              senderid)VALUES('${subject}', '${message}', ${id} ,${response.rows[i].user_id}, '${status}', ${senderid}) RETURNING *; `,
            };
            collect += messager.text;
          }
        }
        const datass = await pool.query(collect);
        if (response.rows.length > 2) {
          dataObj = datass.map(arrays => arrays.rows);
        } else dataObj = datass.rows;
      }
      const sender = {
        text: `INSERT INTO sent(  
        subject,
        message,
        parentmessageid,
        receiverid,
        status,
        senderid)VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        values: [subject, message, id, id, 'Sent', senderid],
      };
      const send = await pool.query(sender);
      return res.status(200).json({
        data: dataObj,
        sender: send.rows,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        Error: 'Server Error',
      });
    }
  }
}

export default groupController;
