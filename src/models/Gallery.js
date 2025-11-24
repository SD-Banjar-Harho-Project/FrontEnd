import pool from "../config/database.js";

class Gallery {
  // Helper function to generate slug from title
  static generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
  }

  // Check if slug exists
  static async slugExists(slug, excludeId = null) {
    let query = "SELECT COUNT(*) as count FROM galleries WHERE slug = ?";
    const params = [slug];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].count > 0;
  }

  // Generate unique slug
  static async generateUniqueSlug(title, excludeId = null) {
    let slug = this.generateSlug(title);
    let counter = 1;
    let uniqueSlug = slug;

    while (await this.slugExists(uniqueSlug, excludeId)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `SELECT g.*, u.username as author_name
       FROM galleries g
       LEFT JOIN users u ON g.author_id = u.id
       WHERE 1=1`;
    const params = [];

    if (filters.gallery_type) {
      query += " AND g.gallery_type = ?";
      params.push(filters.gallery_type);
    }

    if (filters.status) {
      query += " AND g.status = ?";
      params.push(filters.status);
    }

    if (filters.is_featured !== undefined) {
      query += " AND g.is_featured = ?";
      params.push(filters.is_featured);
    }

    if (filters.search) {
      query += " AND (g.title LIKE ? OR g.description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query +=
      " ORDER BY g.display_order ASC, g.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT g.*, u.username as author_name
       FROM galleries g
       LEFT JOIN users u ON g.author_id = u.id
       WHERE g.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findBySlug(slug) {
    const [rows] = await pool.execute(
      `SELECT g.*, u.username as author_name
       FROM galleries g
       LEFT JOIN users u ON g.author_id = u.id
       WHERE g.slug = ? AND g.status = 'published'`,
      [slug]
    );
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM galleries WHERE 1=1";
    const params = [];

    if (filters.gallery_type) {
      query += " AND gallery_type = ?";
      params.push(filters.gallery_type);
    }

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    if (filters.is_featured !== undefined) {
      query += " AND is_featured = ?";
      params.push(filters.is_featured);
    }

    if (filters.search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(galleryData) {
    const {
      title,
      slug,
      description, // nullable
      cover_image, // nullable
      gallery_type, // nullable
      event_date, // nullable
      author_id,
      views_count,
      is_featured,
      display_order,
      status,
    } = galleryData;

    // Generate slug if not provided
    const finalSlug = slug || (await this.generateUniqueSlug(title));

    const [result] = await pool.execute(
      `INSERT INTO galleries (
        title, slug, description, cover_image, gallery_type, event_date, author_id,
        views_count, is_featured, display_order, status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        finalSlug,
        description || null, // nullable
        cover_image || null, // nullable
        gallery_type || null, // nullable
        event_date || null, // nullable
        author_id,
        views_count || 0,
        is_featured !== undefined ? is_featured : 0,
        display_order || 0,
        status || "draft",
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, galleryData) {
    const {
      title,
      slug,
      description, // nullable
      cover_image, // nullable
      gallery_type, // nullable
      event_date, // nullable
      views_count,
      is_featured,
      display_order,
      status,
    } = galleryData;

    // Generate slug if not provided
    const finalSlug = slug || (await this.generateUniqueSlug(title, id));

    await pool.execute(
      `UPDATE galleries SET
        title = ?,
        slug = ?,
        description = ?,
        cover_image = ?,
        gallery_type = ?,
        event_date = ?,
        views_count = ?,
        is_featured = ?,
        display_order = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        title,
        finalSlug,
        description || null, // nullable
        cover_image || null, // nullable
        gallery_type || null, // nullable
        event_date || null, // nullable
        views_count || 0,
        is_featured !== undefined ? is_featured : 0,
        display_order || 0,
        status || "draft",
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    // Soft delete - set deleted_at
    await pool.execute(
      "UPDATE galleries SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?",
      [id]
    );
  }

  // Increment views
  static async incrementViews(id) {
    await pool.execute(
      "UPDATE galleries SET views_count = views_count + 1 WHERE id = ?",
      [id]
    );
  }

  // Get deleted galleries
  static async findDeleted(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT g.*, u.username as author_name
       FROM galleries g
       LEFT JOIN users u ON g.author_id = u.id
       WHERE g.deleted_at IS NOT NULL
       ORDER BY g.deleted_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  // Count deleted galleries
  static async countDeleted() {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM galleries WHERE deleted_at IS NOT NULL"
    );
    return rows[0].total;
  }

  // Restore deleted gallery
  static async restore(id) {
    const [galleries] = await pool.execute(
      "SELECT * FROM galleries WHERE id = ? AND deleted_at IS NOT NULL",
      [id]
    );

    if (galleries.length === 0) {
      return null;
    }

    await pool.execute(
      "UPDATE galleries SET deleted_at = NULL, updated_at = NOW() WHERE id = ?",
      [id]
    );

    return this.findById(id);
  }
}

export default Gallery;
