import pool from "../config/database.js";

class Slider {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = "SELECT * FROM sliders WHERE 1=1";
    const params = [];

    if (filters.is_active !== undefined) {
      query += " AND is_active = ?";
      params.push(filters.is_active);
    }

    // Filter by date range
    const now = new Date();
    if (filters.active_only) {
      query += " AND is_active = 1";
      query += " AND (start_date IS NULL OR start_date <= ?)";
      query += " AND (end_date IS NULL OR end_date >= ?)";
      params.push(now, now);
    }

    query += " ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM sliders WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM sliders WHERE 1=1";
    const params = [];

    if (filters.is_active !== undefined) {
      query += " AND is_active = ?";
      params.push(filters.is_active);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(sliderData) {
    const {
      title,
      description, // nullable
      image,
      link_url, // nullable
      link_text, // nullable
      link_target, // nullable (_self, _blank)
      button_style, // nullable (primary, secondary, success, etc)
      display_order,
      is_active,
      start_date, // nullable
      end_date, // nullable
    } = sliderData;

    const [result] = await pool.execute(
      `INSERT INTO sliders (
        title, description, image, link_url, link_text, link_target, button_style,
        display_order, is_active, start_date, end_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        description || null, // nullable
        image,
        link_url || null, // nullable
        link_text || null, // nullable
        link_target || "_self", // nullable
        button_style || null, // nullable
        display_order || 0,
        is_active !== undefined ? is_active : 1,
        start_date || null, // nullable
        end_date || null, // nullable
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, sliderData) {
    const {
      title,
      description, // nullable
      image,
      link_url, // nullable
      link_text, // nullable
      link_target, // nullable
      button_style, // nullable
      display_order,
      is_active,
      start_date, // nullable
      end_date, // nullable
    } = sliderData;

    await pool.execute(
      `UPDATE sliders SET
        title = ?,
        description = ?,
        image = ?,
        link_url = ?,
        link_text = ?,
        link_target = ?,
        button_style = ?,
        display_order = ?,
        is_active = ?,
        start_date = ?,
        end_date = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        title,
        description || null, // nullable
        image,
        link_url || null, // nullable
        link_text || null, // nullable
        link_target || "_self", // nullable
        button_style || null, // nullable
        display_order || 0,
        is_active !== undefined ? is_active : 1,
        start_date || null, // nullable
        end_date || null, // nullable
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM sliders WHERE id = ?", [id]);
  }

  // Get active sliders (for public display)
  static async getActiveSliders() {
    const now = new Date();
    const [rows] = await pool.execute(
      `SELECT * FROM sliders
       WHERE is_active = 1
       AND (start_date IS NULL OR start_date <= ?)
       AND (end_date IS NULL OR end_date >= ?)
       ORDER BY display_order ASC`,
      [now, now]
    );
    return rows;
  }

  // Toggle active status
  static async toggleActive(id) {
    await pool.execute(
      "UPDATE sliders SET is_active = NOT is_active, updated_at = NOW() WHERE id = ?",
      [id]
    );
    return this.findById(id);
  }

  // Update display order
  static async updateOrder(id, displayOrder) {
    await pool.execute(
      "UPDATE sliders SET display_order = ?, updated_at = NOW() WHERE id = ?",
      [displayOrder, id]
    );
    return this.findById(id);
  }

  // Get expired sliders
  static async getExpiredSliders() {
    const now = new Date();
    const [rows] = await pool.execute(
      `SELECT * FROM sliders
       WHERE end_date IS NOT NULL AND end_date < ?
       ORDER BY end_date DESC`,
      [now]
    );
    return rows;
  }

  // Get upcoming sliders
  static async getUpcomingSliders() {
    const now = new Date();
    const [rows] = await pool.execute(
      `SELECT * FROM sliders
       WHERE start_date IS NOT NULL AND start_date > ?
       ORDER BY start_date ASC`,
      [now]
    );
    return rows;
  }
}

export default Slider;
