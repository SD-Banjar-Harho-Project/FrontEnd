import pool from "../config/database.js";

class Menu {
  static async findAll(limit = 100, offset = 0, filters = {}) {
    let query = "SELECT * FROM menus WHERE 1=1";
    const params = [];

    if (filters.location) {
      query += " AND location = ?";
      params.push(filters.location);
    }

    if (filters.search) {
      query += " AND name LIKE ?";
      params.push(`%${filters.search}%`);
    }

    query += " ORDER BY name ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM menus WHERE id = ?", [id]);
    return rows[0];
  }

  static async findByLocation(location) {
    const [rows] = await pool.execute(
      "SELECT * FROM menus WHERE location = ? ORDER BY name ASC",
      [location]
    );
    return rows;
  }

  static async findByName(name) {
    const [rows] = await pool.execute("SELECT * FROM menus WHERE name = ?", [
      name,
    ]);
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM menus WHERE 1=1";
    const params = [];

    if (filters.location) {
      query += " AND location = ?";
      params.push(filters.location);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(menuData) {
    const {
      name,
      location, // nullable (header, footer, sidebar, main)
    } = menuData;

    // Check if menu name already exists
    const existing = await this.findByName(name);
    if (existing) {
      throw new Error("Menu name already exists");
    }

    const [result] = await pool.execute(
      `INSERT INTO menus (name, location, created_at, updated_at) 
       VALUES (?, ?, NOW(), NOW())`,
      [
        name,
        location || null, // nullable
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, menuData) {
    const {
      name,
      location, // nullable
    } = menuData;

    // Check if new name conflicts with existing menu (excluding current menu)
    const [existingMenus] = await pool.execute(
      "SELECT * FROM menus WHERE name = ? AND id != ?",
      [name, id]
    );

    if (existingMenus.length > 0) {
      throw new Error("Menu name already exists");
    }

    await pool.execute(
      `UPDATE menus SET
        name = ?,
        location = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        name,
        location || null, // nullable
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM menus WHERE id = ?", [id]);
  }

  // Get all unique locations
  static async getLocations() {
    const [rows] = await pool.execute(
      "SELECT DISTINCT location FROM menus WHERE location IS NOT NULL ORDER BY location"
    );
    return rows.map((row) => row.location);
  }

  // Count menus by location
  static async countByLocation(location) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM menus WHERE location = ?",
      [location]
    );
    return rows[0].total;
  }
}

export default Menu;
