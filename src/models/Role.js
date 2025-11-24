import pool from "../config/database.js";

class Role {
  static async findAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM roles ORDER BY created_at DESC"
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM roles WHERE id = ?", [id]);
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await pool.execute("SELECT * FROM roles WHERE name = ?", [
      name,
    ]);
    return rows[0];
  }

  static async findWithPermissions(id) {
    const [rows] = await pool.execute(
      `SELECT r.*, 
       GROUP_CONCAT(p.id) as permission_ids,
       GROUP_CONCAT(p.name) as permission_names
       FROM roles r
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE r.id = ?
       GROUP BY r.id`,
      [id]
    );

    if (rows[0]) {
      rows[0].permissions = rows[0].permission_ids
        ? rows[0].permission_ids.split(",").map((id, index) => ({
            id: parseInt(id),
            name: rows[0].permission_names.split(",")[index],
          }))
        : [];
      delete rows[0].permission_ids;
      delete rows[0].permission_names;
    }

    return rows[0];
  }

  static async create(roleData) {
    const { name, display_name, description } = roleData;

    const [result] = await pool.execute(
      "INSERT INTO roles (name, display_name, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [name, display_name, description]
    );

    return this.findById(result.insertId);
  }

  static async update(id, roleData) {
    const { name, display_name, description } = roleData;

    await pool.execute(
      "UPDATE roles SET name = ?, display_name = ?, description = ?, updated_at = NOW() WHERE id = ?",
      [name, display_name, description, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM roles WHERE id = ?", [id]);
  }

  static async assignPermissions(roleId, permissionIds) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        "DELETE FROM role_permissions WHERE role_id = ?",
        [roleId]
      );

      if (permissionIds && permissionIds.length > 0) {
        const values = permissionIds.map((permId) => [
          roleId,
          permId,
          new Date(),
        ]);
        await connection.query(
          "INSERT INTO role_permissions (role_id, permission_id, created_at) VALUES ?",
          [values]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Role;
