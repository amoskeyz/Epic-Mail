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
    const role = 'Owner';
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
}

export default groupController;
