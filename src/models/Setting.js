import pool from "../config/database.js";

class Setting {
  // Get all settings
  static async getAll() {
    const [rows] = await pool.execute(
      "SELECT * FROM settings ORDER BY group_name, key_name"
    );
    return rows;
  }

  // Get settings by group
  static async getByGroup(groupName) {
    const [rows] = await pool.execute(
      "SELECT * FROM settings WHERE group_name = ? ORDER BY key_name",
      [groupName]
    );
    return rows;
  }

  // Get single setting by key
  static async getByKey(keyName) {
    const [rows] = await pool.execute(
      "SELECT * FROM settings WHERE key_name = ?",
      [keyName]
    );
    return rows[0];
  }

  // Update setting by key name
  static async updateByKey(keyName, keyValue) {
    const [existing] = await pool.execute(
      "SELECT * FROM settings WHERE key_name = ?",
      [keyName]
    );

    if (existing.length === 0) {
      throw new Error(`Setting with key '${keyName}' not found`);
    }

    await pool.execute(
      "UPDATE settings SET key_value = ?, updated_at = NOW() WHERE key_name = ?",
      [keyValue, keyName]
    );

    const [updated] = await pool.execute(
      "SELECT * FROM settings WHERE key_name = ?",
      [keyName]
    );

    return updated[0];
  }

  // Update multiple settings at once
  // Update multiple settings at once (with auto-create if not exists)
  static async updateMultiple(settings) {
    const updates = Object.entries(settings).map(
      async ([key_name, key_value]) => {
        const [existing] = await pool.execute(
          "SELECT * FROM settings WHERE key_name = ?",
          [key_name]
        );

        if (existing.length > 0) {
          // Update jika sudah ada
          await pool.execute(
            "UPDATE settings SET key_value = ?, updated_at = NOW() WHERE key_name = ?",
            [key_value, key_name]
          );
        } else {
          // Insert jika belum ada (auto-create)
          await pool.execute(
            `INSERT INTO settings (key_name, key_value, data_type, is_public, created_at, updated_at)
         VALUES (?, ?, 'text', 1, NOW(), NOW())`,
            [key_name, key_value]
          );
        }
      }
    );

    await Promise.all(updates);
    return this.getAll();
  }

  // Legacy methods (untuk backward compatibility dengan controller lama)
  static async findAll(limit = 100, offset = 0) {
    const [rows] = await pool.execute(
      "SELECT * FROM settings ORDER BY group_name, key_name LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM settings WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async count() {
    const [rows] = await pool.execute("SELECT COUNT(*) as total FROM settings");
    return rows[0].total;
  }

  static async update(id, data) {
    const {
      key_name,
      key_value,
      data_type,
      group_name,
      description,
      is_public,
    } = data;

    await pool.execute(
      `UPDATE settings SET
        key_name = ?,
        key_value = ?,
        data_type = ?,
        group_name = ?,
        description = ?,
        is_public = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        key_name,
        key_value || null,
        data_type || "text",
        group_name || null,
        description || null,
        is_public !== undefined ? is_public : 0,
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM settings WHERE id = ?", [id]);
  }

  static async create(data) {
    const {
      key_name,
      key_value,
      data_type,
      group_name,
      description,
      is_public,
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO settings (
        key_name, key_value, data_type, group_name, description, is_public,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        key_name,
        key_value || null,
        data_type || "text",
        group_name || null,
        description || null,
        is_public !== undefined ? is_public : 0,
      ]
    );

    return this.findById(result.insertId);
  }
}

export default Setting;
