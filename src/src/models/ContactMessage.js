import pool from "../config/database.js";

class ContactMessage {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `
      SELECT cm.*, 
             u.username as replied_by_name
      FROM contact_messages cm
      LEFT JOIN users u ON cm.replied_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += " AND cm.status = ?";
      params.push(filters.status);
    }

    if (filters.search) {
      query +=
        " AND (cm.name LIKE ? OR cm.email LIKE ? OR cm.subject LIKE ? OR cm.message LIKE ?)";
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    query += " ORDER BY cm.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT cm.*, 
              u.username as replied_by_name
       FROM contact_messages cm
       LEFT JOIN users u ON cm.replied_by = u.id
       WHERE cm.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM contact_messages WHERE 1=1";
    const params = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(messageData) {
    const {
      name,
      email, // nullable
      phone, // nullable
      subject,
      message,
      status, // new, read, replied
      ip_address, // nullable
      user_agent, // nullable
    } = messageData;

    const [result] = await pool.execute(
      `INSERT INTO contact_messages (
        name, email, phone, subject, message, status, ip_address, user_agent,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name,
        email || null, // nullable
        phone || null, // nullable
        subject,
        message,
        status || "new",
        ip_address || null, // nullable
        user_agent || null, // nullable
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, messageData) {
    const {
      name,
      email, // nullable
      phone, // nullable
      subject,
      message,
      status,
      replied_at, // nullable
      replied_by, // nullable
      reply_message, // nullable
    } = messageData;

    await pool.execute(
      `UPDATE contact_messages SET
        name = ?,
        email = ?,
        phone = ?,
        subject = ?,
        message = ?,
        status = ?,
        replied_at = ?,
        replied_by = ?,
        reply_message = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        name,
        email || null, // nullable
        phone || null, // nullable
        subject,
        message,
        status || "new",
        replied_at || null, // nullable
        replied_by || null, // nullable
        reply_message || null, // nullable
        id,
      ]
    );

    return this.findById(id);
  }

  // Mark as read
  static async markAsRead(id) {
    await pool.execute(
      "UPDATE contact_messages SET status = 'read', updated_at = NOW() WHERE id = ?",
      [id]
    );
    return this.findById(id);
  }

  // Reply to message
  static async reply(id, replyMessage, userId) {
    await pool.execute(
      `UPDATE contact_messages SET
        status = 'replied',
        replied_at = NOW(),
        replied_by = ?,
        reply_message = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [userId, replyMessage, id]
    );
    return this.findById(id);
  }

  // Update status only
  static async updateStatus(id, status) {
    await pool.execute(
      "UPDATE contact_messages SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM contact_messages WHERE id = ?", [id]);
  }

  // Get messages by status
  static async getByStatus(status, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT cm.*, 
              u.username as replied_by_name
       FROM contact_messages cm
       LEFT JOIN users u ON cm.replied_by = u.id
       WHERE cm.status = ?
       ORDER BY cm.created_at DESC
       LIMIT ? OFFSET ?`,
      [status, limit, offset]
    );
    return rows;
  }

  // Count by status
  static async countByStatus(status) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM contact_messages WHERE status = ?",
      [status]
    );
    return rows[0].total;
  }

  // Get unread count
  static async getUnreadCount() {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM contact_messages WHERE status = 'new'"
    );
    return rows[0].total;
  }
}

export default ContactMessage;
