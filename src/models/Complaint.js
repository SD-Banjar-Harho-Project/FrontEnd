import pool from "../config/database.js";

class Complaint {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `
      SELECT c.*, 
             u_assigned.username as assigned_to_name,
             u_resolved.username as resolved_by_name
      FROM complaints c
      LEFT JOIN users u_assigned ON c.assigned_to = u_assigned.id
      LEFT JOIN users u_resolved ON c.resolved_by = u_resolved.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += " AND c.status = ?";
      params.push(filters.status);
    }

    if (filters.category) {
      query += " AND c.category = ?";
      params.push(filters.category);
    }

    if (filters.priority) {
      query += " AND c.priority = ?";
      params.push(filters.priority);
    }

    if (filters.assigned_to) {
      query += " AND c.assigned_to = ?";
      params.push(filters.assigned_to);
    }

    if (filters.search) {
      query +=
        " AND (c.name LIKE ? OR c.email LIKE ? OR c.subject LIKE ? OR c.message LIKE ?)";
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    query += " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, 
              u_assigned.username as assigned_to_name,
              u_resolved.username as resolved_by_name
       FROM complaints c
       LEFT JOIN users u_assigned ON c.assigned_to = u_assigned.id
       LEFT JOIN users u_resolved ON c.resolved_by = u_resolved.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByTicketNumber(ticketNumber) {
    const [rows] = await pool.execute(
      "SELECT * FROM complaints WHERE ticket_number = ?",
      [ticketNumber]
    );
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM complaints WHERE 1=1";
    const params = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    if (filters.category) {
      query += " AND category = ?";
      params.push(filters.category);
    }

    if (filters.priority) {
      query += " AND priority = ?";
      params.push(filters.priority);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  // Generate unique ticket number
  static async generateTicketNumber() {
    const prefix = "TKT";
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    return `${prefix}-${year}${month}-${random}`;
  }

  static async create(complaintData) {
    const {
      name,
      email, // nullable
      phone, // nullable
      category, // nullable (umum, fasilitas, guru, akademik, dll)
      subject,
      message,
      attachments, // nullable (JSON string)
      status, // open, in_progress, resolved, closed
      priority, // low, medium, high
      assigned_to, // nullable
      ip_address, // nullable
      user_agent, // nullable
    } = complaintData;

    // Generate unique ticket number
    let ticketNumber = await this.generateTicketNumber();
    let existing = await this.findByTicketNumber(ticketNumber);

    // Ensure unique ticket number
    while (existing) {
      ticketNumber = await this.generateTicketNumber();
      existing = await this.findByTicketNumber(ticketNumber);
    }

    const [result] = await pool.execute(
      `INSERT INTO complaints (
        ticket_number, name, email, phone, category, subject, message,
        attachments, status, priority, assigned_to, ip_address, user_agent,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        ticketNumber,
        name,
        email || null, // nullable
        phone || null, // nullable
        category || null, // nullable
        subject,
        message,
        attachments || null, // nullable
        status || "open",
        priority || "medium",
        assigned_to || null, // nullable
        ip_address || null, // nullable
        user_agent || null, // nullable
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, complaintData) {
    const {
      name,
      email, // nullable
      phone, // nullable
      category, // nullable
      subject,
      message,
      attachments, // nullable
      status,
      priority,
      assigned_to, // nullable
      resolved_by, // nullable
      resolution_note, // nullable
      resolved_at, // nullable
    } = complaintData;

    await pool.execute(
      `UPDATE complaints SET
        name = ?,
        email = ?,
        phone = ?,
        category = ?,
        subject = ?,
        message = ?,
        attachments = ?,
        status = ?,
        priority = ?,
        assigned_to = ?,
        resolved_by = ?,
        resolution_note = ?,
        resolved_at = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        name,
        email || null, // nullable
        phone || null, // nullable
        category || null, // nullable
        subject,
        message,
        attachments || null, // nullable
        status || "open",
        priority || "medium",
        assigned_to || null, // nullable
        resolved_by || null, // nullable
        resolution_note || null, // nullable
        resolved_at || null, // nullable
        id,
      ]
    );

    return this.findById(id);
  }

  // Update status only
  static async updateStatus(id, status, userId = null) {
    const updates = {
      status,
      updated_at: "NOW()",
    };

    if (status === "resolved" || status === "closed") {
      updates.resolved_by = userId;
      updates.resolved_at = "NOW()";
    }

    await pool.execute(
      `UPDATE complaints SET
        status = ?,
        ${
          status === "resolved" || status === "closed"
            ? "resolved_by = ?, resolved_at = NOW(),"
            : ""
        }
        updated_at = NOW()
      WHERE id = ?`,
      status === "resolved" || status === "closed"
        ? [status, userId, id]
        : [status, id]
    );

    return this.findById(id);
  }

  // Assign complaint to user
  static async assign(id, userId) {
    await pool.execute(
      "UPDATE complaints SET assigned_to = ?, status = 'in_progress', updated_at = NOW() WHERE id = ?",
      [userId, id]
    );
    return this.findById(id);
  }

  // Resolve complaint
  static async resolve(id, resolutionNote, userId) {
    await pool.execute(
      `UPDATE complaints SET
        status = 'resolved',
        resolved_by = ?,
        resolution_note = ?,
        resolved_at = NOW(),
        updated_at = NOW()
      WHERE id = ?`,
      [userId, resolutionNote, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM complaints WHERE id = ?", [id]);
  }

  // Get complaints by status
  static async getByStatus(status, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT c.*, 
              u_assigned.username as assigned_to_name
       FROM complaints c
       LEFT JOIN users u_assigned ON c.assigned_to = u_assigned.id
       WHERE c.status = ?
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [status, limit, offset]
    );
    return rows;
  }

  // Count by status
  static async countByStatus(status) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM complaints WHERE status = ?",
      [status]
    );
    return rows[0].total;
  }
}

export default Complaint;
