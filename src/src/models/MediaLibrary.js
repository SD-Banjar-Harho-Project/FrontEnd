import pool from "../config/database.js";

class MediaLibrary {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `SELECT m.*, u.username as uploader_name
                 FROM media_library m
                 LEFT JOIN users u ON m.uploaded_by = u.id
                 WHERE 1=1`;
    const params = [];

    if (filters.file_type) {
      query += " AND m.file_type = ?";
      params.push(filters.file_type);
    }

    if (filters.mime_type) {
      query += " AND m.mime_type LIKE ?";
      params.push(`%${filters.mime_type}%`);
    }

    if (filters.search) {
      query +=
        " AND (m.file_name LIKE ? OR m.alt_text LIKE ? OR m.caption LIKE ?)";
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    query += " ORDER BY m.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT m.*, u.username as uploader_name
       FROM media_library m
       LEFT JOIN users u ON m.uploaded_by = u.id
       WHERE m.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByPath(filePath) {
    const [rows] = await pool.execute(
      "SELECT * FROM media_library WHERE file_path = ?",
      [filePath]
    );
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM media_library WHERE 1=1";
    const params = [];

    if (filters.file_type) {
      query += " AND file_type = ?";
      params.push(filters.file_type);
    }

    if (filters.mime_type) {
      query += " AND mime_type LIKE ?";
      params.push(`%${filters.mime_type}%`);
    }

    if (filters.search) {
      query += " AND (file_name LIKE ? OR alt_text LIKE ? OR caption LIKE ?)";
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(mediaData) {
    const {
      file_name,
      file_path,
      file_type, // nullable (image, video, document, audio)
      mime_type, // nullable
      file_size, // nullable (in bytes)
      alt_text, // nullable
      caption, // nullable
      width, // nullable (for images)
      height, // nullable (for images)
      duration, // nullable (for videos/audio)
      uploaded_by,
      used_count,
    } = mediaData;

    const [result] = await pool.execute(
      `INSERT INTO media_library (
        file_name, file_path, file_type, mime_type, file_size, alt_text, caption,
        width, height, duration, uploaded_by, used_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        file_name,
        file_path,
        file_type || null, // nullable
        mime_type || null, // nullable
        file_size || null, // nullable
        alt_text || null, // nullable
        caption || null, // nullable
        width || null, // nullable
        height || null, // nullable
        duration || null, // nullable
        uploaded_by,
        used_count || 0,
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, mediaData) {
    const {
      file_name,
      alt_text, // nullable
      caption, // nullable
      used_count,
    } = mediaData;

    await pool.execute(
      `UPDATE media_library SET
        file_name = ?,
        alt_text = ?,
        caption = ?,
        used_count = ?
      WHERE id = ?`,
      [
        file_name,
        alt_text || null, // nullable
        caption || null, // nullable
        used_count || 0,
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM media_library WHERE id = ?", [id]);
  }

  // Increment used count
  static async incrementUsedCount(id) {
    await pool.execute(
      "UPDATE media_library SET used_count = used_count + 1 WHERE id = ?",
      [id]
    );
  }

  // Decrement used count
  static async decrementUsedCount(id) {
    await pool.execute(
      "UPDATE media_library SET used_count = GREATEST(used_count - 1, 0) WHERE id = ?",
      [id]
    );
  }

  // Get by file type
  static async getByType(fileType, limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT m.*, u.username as uploader_name
       FROM media_library m
       LEFT JOIN users u ON m.uploaded_by = u.id
       WHERE m.file_type = ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [fileType, limit, offset]
    );
    return rows;
  }
}

export default MediaLibrary;
