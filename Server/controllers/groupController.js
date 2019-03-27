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
}

export default groupController;
