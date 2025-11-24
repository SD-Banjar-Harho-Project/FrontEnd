import pool from "../config/database.js";

class Permission {
  static async findAll(limit = 100, offset = 0, filters = {}) {
    let query = "SELECT * FROM permissions WHERE 1=1";
    const params = [];

    if (filters.module) {
      query += " AND module = ?";
      params.push(filters.module);
    }

    if (filters.search) {
      query +=
        " AND (name LIKE ? OR display_name LIKE ? OR description LIKE ?)";
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    query += " ORDER BY module ASC, name ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM permissions WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await pool.execute(
      "SELECT * FROM permissions WHERE name = ?",
      [name]
    );
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM permissions WHERE 1=1";
    const params = [];

    if (filters.module) {
      query += " AND module = ?";
      params.push(filters.module);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(permissionData) {
    const { name, display_name, description, module } = permissionData;

    const existing = await this.findByName(name);
    if (existing) {
      throw new Error("Permission name already exists");
    }

    const [result] = await pool.execute(
      `INSERT INTO permissions (name, display_name, description, module, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [name, display_name, description || null, module || null]
    );

    return this.findById(result.insertId);
  }

  static async update(id, permissionData) {
    const { name, display_name, description, module } = permissionData;

    const [existingPerms] = await pool.execute(
      "SELECT * FROM permissions WHERE name = ? AND id != ?",
      [name, id]
    );

    if (existingPerms.length > 0) {
      throw new Error("Permission name already exists");
    }

    await pool.execute(
      `UPDATE permissions SET name = ?, display_name = ?, description = ?, module = ? WHERE id = ?`,
      [name, display_name, description || null, module || null, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM permissions WHERE id = ?", [id]);
  }

  static async getModules() {
    const [rows] = await pool.execute(
      "SELECT DISTINCT module FROM permissions WHERE module IS NOT NULL ORDER BY module"
    );
    return rows.map((row) => row.module);
  }

  static async getByModule(module) {
    const [rows] = await pool.execute(
      "SELECT * FROM permissions WHERE module = ? ORDER BY name ASC",
      [module]
    );
    return rows;
  }
  static async getGroups() {
    return this.getModules();
  }

  static async getByGroup(group) {
    return this.getByModule(group);
  }
}

export default Permission;
