import { Router } from 'express';
import * as articles from '../controllers/articles.js';
import * as pub from '../controllers/public.js';

const router = Router();

// Статті
router.get('/articles', articles.list);
router.get('/articles/:slug', articles.getOne);
router.get('/articles/:slug/related', articles.related);
router.post('/articles/:id/view', articles.view);

// Категорії
router.get('/categories', pub.listCategories);
router.get('/categories/:slug/articles', pub.categoryArticles);

// Теги
router.get('/tags', pub.listTags);
router.get('/tags/:slug/articles', pub.tagArticles);

// Автори
router.get('/authors', pub.listAuthors);
router.get('/authors/:slug', pub.getAuthor);
router.get('/authors/:slug/articles', pub.authorArticles);

// Пошук
router.get('/search', pub.search);

export default router;
