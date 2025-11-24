import pool from "../config/database.js";

class Teacher {
  static async findAll(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT t.*, u.username, u.email as user_email
       FROM teachers t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.is_active = 1
       ORDER BY t.display_order ASC, t.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT t.*, u.username, u.email as user_email
       FROM teachers t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByNip(nip) {
    const [rows] = await pool.execute("SELECT * FROM teachers WHERE nip = ?", [
      nip,
    ]);
    return rows[0];
  }

  static async count() {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM teachers WHERE is_active = 1"
    );
    return rows[0].total;
  }

  static async create(teacherData) {
    const {
      user_id,
      nip,
      full_name,
      position,
      subject,
      class_name,
      education_level,
      email,
      phone,
      photo,
      bio,
      join_date,
      is_active,
      display_order,
    } = teacherData;

    const [result] = await pool.execute(
      `INSERT INTO teachers (
        user_id, nip, full_name, position, subject, class_name, 
        education_level, email, phone, photo, bio, join_date, 
        is_active, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        user_id || null,
        nip || null,
        full_name,
        position || null,
        subject || null,
        class_name || null,
        education_level || null,
        email || null,
        phone || null,
        photo || null,
        bio || null,
        join_date || null,
        is_active !== undefined ? is_active : 1,
        display_order || 0,
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, teacherData) {
    const {
      user_id,
      nip,
      full_name,
      position,
      subject,
      class_name,
      education_level,
      email,
      phone,
      photo,
      bio,
      join_date,
      is_active,
      display_order,
    } = teacherData;

    await pool.execute(
      `UPDATE teachers SET
        user_id = ?,
        nip = ?,
        full_name = ?,
        position = ?,
        subject = ?,
        class_name = ?,
        education_level = ?,
        email = ?,
        phone = ?,
        photo = ?,
        bio = ?,
        join_date = ?,
        is_active = ?,
        display_order = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        user_id || null,
        nip || null,
        full_name,
        position || null,
        subject || null,
        class_name || null,
        education_level || null,
        email || null,
        phone || null,
        photo || null,
        bio || null,
        join_date || null,
        is_active !== undefined ? is_active : 1,
        display_order || 0,
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    // Soft delete - set deleted_at timestamp
    await pool.execute(
      "UPDATE teachers SET is_active = 0, deleted_at = NOW(), updated_at = NOW() WHERE id = ?",
      [id]
    );
  }

  // Get deleted teachers
  // Get deleted teachers
  static async findDeleted(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT t.*, u.username, u.email as user_email
     FROM teachers t
     LEFT JOIN users u ON t.user_id = u.id
     WHERE t.deleted_at IS NOT NULL
     ORDER BY t.deleted_at DESC
     LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  // Count deleted teachers
  static async countDeleted() {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM teachers WHERE deleted_at IS NOT NULL"
    );
    return rows[0].total;
  }

  // Restore deleted teacher
  static async restore(id) {
    const [teachers] = await pool.execute(
      "SELECT * FROM teachers WHERE id = ? AND deleted_at IS NOT NULL",
      [id]
    );

    if (teachers.length === 0) {
      return null;
    }

    await pool.execute(
      "UPDATE teachers SET is_active = 1, deleted_at = NULL, updated_at = NOW() WHERE id = ?",
      [id]
    );

    return this.findById(id);
  }
}

export default Teacher;
