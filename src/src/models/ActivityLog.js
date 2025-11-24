import pool from "../config/database.js";

class ActivityLog {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `
      SELECT al.*, 
             u.username as user_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.user_id) {
      query += " AND al.user_id = ?";
      params.push(filters.user_id);
    }

    if (filters.action) {
      query += " AND al.action = ?";
      params.push(filters.action);
    }

    if (filters.model_type) {
      query += " AND al.model_type = ?";
      params.push(filters.model_type);
    }

    if (filters.model_id) {
      query += " AND al.model_id = ?";
      params.push(filters.model_id);
    }

    if (filters.date_from) {
      query += " AND al.created_at >= ?";
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += " AND al.created_at <= ?";
      params.push(filters.date_to);
    }

    query += " ORDER BY al.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT al.*, 
              u.username as user_name
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT * FROM activity_logs
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM activity_logs WHERE 1=1";
    const params = [];

    if (filters.user_id) {
      query += " AND user_id = ?";
      params.push(filters.user_id);
    }

    if (filters.action) {
      query += " AND action = ?";
      params.push(filters.action);
    }

    if (filters.model_type) {
      query += " AND model_type = ?";
      params.push(filters.model_type);
    }

    if (filters.date_from) {
      query += " AND created_at >= ?";
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      query += " AND created_at <= ?";
      params.push(filters.date_to);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(logData) {
    const {
      user_id,
      action, // create, update, delete, login, logout, view
      model_type, // nullable (Post, User, Teacher, etc)
      model_id, // nullable (ID of the model)
      description, // nullable
      old_values, // nullable (JSON string)
      new_values, // nullable (JSON string)
      ip_address, // nullable
      user_agent, // nullable
    } = logData;

    const [result] = await pool.execute(
      `INSERT INTO activity_logs (
        user_id, action, model_type, model_id, description,
        old_values, new_values, ip_address, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id,
        action,
        model_type || null, // nullable
        model_id || null, // nullable
        description || null, // nullable
        old_values || null, // nullable
        new_values || null, // nullable
        ip_address || null, // nullable
        user_agent || null, // nullable
      ]
    );

    return this.findById(result.insertId);
  }

  // Note: Activity logs should NOT be updated or deleted (audit trail)
  // Only include delete for admin cleanup of old logs

  static async delete(id) {
    await pool.execute("DELETE FROM activity_logs WHERE id = ?", [id]);
  }

  // Delete old logs (cleanup)
  static async deleteOlderThan(days) {
    await pool.execute(
      "DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)",
      [days]
    );
  }

  // Get logs by model
  static async getByModel(modelType, modelId, limit = 10) {
    const [rows] = await pool.execute(
      `SELECT al.*, 
              u.username as user_name
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.model_type = ? AND al.model_id = ?
       ORDER BY al.created_at DESC
       LIMIT ?`,
      [modelType, modelId, limit]
    );
    return rows;
  }

  // Get logs by action
  static async getByAction(action, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT al.*, 
              u.username as user_name
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       WHERE al.action = ?
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [action, limit, offset]
    );
    return rows;
  }

  // Get recent activities
  static async getRecent(limit = 20) {
    const [rows] = await pool.execute(
      `SELECT al.*, 
              u.username as user_name
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  // Get activity statistics
  static async getStatistics(dateFrom, dateTo) {
    const [rows] = await pool.execute(
      `SELECT 
        action,
        COUNT(*) as count
       FROM activity_logs
       WHERE created_at BETWEEN ? AND ?
       GROUP BY action
       ORDER BY count DESC`,
      [dateFrom, dateTo]
    );
    return rows;
  }
}

export default ActivityLog;
