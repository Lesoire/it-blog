import bcrypt from 'bcryptjs';
import * as Users from '../models/users.js';
import { signToken } from '../middleware/auth.js';
import { ok, fail, asyncH } from '../middleware/error.js';

// POST /api/auth/login  { email, password }
export const login = asyncH(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return fail(res, 400, 'BAD_REQUEST', 'Вкажіть email та пароль');
  }
  const user = await Users.getByEmail(email);
  if (!user) return fail(res, 401, 'INVALID_CREDENTIALS', 'Невірний email або пароль');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return fail(res, 401, 'INVALID_CREDENTIALS', 'Невірний email або пароль');

  const token = signToken({ id: user.id, name: user.name, is_admin: user.is_admin });
  ok(res, {
    token,
    user: { id: user.id, name: user.name, slug: user.slug, email: user.email, is_admin: user.is_admin },
  });
});

// POST /api/auth/logout — для JWT logout робиться на клієнті (видалення токена)
export const logout = asyncH(async (req, res) => {
  ok(res, { message: 'Вихід виконано. Видаліть токен на клієнті.' });
});

// GET /api/auth/me — поточний користувач (перевірка токена)
export const me = asyncH(async (req, res) => {
  const user = await Users.getById(req.user.id);
  if (!user) return fail(res, 404, 'NOT_FOUND', 'Користувача не знайдено');
  ok(res, user);
});
