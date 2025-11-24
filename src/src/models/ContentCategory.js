import pool from '../config/database.js';

class ContentCategory {
  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT c.*, pc.name as parent_name
       FROM content_categories c
       LEFT JOIN content_categories pc ON c.parent_id = pc.id
       WHERE c.is_active = 1
       ORDER BY c.display_order, c.name`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT c.*, pc.name as parent_name
       FROM content_categories c
       LEFT JOIN content_categories pc ON c.parent_id = pc.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findBySlug(slug) {
    const [rows] = await pool.execute(
      'SELECT * FROM content_categories WHERE slug = ?',
      [slug]
    );
    return rows[0];
  }

  static async findBySlugExcludingId(slug, id) {
    const [rows] = await pool.execute(
      'SELECT * FROM content_categories WHERE slug = ? AND id != ?',
      [slug, id]
    );
    return rows[0];
  }

  static async create(categoryData) {
    const { name, slug, description, parent_id, icon, color, display_order, is_active } = categoryData;

    const [result] = await pool.execute(
      `INSERT INTO content_categories (name, slug, description, parent_id, icon, color, display_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, slug, description, parent_id, icon, color, display_order, is_active]
    );

    return this.findById(result.insertId);
  }

  static async update(id, categoryData) {
    const { name, slug, description, parent_id, icon, color, display_order, is_active } = categoryData;

    await pool.execute(
      `UPDATE content_categories SET name = ?, slug = ?, description = ?, parent_id = ?, 
       icon = ?, color = ?, display_order = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, slug, description, parent_id, icon, color, display_order, is_active, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM content_categories WHERE id = ?', [id]);
  }

  static async getTree() {
    const [categories] = await pool.execute(
      'SELECT * FROM content_categories WHERE is_active = 1 ORDER BY display_order, name'
    );

    const categoryMap = {};
    const tree = [];

    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parent_id) {
        if (categoryMap[cat.parent_id]) {
          categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
        }
      } else {
        tree.push(categoryMap[cat.id]);
      }
    });

    return tree;
  }
}

export default ContentCategory;
