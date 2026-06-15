import { query } from '../db.js';

export async function listAll() {
  const { rows } = await query(
    `SELECT c.id, c.name, c.slug, c.description,
            COUNT(a.id) FILTER (WHERE a.status = 'published')::int AS article_count
       FROM categories c
       LEFT JOIN articles a ON a.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name`
  );
  return rows;
}

export async function getBySlug(slug) {
  const { rows } = await query(`SELECT * FROM categories WHERE slug = $1`, [slug]);
  return rows[0] || null;
}

export async function create({ name, slug, description }) {
  const { rows } = await query(
    `INSERT INTO categories (name, slug, description) VALUES ($1,$2,$3) RETURNING *`,
    [name, slug, description]
  );
  return rows[0];
}

export async function update(id, { name, slug, description }) {
  const { rows } = await query(
    `UPDATE categories SET name=$1, slug=$2, description=$3 WHERE id=$4 RETURNING *`,
    [name, slug, description, id]
  );
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await query(`DELETE FROM categories WHERE id = $1`, [id]);
  return rowCount > 0;
}
