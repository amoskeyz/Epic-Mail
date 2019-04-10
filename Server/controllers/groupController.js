import pool from '../config/config';
import errorResponse from '../helper/errorResponse';
import query from '../migration/query';

const { userQueries, messageQueries, groupQueries } = query;

class groupController {
  static async createGroup(req, res) {
    const userId = req.decoder;
    const { name } = req.body;
    try {
      const response = await pool.query(groupQueries.group, [name]);
      if (response.rows[0]) {
        return errorResponse(400, 'Group Already Exist', res);
      }
      const roleId = userId;
      const role = 'Admin';
      const group = [name, role, roleId];
      const groupArray = await pool.query(groupQueries.createGroup, group);
      const { id } = groupArray.rows[0];
      const addAdmin = [roleId, id, 'Admin', roleId];
      await pool.query(groupQueries.addUser, addAdmin);
      return res.status(201).json({
        status: 201,
        data: { id, name, role },
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async groups(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query(groupQueries.check, [id]);
      if (!response.rows[0]) {
        return errorResponse(400, 'You Do Not Belong To Any Group', res);
      }
      return res.status(200).json({
        status: 200,
        data: (response.rows),
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async updateGroup(req, res) {
    const id = req.decoder;
    let { name } = req.body;
    const groupId = req.params.id;
    name = name.trim();
    try {
      const response = await pool.query(groupQueries.selectGroup, [id, groupId]);
      if (!response.rows[0]) {
        return errorResponse(404, 'Group Does Not Exist', res);
      }
      const respon = await pool.query(groupQueries.group, [name]);
      if (respon.rows[0] !== undefined) {
        return errorResponse(400, 'Group Name Already Exist', res);
      }
      const output = await pool.query(groupQueries.updateName, [name, id, groupId]);
      return res.status(200).json({
        status: 'successful',
        data: output.rows[0],
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async deleteGroup(req, res) {
    const id = req.decoder;
    const groupId = req.params.id;
    try {
      const response = await pool.query(groupQueries.specificGroup, [groupId, id]);
      if (!response.rows[0]) {
        return errorResponse(404, 'Group Does Not Exist', res);
      }
      await pool.query(groupQueries.deleteGroup, [groupId, id]);
      return res.status(200).json({
        status: 200,
        message: 'Delete Successful',
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async addUser(req, res) {
    const adminId = req.decoder;
    const groupId = req.params.id;
    const { email } = req.body;
    try {
      const respon = await pool.query(groupQueries.selectGroup, [adminId, groupId]);
      if (!respon.rows[0]) {
        return errorResponse(404, 'Group Does Not Exist', res);
      }
      const response = await pool.query(userQueries.getEmail, [email]);
      if (!response.rows[0]) {
        return errorResponse(400, 'User Does Not Exist', res);
      }
      const userId = response.rows[0].id;
      const isExist = await pool.query(groupQueries.selectMember, [userId, groupId]);
      if (isExist.rows[0]) {
        const admin = isExist.rows[0].admin_id;
        if (admin !== adminId) {
          return errorResponse(400, 'Not an Admin of this Group', res);
        }
        return errorResponse(400, 'Already a Member', res);
      }
      if (userId === adminId) {
        return errorResponse(404, 'Cannot Add Self', res);
      }
      const userRole = 'member';
      const addUser = [userId, groupId, userRole, adminId];
      const groupArray = await pool.query(groupQueries.addUser, addUser);
      const { id } = groupArray.rows[0];
      return res.status(201).json({
        status: 201,
        data: { id, userId, userRole },
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async deleteUser(req, res) {
    const adminId = req.decoder;
    const { groupId, userId } = req.params;
    try {
      const isExist = await pool.query(userQueries.getUser, [userId]);
      if (!isExist.rows[0].id) {
        return errorResponse(404, 'User Does not Exist', res);
      }
      const response = await pool.query(groupQueries.selectUser, [groupId, userId, adminId]);
      if (!response.rows[0]) {
        return errorResponse(404, 'User Not Found in group', res);
      }
      await pool.query(groupQueries.deleteUser, [groupId, userId, adminId]);
      return res.status(200).json({
        status: 200,
        Message: 'Delete Successful',
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async messageGroup(req, res) {
    const { subject, message } = req.body;
    const id = req.decoder;
    const { groupId } = req.params;
    try {
      const resp = await pool.query(groupQueries.checkMember, [groupId, id, id]);
      if (!resp.rows[0]) {
        return errorResponse(404, 'Not a Member of This Group', res);
      }
      const response = await pool.query(groupQueries.selectUserId, [groupId]);
      if (!response.rows[0]) {
        return errorResponse(404, 'No Group Member Found', res);
      }
      const senderid = id;
      const status = 'unread';
      const mess = [subject, message, 0, 0, status, senderid];
      const messageArray = await pool.query(messageQueries.compose, mess);
      const messageId = messageArray.rows[0].id;
      let collect = '';
      const index = response.rows.findIndex(add => add.user_id === id);
      let dataObj = [];
      if (response.rows.length > 1) {
        for (let i = 0; i < response.rows.length; i += 1) {
          if (i !== index) {
            const messager = {
              text: `INSERT INTO inbox(
              message_id,  
              subject,
              message,
              parentmessageid,
              receiverid,
              status,
              senderid)VALUES('${messageId}', '${subject}', '${message}', ${id} ,${response.rows[i].user_id}, '${status}', ${senderid}) RETURNING *; `,
            };
            collect += messager.text;
          }
        }
        const datass = await pool.query(collect);
        if (response.rows.length > 2) {
          dataObj = datass.map(arrays => arrays.rows);
        } else dataObj = datass.rows;
      }
      const sender = [messageId, subject, message, id, id, 'Sent', senderid];
      const send = await pool.query(messageQueries.updateSent, sender);
      return res.status(200).json({
        data: dataObj,
        sender: send.rows,
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }
}

export default groupController;
