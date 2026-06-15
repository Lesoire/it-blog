import { query } from '../db.js';

export async function getByEmail(email) {
  const { rows } = await query(`SELECT * FROM users WHERE email = $1`, [email]);
  return rows[0] || null;
}

export async function getById(id) {
  const { rows } = await query(`SELECT id, name, slug, email, bio, avatar_url, is_admin FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
}

// Профіль автора за slug (без пароля)
export async function getBySlug(slug) {
  const { rows } = await query(
    `SELECT id, name, slug, bio, avatar_url FROM users WHERE slug = $1`,
    [slug]
  );
  return rows[0] || null;
}

export async function listAuthors() {
  const { rows } = await query(
    `SELECT u.id, u.name, u.slug, u.avatar_url,
            COUNT(a.id) FILTER (WHERE a.status = 'published')::int AS article_count
       FROM users u
       LEFT JOIN articles a ON a.author_id = u.id
      GROUP BY u.id
      ORDER BY u.name`
  );
  return rows;
}
