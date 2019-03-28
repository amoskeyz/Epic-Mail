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
}

export default groupController;
