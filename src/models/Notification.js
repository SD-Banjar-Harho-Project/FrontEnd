import pool from "../config/database.js";

class Notification {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `
      SELECT n.*, 
             u.username as recipient_name
      FROM notifications n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.user_id) {
      query += " AND n.user_id = ?";
      params.push(filters.user_id);
    }

    if (filters.type) {
      query += " AND n.type = ?";
      params.push(filters.type);
    }

    if (filters.is_read !== undefined) {
      query += " AND n.is_read = ?";
      params.push(filters.is_read);
    }

    query += " ORDER BY n.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT n.*, 
              u.username as recipient_name
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM notifications WHERE 1=1";
    const params = [];

    if (filters.user_id) {
      query += " AND user_id = ?";
      params.push(filters.user_id);
    }

    if (filters.type) {
      query += " AND type = ?";
      params.push(filters.type);
    }

    if (filters.is_read !== undefined) {
      query += " AND is_read = ?";
      params.push(filters.is_read);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(notificationData) {
    const {
      user_id,
      type, // info, success, warning, error, announcement
      title,
      message,
      data, // nullable (JSON string for additional data)
      is_read,
      action_url, // nullable
    } = notificationData;

    const [result] = await pool.execute(
      `INSERT INTO notifications (
        user_id, type, title, message, data, is_read, action_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        type,
        title,
        message,
        data || null, // nullable
        is_read !== undefined ? is_read : 0,
        action_url || null, // nullable
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, notificationData) {
    const {
      type,
      title,
      message,
      data, // nullable
      is_read,
      read_at, // nullable
      action_url, // nullable
    } = notificationData;

    await pool.execute(
      `UPDATE notifications SET
        type = ?,
        title = ?,
        message = ?,
        data = ?,
        is_read = ?,
        read_at = ?,
        action_url = ?
      WHERE id = ?`,
      [
        type,
        title,
        message,
        data || null, // nullable
        is_read !== undefined ? is_read : 0,
        read_at || null, // nullable
        action_url || null, // nullable
        id,
      ]
    );

    return this.findById(id);
  }

  // Mark as read
  static async markAsRead(id) {
    await pool.execute(
      "UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?",
      [id]
    );
    return this.findById(id);
  }

  // Mark multiple as read
  static async markMultipleAsRead(ids) {
    const placeholders = ids.map(() => "?").join(",");
    await pool.execute(
      `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id IN (${placeholders})`,
      ids
    );
  }

  // Mark all as read for a user
  static async markAllAsRead(userId) {
    await pool.execute(
      "UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0",
      [userId]
    );
  }

  static async delete(id) {
    await pool.execute("DELETE FROM notifications WHERE id = ?", [id]);
  }

  // Delete all notifications for a user
  static async deleteByUserId(userId) {
    await pool.execute("DELETE FROM notifications WHERE user_id = ?", [userId]);
  }

  // Get unread notifications for a user
  static async getUnreadByUser(userId, limit = 10) {
    const [rows] = await pool.execute(
      `SELECT * FROM notifications
       WHERE user_id = ? AND is_read = 0
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  // Count unread notifications for a user
  static async countUnreadByUser(userId) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND is_read = 0",
      [userId]
    );
    return rows[0].total;
  }

  // Get notifications by type
  static async getByType(type, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT n.*, 
              u.username as recipient_name
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.type = ?
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      [type, limit, offset]
    );
    return rows;
  }

  // Create notification for all users
  static async createForAllUsers(notificationData) {
    const { type, title, message, data, action_url } = notificationData;

    // Get all active users
    const [users] = await pool.execute(
      "SELECT id FROM users WHERE is_active = 1"
    );

    if (users.length === 0) return { count: 0 };

    // Insert one by one (lebih aman)
    for (const user of users) {
      await pool.execute(
        `INSERT INTO notifications (user_id, type, title, message, data, is_read, action_url, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, NOW())`,
        [user.id, type, title, message, data || null, action_url || null]
      );
    }

    return { count: users.length };
  }
}

export default Notification;
