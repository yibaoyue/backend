const pool = require('../server/db');

class FileModel {
  static async createPointCloud(name, path, metadata = {}) {
    const query = `
      INSERT INTO point_clouds (name, path, metadata)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [name, path, metadata];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllPointClouds() {
    const query = 'SELECT * FROM point_clouds ORDER BY uploaded_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getPointCloudById(id) {
    const query = 'SELECT * FROM point_clouds WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async deletePointCloud(id) {
    const query = 'DELETE FROM point_clouds WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = FileModel;