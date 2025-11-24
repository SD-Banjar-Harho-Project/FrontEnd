import pool from "../config/database.js";

class User {
  static async findAll(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as role_name, r.display_name as role_display_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.deleted_at IS NULL
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  static async count() {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL"
    );
    return rows[0].total;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as role_name, r.display_name as role_display_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? AND u.deleted_at IS NULL`,
      [id]
    );
    return rows[0];
  }

  static async findByIdWithRole(id) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as role_name, r.display_name as role_display_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ? AND deleted_at IS NULL",
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );
    return rows[0];
  }

  static async create(userData) {
    const {
      username,
      email,
      password_hash,
      full_name,
      phone,
      role_id,
      avatar,
      is_active = 1,
    } = userData;

    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password_hash, full_name, phone, role_id, avatar, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        username,
        email,
        password_hash,
        full_name,
        phone,
        role_id,
        avatar,
        is_active,
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, userData) {
    const { email, full_name, phone, role_id, avatar, is_active } = userData;

    await pool.execute(
      `UPDATE users 
       SET email = ?, full_name = ?, phone = ?, role_id = ?, avatar = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [email, full_name, phone, role_id, avatar, is_active, id]
    );

    return this.findById(id);
  }

  static async updatePassword(id, password_hash) {
    await pool.execute(
      "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
      [password_hash, id]
    );
  }

  static async updateLastLogin(id) {
    await pool.execute("UPDATE users SET last_login_at = NOW() WHERE id = ?", [
      id,
    ]);
  }

  static async delete(id) {
    await pool.execute("UPDATE users SET deleted_at = NOW() WHERE id = ?", [
      id,
    ]);
  }

  static async hardDelete(id) {
    await pool.execute("DELETE FROM users WHERE id = ?", [id]);
  }

  static async search(searchTerm, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE (u.username LIKE ? OR u.email LIKE ? OR u.full_name LIKE ?)
       AND u.deleted_at IS NULL
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
    );
    return rows;
  }

  // Get deleted users
  static async findDeleted(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as role_name
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     WHERE u.deleted_at IS NOT NULL
     ORDER BY u.deleted_at DESC
     LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  // Count deleted users
  static async countDeleted() {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM users WHERE deleted_at IS NOT NULL"
    );
    return rows[0].total;
  }

  // Restore deleted user
  static async restore(id) {
    const [users] = await pool.execute(
      "SELECT * FROM users WHERE id = ? AND deleted_at IS NOT NULL",
      [id]
    );

    if (users.length === 0) {
      return null;
    }

    await pool.execute(
      "UPDATE users SET deleted_at = NULL, updated_at = NOW() WHERE id = ?",
      [id]
    );

    return this.findById(id);
  }
}

export default User;
