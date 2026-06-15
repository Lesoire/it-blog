import { Router } from 'express';
import * as admin from '../controllers/admin.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { fail } from '../middleware/error.js';

const router = Router();

// Усі маршрути адмінки потребують JWT
router.use(requireAuth);

// Статті
router.get('/articles', admin.listArticles);
router.get('/articles/:id', admin.getArticle);
router.post('/articles', admin.createArticle);
router.put('/articles/:id', admin.updateArticle);
router.delete('/articles/:id', admin.deleteArticle);

// Категорії
router.get('/categories', admin.listCategories);
router.post('/categories', admin.createCategory);
router.put('/categories/:id', admin.updateCategory);
router.delete('/categories/:id', admin.deleteCategory);

// Теги
router.get('/tags', admin.listTags);
router.post('/tags', admin.createTag);
router.delete('/tags/:id', admin.deleteTag);

// Автори
router.get('/authors', admin.listAuthors);

// Завантаження зображень
router.post('/upload', (req, res) => {
  uploadMiddleware(req, res, (err) => {
    if (err) return fail(res, 400, 'UPLOAD_ERROR', err.message);
    admin.upload(req, res);
  });
});

export default router;
