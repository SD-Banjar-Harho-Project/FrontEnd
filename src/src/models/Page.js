import pool from "../config/database.js";

class Page {
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
    let query = "SELECT COUNT(*) as count FROM pages WHERE slug = ?";
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
    let query = "SELECT * FROM pages WHERE 1=1";
    const params = [];

    if (filters.is_active !== undefined) {
      query += " AND is_active = ?";
      params.push(filters.is_active);
    }

    if (filters.show_in_menu !== undefined) {
      query += " AND show_in_menu = ?";
      params.push(filters.show_in_menu);
    }

    if (filters.search) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += " ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM pages WHERE id = ?", [id]);
    return rows[0];
  }

  static async findBySlug(slug) {
    const [rows] = await pool.execute(
      "SELECT * FROM pages WHERE slug = ? AND is_active = 1",
      [slug]
    );
    return rows[0];
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM pages WHERE 1=1";
    const params = [];

    if (filters.is_active !== undefined) {
      query += " AND is_active = ?";
      params.push(filters.is_active);
    }

    if (filters.show_in_menu !== undefined) {
      query += " AND show_in_menu = ?";
      params.push(filters.show_in_menu);
    }

    if (filters.search) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async create(pageData) {
    const {
      title,
      slug,
      content, // nullable
      page_template, // nullable
      parent_id, // nullable
      display_order,
      meta_title, // nullable
      meta_description, // nullable
      meta_keywords, // nullable
      is_active,
      show_in_menu,
    } = pageData;

    // Generate slug if not provided
    const finalSlug = slug || (await this.generateUniqueSlug(title));

    const [result] = await pool.execute(
      `INSERT INTO pages (
        title, slug, content, page_template, parent_id, display_order,
        meta_title, meta_description, meta_keywords, is_active, show_in_menu,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        finalSlug,
        content || null, // nullable
        page_template || null, // nullable
        parent_id || null, // nullable
        display_order || 0,
        meta_title || null, // nullable
        meta_description || null, // nullable
        meta_keywords || null, // nullable
        is_active !== undefined ? is_active : 1,
        show_in_menu !== undefined ? show_in_menu : 0,
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, pageData) {
    const {
      title,
      slug,
      content, // nullable
      page_template, // nullable
      parent_id, // nullable
      display_order,
      meta_title, // nullable
      meta_description, // nullable
      meta_keywords, // nullable
      is_active,
      show_in_menu,
    } = pageData;

    // Generate slug if not provided, but avoid duplicates
    const finalSlug = slug || (await this.generateUniqueSlug(title, id));

    await pool.execute(
      `UPDATE pages SET
        title = ?,
        slug = ?,
        content = ?,
        page_template = ?,
        parent_id = ?,
        display_order = ?,
        meta_title = ?,
        meta_description = ?,
        meta_keywords = ?,
        is_active = ?,
        show_in_menu = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
        title,
        finalSlug,
        content || null, // nullable
        page_template || null, // nullable
        parent_id || null, // nullable
        display_order || 0,
        meta_title || null, // nullable
        meta_description || null, // nullable
        meta_keywords || null, // nullable
        is_active !== undefined ? is_active : 1,
        show_in_menu !== undefined ? show_in_menu : 0,
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute("DELETE FROM pages WHERE id = ?", [id]);
  }
}

export default Page;
