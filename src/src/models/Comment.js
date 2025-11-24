import pool from "../config/database.js";

class Comment {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `
      SELECT c.*, 
             u.username as user_name, u.email as user_email,
             p.title as post_title
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN posts p ON c.post_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.post_id) {
      query += " AND c.post_id = ?";
      params.push(filters.post_id);
    }

    if (filters.status) {
      query += " AND c.status = ?";
      params.push(filters.status);
    }

    if (filters.parent_id !== undefined) {
      query += " AND c.parent_id = ?";
      params.push(filters.parent_id);
    }

    query += " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, 
              u.username as user_name, u.email as user_email,
              p.title as post_title
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN posts p ON c.post_id = p.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM comments WHERE 1=1";
    const params = [];

    if (filters.post_id) {
      query += " AND post_id = ?";
      params.push(filters.post_id);
    }

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(commentData) {
    const {
      post_id,
      parent_id, // nullable (for replies)
      user_id, // nullable (registered user)
      author_name, // nullable (guest name)
      author_email, // nullable (guest email)
      content,
      status, // pending, approved, spam
      ip_address, // nullable
      user_agent, // nullable
    } = commentData;

    const [result] = await pool.execute(
      `INSERT INTO comments (
        post_id, parent_id, user_id, author_name, author_email, content,
        status, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        post_id,
        parent_id || null, // nullable
        user_id || null, // nullable
        author_name || null, // nullable
        author_email || null, // nullable
        content,
        status || "pending",
        ip_address || null, // nullable
        user_agent || null, // nullable
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, commentData) {
    const {
      content,
      status,
      author_name, // nullable
      author_email, // nullable
    } = commentData;

    await pool.execute(
      `UPDATE comments SET
        content = ?,
        status = ?,
        author_name = ?,
        author_email = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        content,
        status || "pending",
        author_name || null, // nullable
        author_email || null, // nullable
        id,
      ]
    );

    return this.findById(id);
  }

  static async updateStatus(id, status) {
    await pool.execute(
      "UPDATE comments SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM comments WHERE id = ?", [id]);
  }

  // Get comments by post
  static async findByPostId(postId, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT c.*, 
              u.username as user_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ? AND c.status = 'approved' AND c.parent_id IS NULL
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [postId, limit, offset]
    );
    return rows;
  }

  // Get replies (child comments)
  static async findReplies(parentId) {
    const [rows] = await pool.execute(
      `SELECT c.*, 
              u.username as user_name
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.parent_id = ? AND c.status = 'approved'
       ORDER BY c.created_at ASC`,
      [parentId]
    );
    return rows;
  }

  // Count comments by status
  static async countByStatus(status) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM comments WHERE status = ?",
      [status]
    );
    return rows[0].total;
  }
}

export default Comment;
