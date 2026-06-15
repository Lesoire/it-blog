// Запуск міграцій: створення схеми + (опційно) seed.
//   node src/scripts/migrate.js          -> застосовує лише схему
//   node src/scripts/migrate.js --seed   -> схема + наповнення даними
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', '..', 'migrations');

const runFile = async (file) => {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  process.stdout.write(`→ Виконую ${file} ... `);
  await pool.query(sql);
  console.log('OK');
};

const main = async () => {
  const withSeed = process.argv.includes('--seed');
  try {
    await runFile('001_schema.sql');
    if (withSeed) {
      await runFile('002_seed.sql');
      console.log('\n✅ Схему створено та наповнено тестовими даними.');
      console.log('   Адмін:  olena@itblog.dev / admin123');
    } else {
      console.log('\n✅ Схему створено. Для тестових даних запустіть: npm run seed');
    }
  } catch (err) {
    console.error('\n❌ Помилка міграції:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

main();
