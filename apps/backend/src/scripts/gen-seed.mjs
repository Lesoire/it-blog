// Генератор seed-даних -> migrations/002_seed.sql
// Запускається один раз для побудови SQL-файлу з коректним екрануванням.
import fs from 'fs';

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";

const authors = [
  {
    name: 'Олена Ковальчук',
    slug: 'olena-kovalchuk',
    email: 'olena@itblog.dev',
    bio: 'Frontend-інженерка з 8 роками досвіду. Пише про React, продуктивність та доступність вебзастосунків.',
    avatar_url: 'https://i.pravatar.cc/300?img=47',
    is_admin: true,
    password: '$2a$10$L1YnQK2x.PTro.nIB5beFOUFG0kG1DDom7X.3fFHpMJaML799ZOJu', // admin123
  },
  {
    name: 'Андрій Мельник',
    slug: 'andrii-melnyk',
    email: 'andrii@itblog.dev',
    bio: 'Backend та DevOps інженер. Захоплюється Kubernetes, базами даних та надійними розподіленими системами.',
    avatar_url: 'https://i.pravatar.cc/300?img=12',
    is_admin: false,
    password: '$2a$10$TtHv11/mBFh9eFlh/IAczOSu43t1OUdSOKMyxPcl4WEaAIqnMvCNK', // author123
  },
  {
    name: 'Марія Бондаренко',
    slug: 'mariia-bondarenko',
    email: 'mariia@itblog.dev',
    bio: 'Дослідниця в галузі машинного навчання. Пояснює складні теми ШІ простими словами.',
    avatar_url: 'https://i.pravatar.cc/300?img=45',
    is_admin: false,
    password: '$2a$10$TtHv11/mBFh9eFlh/IAczOSu43t1OUdSOKMyxPcl4WEaAIqnMvCNK', // author123
  },
];

const categories = [
  { name: 'JavaScript / Frontend', slug: 'frontend', description: 'Новини світу JavaScript, React, Vue, верстки та клієнтської розробки.' },
  { name: 'Backend та DevOps', slug: 'backend-devops', description: 'Серверна розробка, бази даних, CI/CD, контейнеризація та хмарні технології.' },
  { name: 'Штучний інтелект та ML', slug: 'ai-ml', description: 'Машинне навчання, нейромережі, великі мовні моделі та практичне застосування ШІ.' },
  { name: 'Кібербезпека', slug: 'cybersecurity', description: 'Захист даних, вразливості, безпечна розробка та новини інформаційної безпеки.' },
  { name: 'Огляди інструментів', slug: 'tools', description: 'Огляди редакторів, фреймворків, бібліотек та інструментів для розробників.' },
];

const tags = [
  'react', 'nextjs', 'typescript', 'nodejs', 'postgresql', 'docker',
  'kubernetes', 'ai', 'llm', 'security', 'performance', 'css',
  'devops', 'api', 'seo',
];

const p = (text) => `<p>${text}</p>`;
const h2 = (text) => `<h2>${text}</h2>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const code = (text) => `<pre><code>${text.replace(/</g, '&lt;')}</code></pre>`;

// Хелпер: збираємо контент із блоків
const body = (...blocks) => blocks.join('\n');

const articles = [
  {
    title: 'Server Components у React: що змінилось у 2026 році',
    slug: 'react-server-components-2026',
    category: 'frontend',
    author: 'olena-kovalchuk',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    excerpt: 'React Server Components остаточно стали стандартом. Розбираємо, як вони працюють, де дають виграш і яких помилок уникати.',
    tags: ['react', 'nextjs', 'performance'],
    content: body(
      p('React Server Components (RSC) пройшли довгий шлях від експериментальної ідеї до основи сучасних застосунків. Сьогодні вони визначають архітектуру більшості нових проєктів на Next.js.'),
      h2('Чому це важливо'),
      p('Серверні компоненти виконуються на сервері та надсилають у браузер уже готовий результат. Це означає менший обсяг JavaScript на клієнті, швидше перше відображення та кращі показники Core Web Vitals.'),
      p('Для SEO це принципово: пошуковий робот отримує повноцінний HTML одразу, без необхідності виконувати важкий клієнтський код.'),
      h2('Коли використовувати клієнтські компоненти'),
      ul([
        'Інтерактивні елементи зі станом (форми, модальні вікна).',
        'Компоненти, що використовують браузерні API.',
        'Обробники подій користувача.',
      ]),
      p('Усе інше варто залишати серверним за замовчуванням. Це проста, але потужна стратегія оптимізації.')
    ),
  },
  {
    title: 'Next.js App Router: повний гайд по стратегіях рендерингу',
    slug: 'nextjs-app-router-rendering',
    category: 'frontend',
    author: 'olena-kovalchuk',
    cover: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&q=80',
    excerpt: 'SSG, SSR, ISR та CSR — коли який підхід обирати. Практичні приклади для реальних сторінок блогу.',
    tags: ['nextjs', 'react', 'seo', 'performance'],
    content: body(
      p('App Router дав розробникам тонкий контроль над тим, як саме рендериться кожна сторінка. Розберемо чотири основні стратегії та коли яку обирати.'),
      h2('SSG — статична генерація'),
      p('Сторінка будується під час збірки та віддається як готовий HTML. Ідеально для контенту, що змінюється рідко: головна сторінка, сторінки категорій.'),
      h2('ISR — інкрементальна регенерація'),
      p('Компроміс між статикою та свіжістю даних. Сторінка кешується, але періодично оновлюється у фоні через параметр revalidate.'),
      h2('SSR — рендеринг на запит'),
      p('Сторінка генерується на сервері для кожного запиту. Підходить для унікального контенту, де важлива актуальність, наприклад сторінка статті з лічильником переглядів.'),
      h2('CSR — рендеринг на клієнті'),
      p('Дані завантажуються вже у браузері. Прийнятно для приватних сторінок без вимог до SEO: пошук, адмін-панель.')
    ),
  },
  {
    title: 'TypeScript 6: найважливіші нововведення',
    slug: 'typescript-6-features',
    category: 'frontend',
    author: 'olena-kovalchuk',
    cover: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=1200&q=80',
    excerpt: 'Покращений вивід типів, нові утиліти та пришвидшена компіляція. Огляд того, що дійсно змінить ваш щоденний код.',
    tags: ['typescript'],
    content: body(
      p('Нова версія TypeScript принесла відчутні покращення у виводі типів та швидкості компіляції великих проєктів.'),
      h2('Швидша компіляція'),
      p('Команда переписала частину перевірки типів, що дало пришвидшення до 40% на великих кодових базах. Для монорепозиторіїв це справжній подарунок.'),
      h2('Нові службові типи'),
      p('Зʼявились зручні утиліти для роботи зі звуженням типів, що дозволяє писати безпечніший код із меншою кількістю явних анотацій.')
    ),
  },
  {
    title: 'PostgreSQL для розробника: індекси, які реально працюють',
    slug: 'postgresql-indexes-guide',
    category: 'backend-devops',
    author: 'andrii-melnyk',
    cover: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80',
    excerpt: 'B-tree, GIN, partial та covering індекси. Коли вони прискорюють запити, а коли лише сповільнюють запис.',
    tags: ['postgresql', 'performance', 'api'],
    content: body(
      p('Індекси — головний інструмент оптимізації запитів у PostgreSQL. Але неправильний індекс може зашкодити більше, ніж його відсутність.'),
      h2('B-tree — універсальний вибір'),
      p('Стандартний тип індексу. Підходить для більшості випадків: пошук за рівністю, діапазони, сортування.'),
      h2('GIN — для повнотекстового пошуку'),
      p('Якщо ви шукаєте всередині тексту або працюєте з JSONB, GIN-індекс значно прискорить запити.'),
      h2('Ціна індексів'),
      p('Кожен індекс уповільнює операції вставки та оновлення, адже його теж потрібно підтримувати. Створюйте лише ті індекси, що відповідають реальним запитам вашого застосунку.')
    ),
  },
  {
    title: 'Docker у 2026: мультистейдж-збірки та оптимізація образів',
    slug: 'docker-multistage-builds',
    category: 'backend-devops',
    author: 'andrii-melnyk',
    cover: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&q=80',
    excerpt: 'Як зменшити розмір Docker-образу в кілька разів за допомогою мультистейдж-збірок та правильного кешування шарів.',
    tags: ['docker', 'devops'],
    content: body(
      p('Великі Docker-образи — це повільні деплої та зайві витрати. Мультистейдж-збірки розвʼязують цю проблему елегантно.'),
      h2('Ідея мультистейджу'),
      p('Ви використовуєте один образ для збірки застосунку, а в фінальний образ копіюєте лише готовий результат без інструментів збірки.'),
      code('FROM node:20 AS build\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\nFROM node:20-slim\nCOPY --from=build /app/dist ./dist\nCMD ["node", "dist/index.js"]'),
      p('Такий підхід легко зменшує образ із гігабайта до сотні мегабайтів.')
    ),
  },
  {
    title: 'CI/CD на Railway: автоматичний деплой за 10 хвилин',
    slug: 'railway-cicd-deploy',
    category: 'backend-devops',
    author: 'andrii-melnyk',
    cover: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80',
    excerpt: 'Налаштовуємо безперервний деплой із GitHub на Railway. Кожен push у main автоматично оновлює застосунок.',
    tags: ['devops', 'nodejs'],
    content: body(
      p('Railway робить деплой простим: підключаєте репозиторій, і кожен push автоматично запускає нову збірку.'),
      h2('Три сервіси в одному проєкті'),
      p('Типова архітектура блогу складається з трьох сервісів: frontend, backend та база даних PostgreSQL. Railway дозволяє тримати їх разом і звʼязувати через внутрішні змінні середовища.'),
      h2('Змінні середовища'),
      p('Ніколи не зберігайте паролі та ключі в коді. Railway надає зручний інтерфейс для керування секретами, які підставляються у застосунок під час запуску.')
    ),
  },
  {
    title: 'Як працюють великі мовні моделі: пояснення без математики',
    slug: 'how-llm-works',
    category: 'ai-ml',
    author: 'mariia-bondarenko',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    excerpt: 'Токени, увага та передбачення наступного слова. Інтуїтивне пояснення того, як насправді працюють сучасні LLM.',
    tags: ['ai', 'llm'],
    content: body(
      p('Великі мовні моделі здаються магією, але в основі лежить проста ідея: передбачення наступного токена на основі попереднього контексту.'),
      h2('Що таке токен'),
      p('Модель не бачить слів так, як ми. Текст розбивається на токени — фрагменти слів, які модель перетворює на числа.'),
      h2('Механізм уваги'),
      p('Серце сучасних моделей — механізм уваги. Він дозволяє моделі зважувати, які частини контексту найважливіші для передбачення наступного токена.'),
      h2('Чому моделі помиляються'),
      p('Модель не знає фактів — вона оцінює ймовірності. Саме тому вона може впевнено генерувати неправдиву інформацію. Це явище називають галюцинаціями.')
    ),
  },
  {
    title: 'RAG: як навчити ШІ відповідати на основі ваших документів',
    slug: 'rag-explained',
    category: 'ai-ml',
    author: 'mariia-bondarenko',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    excerpt: 'Retrieval-Augmented Generation поєднує пошук та генерацію. Розбираємо, чому це найпопулярніший підхід для корпоративних застосунків ШІ.',
    tags: ['ai', 'llm', 'api'],
    content: body(
      p('RAG (Retrieval-Augmented Generation) дозволяє моделі відповідати на основі ваших власних даних, не вимагаючи дороговартісного донавчання.'),
      h2('Як це працює'),
      ul([
        'Документи розбиваються на фрагменти та перетворюються на вектори.',
        'Запит користувача теж перетворюється на вектор.',
        'Система знаходить найбільш релевантні фрагменти та додає їх у контекст моделі.',
      ]),
      p('У результаті модель відповідає, спираючись на конкретні джерела, що значно зменшує кількість галюцинацій.')
    ),
  },
  {
    title: 'Векторні бази даних: огляд та порівняння',
    slug: 'vector-databases-comparison',
    category: 'ai-ml',
    author: 'mariia-bondarenko',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    excerpt: 'pgvector, Pinecone, Qdrant, Weaviate. Який інструмент обрати для семантичного пошуку у вашому проєкті.',
    tags: ['ai', 'postgresql', 'performance'],
    content: body(
      p('Зі зростанням популярності RAG векторні бази даних стали критичним компонентом інфраструктури ШІ.'),
      h2('pgvector — почати просто'),
      p('Якщо ви вже використовуєте PostgreSQL, розширення pgvector дозволяє зберігати та шукати вектори без додаткової інфраструктури. Чудовий вибір для старту.'),
      h2('Спеціалізовані рішення'),
      p('Pinecone, Qdrant та Weaviate пропонують вищу продуктивність на великих обсягах, але додають складності в експлуатації. Обирайте їх, коли pgvector вже не справляється.')
    ),
  },
  {
    title: 'OWASP Top 10: найпоширеніші вразливості вебзастосунків',
    slug: 'owasp-top-10-guide',
    category: 'cybersecurity',
    author: 'andrii-melnyk',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    excerpt: 'Ін`єкції, зламана автентифікація, XSS. Огляд головних загроз і того, як захистити від них свій застосунок.',
    tags: ['security', 'api'],
    content: body(
      p('OWASP Top 10 — це список найкритичніших ризиків безпеки вебзастосунків, який оновлюється спільнотою фахівців.'),
      h2('SQL-інʼєкції'),
      p('Класична вразливість, що виникає при підстановці даних користувача безпосередньо у SQL-запит. Захист простий: завжди використовуйте параметризовані запити.'),
      h2('Зламана автентифікація'),
      p('Слабкі паролі, незахищені токени та відсутність обмеження спроб входу роблять застосунок легкою мішенню. JWT із коротким терміном дії та хешування паролів через bcrypt — обовʼязковий мінімум.'),
      h2('XSS — міжсайтовий скриптинг'),
      p('Якщо ви вставляєте дані користувача у HTML без екранування, зловмисник може виконати свій скрипт у браузері жертви. Сучасні фреймворки екранують вивід за замовчуванням.')
    ),
  },
  {
    title: 'JWT проти сесій: що обрати для автентифікації',
    slug: 'jwt-vs-sessions',
    category: 'cybersecurity',
    author: 'andrii-melnyk',
    cover: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80',
    excerpt: 'Stateless-токени чи серверні сесії? Розбираємо переваги, недоліки та типові помилки кожного підходу.',
    tags: ['security', 'nodejs', 'api'],
    content: body(
      p('Питання вибору між JWT та сесіями виникає майже в кожному проєкті. Правильна відповідь залежить від ваших вимог.'),
      h2('JWT — stateless'),
      p('Токен містить всю інформацію всередині себе та підписаний сервером. Сервер не зберігає стан, що зручно для масштабування. Недолік: токен складно відкликати до завершення терміну дії.'),
      h2('Сесії — stateful'),
      p('Сервер зберігає інформацію про сесію, а клієнт тримає лише ідентифікатор. Легко відкликати, але потребує спільного сховища сесій при горизонтальному масштабуванні.')
    ),
  },
  {
    title: 'VS Code чи Neovim: чесне порівняння у 2026',
    slug: 'vscode-vs-neovim-2026',
    category: 'tools',
    author: 'olena-kovalchuk',
    cover: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80',
    excerpt: 'Зручність проти швидкості та контролю. Допомагаємо визначитись, який редактор підійде саме вам.',
    tags: ['css', 'performance'],
    content: body(
      p('Війна редакторів триває вічно, але обидва інструменти у 2026 році сильніші, ніж будь-коли.'),
      h2('VS Code — зручність із коробки'),
      p('Величезна екосистема розширень, чудова підтримка налагодження та інтеграція з ШІ-асистентами роблять його ідеальним для команд та новачків.'),
      h2('Neovim — швидкість і контроль'),
      p('Після початкового навчання Neovim дає неперевершену швидкість редагування та повний контроль над конфігурацією. Вибір тих, хто проводить у редакторі весь день.')
    ),
  },
];

// ---- Генерація SQL ----
let sql = `-- =====================================================================
-- IT Blog — стартові дані (seed)
-- Згенеровано автоматично. Облікові дані за замовчуванням:
--   Адмін:  olena@itblog.dev / admin123
--   Автори: andrii@itblog.dev / author123,  mariia@itblog.dev / author123
-- =====================================================================

-- Очищення (щоб seed можна було запускати повторно)
TRUNCATE TABLE article_tags, articles, tags, categories, users RESTART IDENTITY CASCADE;

`;

sql += '-- Користувачі / автори\n';
sql += 'INSERT INTO users (name, slug, email, password, bio, avatar_url, is_admin) VALUES\n';
sql += authors
  .map(
    (a) =>
      `(${q(a.name)}, ${q(a.slug)}, ${q(a.email)}, ${q(a.password)}, ${q(a.bio)}, ${q(a.avatar_url)}, ${a.is_admin})`
  )
  .join(',\n') + ';\n\n';

sql += '-- Категорії\n';
sql += 'INSERT INTO categories (name, slug, description) VALUES\n';
sql += categories.map((c) => `(${q(c.name)}, ${q(c.slug)}, ${q(c.description)})`).join(',\n') + ';\n\n';

sql += '-- Теги\n';
sql += 'INSERT INTO tags (name, slug) VALUES\n';
sql += tags.map((t) => `(${q(t)}, ${q(t)})`).join(',\n') + ';\n\n';

sql += '-- Статті\n';
sql += 'INSERT INTO articles (title, slug, excerpt, content, cover_url, author_id, category_id, status, views, meta_title, meta_description, published_at) VALUES\n';
sql += articles
  .map((a, i) => {
    const authorIdx = authors.findIndex((au) => au.slug === a.author) + 1;
    const catIdx = categories.findIndex((c) => c.slug === a.category) + 1;
    const views = 50 + Math.floor(Math.random() * 4000);
    const daysAgo = articles.length - i; // старіші статті — раніше
    const publishedAt = `NOW() - INTERVAL '${daysAgo} days'`;
    const metaTitle = a.title; // суфікс «— IT Blog» додає шаблон у layout.js
    return `(${q(a.title)}, ${q(a.slug)}, ${q(a.excerpt)}, ${q(a.content)}, ${q(a.cover)}, ${authorIdx}, ${catIdx}, 'published', ${views}, ${q(metaTitle)}, ${q(a.excerpt)}, ${publishedAt})`;
  })
  .join(',\n') + ';\n\n';

sql += '-- Звʼязки статей і тегів\n';
const tagInserts = [];
articles.forEach((a, i) => {
  const articleId = i + 1;
  a.tags.forEach((t) => {
    const tagId = tags.indexOf(t) + 1;
    tagInserts.push(`(${articleId}, ${tagId})`);
  });
});
sql += 'INSERT INTO article_tags (article_id, tag_id) VALUES\n' + tagInserts.join(',\n') + ';\n';

fs.writeFileSync('migrations/002_seed.sql', sql);
console.log('Seed SQL written: migrations/002_seed.sql');
console.log('Articles:', articles.length, '| Authors:', authors.length, '| Categories:', categories.length, '| Tags:', tags.length);
