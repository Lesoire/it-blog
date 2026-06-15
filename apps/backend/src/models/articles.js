import { query } from '../db.js';

// Поля статті для списків (анонси) — без важкого поля content
const LIST_FIELDS = `
  a.id, a.title, a.slug, a.excerpt, a.cover_url, a.views,
  a.published_at,
  c.name AS category_name, c.slug AS category_slug,
  u.name AS author_name, u.slug AS author_slug, u.avatar_url AS author_avatar
`;

const joinSql = `
  FROM articles a
  LEFT JOIN categories c ON c.id = a.category_id
  LEFT JOIN users u ON u.id = a.author_id
`;

// Зібрати теги для набору статей одним запитом
async function attachTags(articles) {
  if (articles.length === 0) return articles;
  const ids = articles.map((a) => a.id);
  const { rows } = await query(
    `SELECT at.article_id, t.name, t.slug
       FROM article_tags at
       JOIN tags t ON t.id = at.tag_id
      WHERE at.article_id = ANY($1)`,
    [ids]
  );
  const map = {};
  for (const r of rows) {
    (map[r.article_id] ||= []).push({ name: r.name, slug: r.slug });
  }
  for (const a of articles) a.tags = map[a.id] || [];
  return articles;
}

// Список опублікованих статей з пагінацією + фільтр за категорією
export async function listPublished({ page = 1, perPage = 10, categorySlug = null }) {
  const offset = (page - 1) * perPage;
  const params = [];
  let where = `WHERE a.status = 'published'`;
  if (categorySlug) {
    params.push(categorySlug);
    where += ` AND c.slug = $${params.length}`;
  }

  const countSql = `SELECT COUNT(*)::int AS total ${joinSql} ${where}`;
  const { rows: countRows } = await query(countSql, params);
  const total = countRows[0].total;

  params.push(perPage, offset);
  const listSql = `
    SELECT ${LIST_FIELDS} ${joinSql} ${where}
    ORDER BY a.published_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const { rows } = await query(listSql, params);
  await attachTags(rows);

  return {
    data: rows,
    meta: {
      total,
      page: Number(page),
      perPage: Number(perPage),
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    },
  };
}

// Одна стаття за slug (повний контент)
export async function getBySlug(slug) {
  const { rows } = await query(
    `SELECT a.*,
            c.name AS category_name, c.slug AS category_slug, c.description AS category_description,
            u.name AS author_name, u.slug AS author_slug, u.avatar_url AS author_avatar, u.bio AS author_bio
     ${joinSql}
     WHERE a.slug = $1 AND a.status = 'published'`,
    [slug]
  );
  if (rows.length === 0) return null;
  await attachTags(rows);
  return rows[0];
}

// Пов'язані статті (та сама категорія, окрім поточної)
export async function getRelated(slug, limit = 3) {
  const { rows } = await query(
    `SELECT ${LIST_FIELDS} ${joinSql}
       WHERE a.status = 'published'
         AND c.id = (SELECT category_id FROM articles WHERE slug = $1)
         AND a.slug <> $1
       ORDER BY a.published_at DESC
       LIMIT $2`,
    [slug, limit]
  );
  return attachTags(rows);
}

// Збільшити лічильник переглядів
export async function incrementViews(id) {
  await query(`UPDATE articles SET views = views + 1 WHERE id = $1`, [id]);
}

// Пошук за заголовком/текстом
export async function search(qstr, { page = 1, perPage = 10 } = {}) {
  const offset = (page - 1) * perPage;
  const like = `%${qstr}%`;
  const countSql = `
    SELECT COUNT(*)::int AS total ${joinSql}
    WHERE a.status = 'published' AND (a.title ILIKE $1 OR a.content ILIKE $1)`;
  const { rows: countRows } = await query(countSql, [like]);
  const total = countRows[0].total;

  const { rows } = await query(
    `SELECT ${LIST_FIELDS} ${joinSql}
       WHERE a.status = 'published' AND (a.title ILIKE $1 OR a.content ILIKE $1)
       ORDER BY a.published_at DESC
       LIMIT $2 OFFSET $3`,
    [like, perPage, offset]
  );
  await attachTags(rows);
  return {
    data: rows,
    meta: { total, page: Number(page), perPage: Number(perPage), totalPages: Math.max(1, Math.ceil(total / perPage)) },
  };
}

// Усі опубліковані slug + дата (для sitemap / rss)
export async function allPublishedForFeed() {
  const { rows } = await query(
    `SELECT a.slug, a.title, a.excerpt, a.published_at, a.updated_at,
            c.slug AS category_slug, u.name AS author_name
       FROM articles a
       LEFT JOIN categories c ON c.id = a.category_id
       LEFT JOIN users u ON u.id = a.author_id
      WHERE a.status = 'published'
      ORDER BY a.published_at DESC`
  );
  return rows;
}

// ---------- Адмін: повний CRUD ----------

export async function adminList() {
  const { rows } = await query(
    `SELECT a.id, a.title, a.slug, a.status, a.views, a.published_at, a.updated_at,
            c.name AS category_name, u.name AS author_name
       FROM articles a
       LEFT JOIN categories c ON c.id = a.category_id
       LEFT JOIN users u ON u.id = a.author_id
      ORDER BY a.updated_at DESC`
  );
  return rows;
}

export async function adminGetById(id) {
  const { rows } = await query(`SELECT * FROM articles WHERE id = $1`, [id]);
  if (rows.length === 0) return null;
  const art = rows[0];
  const { rows: tagRows } = await query(
    `SELECT t.id, t.name, t.slug FROM article_tags at JOIN tags t ON t.id = at.tag_id WHERE at.article_id = $1`,
    [id]
  );
  art.tags = tagRows;
  return art;
}

export async function create(data) {
  const {
    title, slug, excerpt, content, cover_url,
    author_id, category_id, status = 'draft',
    meta_title, meta_description, tagIds = [],
  } = data;
  const published_at = status === 'published' ? new Date() : null;
  const { rows } = await query(
    `INSERT INTO articles
       (title, slug, excerpt, content, cover_url, author_id, category_id, status, meta_title, meta_description, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [title, slug, excerpt, content, cover_url, author_id, category_id, status, meta_title, meta_description, published_at]
  );
  const article = rows[0];
  await setTags(article.id, tagIds);
  return article;
}

export async function update(id, data) {
  const existing = await adminGetById(id);
  if (!existing) return null;
  const {
    title = existing.title,
    slug = existing.slug,
    excerpt = existing.excerpt,
    content = existing.content,
    cover_url = existing.cover_url,
    author_id = existing.author_id,
    category_id = existing.category_id,
    status = existing.status,
    meta_title = existing.meta_title,
    meta_description = existing.meta_description,
    tagIds = null,
  } = data;
  // якщо публікуємо вперше — фіксуємо дату публікації
  let published_at = existing.published_at;
  if (status === 'published' && !existing.published_at) published_at = new Date();

  const { rows } = await query(
    `UPDATE articles SET
       title=$1, slug=$2, excerpt=$3, content=$4, cover_url=$5, author_id=$6,
       category_id=$7, status=$8, meta_title=$9, meta_description=$10,
       published_at=$11, updated_at=NOW()
     WHERE id=$12 RETURNING *`,
    [title, slug, excerpt, content, cover_url, author_id, category_id, status, meta_title, meta_description, published_at, id]
  );
  if (tagIds !== null) await setTags(id, tagIds);
  return rows[0];
}

export async function remove(id) {
  const { rowCount } = await query(`DELETE FROM articles WHERE id = $1`, [id]);
  return rowCount > 0;
}

async function setTags(articleId, tagIds) {
  await query(`DELETE FROM article_tags WHERE article_id = $1`, [articleId]);
  for (const tagId of tagIds) {
    await query(
      `INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [articleId, tagId]
    );
  }
}
