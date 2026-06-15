import { query } from '../db.js';

export async function listAll() {
  const { rows } = await query(
    `SELECT t.id, t.name, t.slug,
            COUNT(at.article_id)::int AS article_count
       FROM tags t
       LEFT JOIN article_tags at ON at.tag_id = t.id
      GROUP BY t.id
      ORDER BY t.name`
  );
  return rows;
}

export async function getBySlug(slug) {
  const { rows } = await query(`SELECT * FROM tags WHERE slug = $1`, [slug]);
  return rows[0] || null;
}

export async function create({ name, slug }) {
  const { rows } = await query(
    `INSERT INTO tags (name, slug) VALUES ($1,$2) RETURNING *`,
    [name, slug]
  );
  return rows[0];
}

export async function remove(id) {
  const { rowCount } = await query(`DELETE FROM tags WHERE id = $1`, [id]);
  return rowCount > 0;
}
