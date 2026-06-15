// Стандартні формати відповідей згідно ТЗ
export const ok = (res, data, meta) =>
  res.json(meta ? { data, meta } : { data });

export const fail = (res, status, code, message) =>
  res.status(status).json({ error: { code, message } });

// 404 для невідомих маршрутів
export function notFound(req, res) {
  fail(res, 404, 'NOT_FOUND', `Маршрут ${req.method} ${req.path} не знайдено`);
}

// Загальний обробник помилок
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  // Унікальне порушення (наприклад, дубль slug)
  if (err.code === '23505') {
    return fail(res, 409, 'CONFLICT', 'Запис із таким значенням уже існує (можливо, дубль slug)');
  }
  fail(res, 500, 'INTERNAL_ERROR', 'Внутрішня помилка сервера');
}

// Обгортка для async-контролерів, щоб не писати try/catch усюди
export const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
