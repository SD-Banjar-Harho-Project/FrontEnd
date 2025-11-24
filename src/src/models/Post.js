import pool from "../config/database.js";

class Post {
  static async findAll(limit = 10, offset = 0, filters = {}) {
    let query = `
      SELECT p.*, 
             c.name as category_name, c.slug as category_slug,
             u.full_name as author_name, u.username as author_username,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 'approved') as comments_count
      FROM posts p
      LEFT JOIN content_categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.deleted_at IS NULL
    `;

    const params = [];

    if (filters.status) {
      query += " AND p.status = ?";
      params.push(filters.status);
    }

    if (filters.post_type) {
      query += " AND p.post_type = ?";
      params.push(filters.post_type);
    }

    if (filters.category_id) {
      query += " AND p.category_id = ?";
      params.push(filters.category_id);
    }

    if (filters.is_featured !== undefined) {
      query += " AND p.is_featured = ?";
      params.push(filters.is_featured);
    }

    query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async count(filters = {}) {
    let query = "SELECT COUNT(*) as total FROM posts WHERE deleted_at IS NULL";
    const params = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    if (filters.post_type) {
      query += " AND post_type = ?";
      params.push(filters.post_type);
    }

    if (filters.category_id) {
      query += " AND category_id = ?";
      params.push(filters.category_id);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].total;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, 
              c.name as category_name, c.slug as category_slug,
              u.full_name as author_name, u.username as author_username
       FROM posts p
       LEFT JOIN content_categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = ? AND p.deleted_at IS NULL`,
      [id]
    );
    return rows[0];
  }

  static async findBySlug(slug) {
    const [rows] = await pool.execute(
      `SELECT p.*, 
              c.name as category_name, c.slug as category_slug,
              u.full_name as author_name, u.username as author_username
       FROM posts p
       LEFT JOIN content_categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.slug = ? AND p.deleted_at IS NULL`,
      [slug]
    );
    return rows[0];
  }

  static async findBySlugExcludingId(slug, id) {
    const [rows] = await pool.execute(
      "SELECT * FROM posts WHERE slug = ? AND id != ? AND deleted_at IS NULL",
      [slug, id]
    );
    return rows[0];
  }

  static async create(postData) {
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      post_type,
      category_id,
      author_id,
      status,
      meta_title,
      meta_description,
      meta_keywords,
      is_featured,
      allow_comments,
      published_at,
    } = postData;

    const [result] = await pool.execute(
      `INSERT INTO posts (title, slug, excerpt, content, featured_image, post_type, category_id, author_id, 
       status, meta_title, meta_description, meta_keywords, is_featured, allow_comments, published_at, 
       views_count, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      [
        title,
        slug,
        excerpt,
        content,
        featured_image,
        post_type,
        category_id,
        author_id,
        status,
        meta_title,
        meta_description,
        meta_keywords,
        is_featured,
        allow_comments,
        published_at,
      ]
    );

    return this.findById(result.insertId);
  }

  static async update(id, postData) {
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      post_type,
      category_id,
      status,
      meta_title,
      meta_description,
      meta_keywords,
      is_featured,
      allow_comments,
    } = postData;

    await pool.execute(
      `UPDATE posts SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, 
       post_type = ?, category_id = ?, status = ?, meta_title = ?, meta_description = ?, 
       meta_keywords = ?, is_featured = ?, allow_comments = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        slug,
        excerpt,
        content,
        featured_image,
        post_type,
        category_id,
        status,
        meta_title,
        meta_description,
        meta_keywords,
        is_featured,
        allow_comments,
        id,
      ]
    );

    return this.findById(id);
  }

  static async incrementViews(id) {
    await pool.execute(
      "UPDATE posts SET views_count = views_count + 1 WHERE id = ?",
      [id]
    );
  }

  static async delete(id) {
    await pool.execute("UPDATE posts SET deleted_at = NOW() WHERE id = ?", [
      id,
    ]);
  }

  static async hardDelete(id) {
    await pool.execute("DELETE FROM posts WHERE id = ?", [id]);
  }

  // Get deleted posts only (for recycle bin)
  static async findDeleted(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT p.*, 
       c.name as category_name, 
       u.full_name as author_name
       FROM posts p
       LEFT JOIN content_categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.deleted_at IS NOT NULL
       ORDER BY p.deleted_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  // Count deleted posts
  static async countDeleted() {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as total FROM posts WHERE deleted_at IS NOT NULL"
    );
    return rows[0].total;
  }

  // Restore soft-deleted post
  static async restore(id) {
    // Check if post exists and is deleted
    const [posts] = await pool.execute(
      "SELECT * FROM posts WHERE id = ? AND deleted_at IS NOT NULL",
      [id]
    );

    if (posts.length === 0) {
      return null;
    }

    await pool.execute(
      "UPDATE posts SET deleted_at = NULL, updated_at = NOW() WHERE id = ?",
      [id]
    );

    return this.findById(id);
  }

  static async getWithTags(id) {
    const post = await this.findById(id);
    if (!post) return null;

    const [tags] = await pool.execute(
      `SELECT t.* FROM post_tags t
       INNER JOIN post_tag_relations ptr ON t.id = ptr.tag_id
       WHERE ptr.post_id = ?`,
      [id]
    );

    post.tags = tags;
    return post;
  }

  static async attachTags(postId, tagIds) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.execute(
        "DELETE FROM post_tag_relations WHERE post_id = ?",
        [postId]
      );

      if (tagIds && tagIds.length > 0) {
        const values = tagIds.map((tagId) => [postId, tagId]);
        await connection.query(
          "INSERT INTO post_tag_relations (post_id, tag_id) VALUES ?",
          [values]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Post;
