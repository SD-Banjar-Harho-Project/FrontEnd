import pool from '../config/database.js';

class MenuItem {
  static async findAll(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      'SELECT * FROM menu_items ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async count() {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM menu_items'
    );
    return rows[0].total;
  }

  static async create(data) {
    const fields = Object.keys(data);
    const values = Object.values(data).map(v => v || null);
    const placeholders = fields.map(() => '?').join(', ');
    
    const [result] = await pool.execute(
      `INSERT INTO menu_items (${fields.join(', ')}, created_at, updated_at) 
       VALUES (${placeholders}, NOW(), NOW())`,
      values
    );

    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data).map(v => v || null);
    const setClause = fields.map(f => `${f} = ?`).join(', ');

    await pool.execute(
      `UPDATE menu_items SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  }
}

export default MenuItem;
