import pool from "../config/database.js";

class ComplaintResponse {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `
      SELECT cr.*, 
             u.username as responder_name,
             c.ticket_number, c.subject as complaint_subject
      FROM complaint_responses cr
      LEFT JOIN users u ON cr.user_id = u.id
      LEFT JOIN complaints c ON cr.complaint_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.complaint_id) {
      query += " AND cr.complaint_id = ?";
      params.push(filters.complaint_id);
    }

    if (filters.user_id) {
      query += " AND cr.user_id = ?";
      params.push(filters.user_id);
    }

    if (filters.is_internal !== undefined) {
      query += " AND cr.is_internal = ?";
      params.push(filters.is_internal);
    }

    query += " ORDER BY cr.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT cr.*, 
              u.username as responder_name,
              c.ticket_number, c.subject as complaint_subject
       FROM complaint_responses cr
       LEFT JOIN users u ON cr.user_id = u.id
       LEFT JOIN complaints c ON cr.complaint_id = c.id
       WHERE cr.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByComplaintId(complaintId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT cr.*, 
              u.username as responder_name
       FROM complaint_responses cr
       LEFT JOIN users u ON cr.user_id = u.id
       WHERE cr.complaint_id = ?
       ORDER BY cr.created_at ASC
       LIMIT ? OFFSET ?`,
      [complaintId, limit, offset]
    );
    return rows;
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM complaint_responses WHERE 1=1";
    const params = [];

    if (filters.complaint_id) {
      query += " AND complaint_id = ?";
      params.push(filters.complaint_id);
    }

    if (filters.user_id) {
      query += " AND user_id = ?";
      params.push(filters.user_id);
    }

    if (filters.is_internal !== undefined) {
      query += " AND is_internal = ?";
      params.push(filters.is_internal);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(responseData) {
    const { complaint_id, user_id, message, is_internal, attachments } =
      responseData;

    const [result] = await pool.execute(
      `INSERT INTO complaint_responses (
        complaint_id, user_id, message, is_internal, attachments, created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        complaint_id,
        user_id,
        message,
        is_internal !== undefined ? is_internal : 0,
        attachments || null,
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, responseData) {
    const { message, is_internal, attachments } = responseData;

    await pool.execute(
      `UPDATE complaint_responses SET
        message = ?,
        is_internal = ?,
        attachments = ?
      WHERE id = ?`,
      [
        message,
        is_internal !== undefined ? is_internal : 0,
        attachments || null,
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM complaint_responses WHERE id = ?", [id]);
  }

  static async countByComplaint(complaintId) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM complaint_responses WHERE complaint_id = ?",
      [complaintId]
    );
    return rows[0].total;
  }

  static async getPublicResponses(complaintId) {
    const [rows] = await pool.execute(
      `SELECT cr.*, 
              u.username as responder_name
       FROM complaint_responses cr
       LEFT JOIN users u ON cr.user_id = u.id
       WHERE cr.complaint_id = ? AND cr.is_internal = 0
       ORDER BY cr.created_at ASC`,
      [complaintId]
    );
    return rows;
  }

  static async getInternalNotes(complaintId) {
    const [rows] = await pool.execute(
      `SELECT cr.*, 
              u.username as responder_name
       FROM complaint_responses cr
       LEFT JOIN users u ON cr.user_id = u.id
       WHERE cr.complaint_id = ? AND cr.is_internal = 1
       ORDER BY cr.created_at ASC`,
      [complaintId]
    );
    return rows;
  }
}

export default ComplaintResponse;
