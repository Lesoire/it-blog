'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import * as api from '@/lib/adminApi';

// ---- транслітерація укр -> latin для slug ----
const MAP = {
  а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ie',ж:'zh',з:'z',и:'y',і:'i',ї:'i',
  й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',
  ц:'ts',ч:'ch',ш:'sh',щ:'shch',ь:'',ю:'iu',я:'ia',"'":'',' ':'-',
};
function slugify(str = '') {
  return str.toLowerCase().split('').map((ch) => (MAP[ch] !== undefined ? MAP[ch] : ch)).join('')
    .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const EMPTY_ARTICLE = {
  title: '', slug: '', excerpt: '', content: '', cover_url: '',
  category_id: '', status: 'draft', meta_title: '', meta_description: '', tagIds: [],
};

export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('articles');

  // Перевірка токена на старті
  useEffect(() => {
    const token = api.getToken();
    if (!token) { setChecking(false); return; }
    api.listArticles()
      .then(() => setAuthed(true))
      .catch(() => api.clearToken())
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="empty">Перевірка сесії…</div>;
  if (!authed) return <LoginScreen onLogin={(u) => { setUser(u); setAuthed(true); }} />;

  return (
    <>
      <div className="admin-bar">
        <div className="container">
          <span className="brand"><span className="dot" />{SITE.name} · admin</span>
          <div className="btn-row">
            <Link href="/" className="btn ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)', height: 36, display:'inline-flex', alignItems:'center' }}>↗ Сайт</Link>
            <button className="btn" onClick={() => { api.clearToken(); setAuthed(false); }} style={{ height: 36 }}>Вийти</button>
          </div>
        </div>
      </div>

      <div className="admin-main">
        <div className="container">
          <nav className="filterbar" style={{ paddingTop: 0 }}>
            {[['articles','Статті'],['categories','Категорії'],['tags','Теги']].map(([k,label]) => (
              <button key={k} className={`chip${view===k?' active':''}`} onClick={() => setView(k)}>{label}</button>
            ))}
          </nav>

          {view === 'articles' && <ArticlesView />}
          {view === 'categories' && <CategoriesView />}
          {view === 'tags' && <TagsView />}
        </div>
      </div>
    </>
  );
}

// ===================== LOGIN =====================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('olena@itblog.dev');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(''); setLoading(true);
    try {
      const res = await api.login(email, password);
      api.setToken(res.data.token);
      onLogin(res.data.user);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-card">
      <span className="kicker">admin</span>
      <h1 className="display" style={{ fontSize: '1.6rem', margin: '12px 0 20px' }}>Вхід у панель</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="field">
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" autoComplete="username" />
      </div>
      <div className="field">
        <label>Пароль</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" autoComplete="current-password"
          onKeyDown={(e)=>e.key==='Enter'&&submit()} />
      </div>
      <button className="btn" onClick={submit} disabled={loading} style={{ width: '100%', height: 44 }}>
        {loading ? '…' : 'Увійти'}
      </button>
      <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        demo: olena@itblog.dev / admin123
      </p>
    </div>
  );
}

// ===================== ARTICLES =====================
function ArticlesView() {
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.listArticles().then((r) => setArticles(r.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  if (editing !== null) {
    return <ArticleEditor id={editing === 'new' ? null : editing} onDone={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="panel">
      <div className="panel-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Статті ({articles.length})</strong>
        <button className="btn" onClick={() => setEditing('new')}>+ Нова стаття</button>
      </div>
      {loading ? <div className="empty">Завантаження…</div> : (
        <table className="table">
          <thead><tr><th>Заголовок</th><th>Категорія</th><th>Статус</th><th>Перегляди</th><th></th></tr></thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.title}</strong><br/><span style={{ color:'var(--muted)', fontFamily:'var(--font-mono)', fontSize:11 }}>/{a.slug}</span></td>
                <td>{a.category_name || '—'}</td>
                <td><span className={`badge ${a.status}`}>{a.status === 'published' ? 'опубліковано' : 'чернетка'}</span></td>
                <td>{a.views}</td>
                <td style={{ textAlign:'right', whiteSpace:'nowrap' }}>
                  <button className="btn ghost" style={{ height:32 }} onClick={() => setEditing(a.id)}>Редагувати</button>{' '}
                  <button className="btn btn-danger" style={{ height:32 }} onClick={async () => {
                    if (confirm(`Видалити «${a.title}»?`)) { await api.deleteArticle(a.id); load(); }
                  }}>✕</button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && <tr><td colSpan={5} className="empty">Ще немає статей</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ArticleEditor({ id, onDone, onCancel }) {
  const [form, setForm] = useState(EMPTY_ARTICLE);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([api.listCategories(), api.listTags()]).then(([c, t]) => {
      setCategories(c.data); setTags(t.data);
    });
    if (id) {
      api.getArticle(id).then((r) => {
        const a = r.data;
        setForm({
          title: a.title || '', slug: a.slug || '', excerpt: a.excerpt || '',
          content: a.content || '', cover_url: a.cover_url || '',
          category_id: a.category_id || '', status: a.status || 'draft',
          meta_title: a.meta_title || '', meta_description: a.meta_description || '',
          tagIds: (a.tags || []).map((tg) => tg.id),
        });
        setSlugTouched(true);
      });
    }
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onTitle = (v) => {
    set('title', v);
    if (!slugTouched) set('slug', slugify(v));
  };

  const toggleTag = (tagId) => set('tagIds', form.tagIds.includes(tagId)
    ? form.tagIds.filter((x) => x !== tagId)
    : [...form.tagIds, tagId]);

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const r = await api.uploadImage(file);
      set('cover_url', r.data.url);
    } catch (e) { setError(e.message); }
    finally { setUploading(false); }
  };

  const save = async () => {
    setError('');
    if (!form.title || !form.slug || !form.content) {
      setError('Заповніть заголовок, slug та текст статті.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, category_id: form.category_id || null };
      if (id) await api.updateArticle(id, payload);
      else await api.createArticle(payload);
      onDone();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="panel panel-pad">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <strong>{id ? 'Редагування статті' : 'Нова стаття'}</strong>
        <button className="btn ghost" onClick={onCancel} style={{ height:34 }}>← Назад</button>
      </div>
      {error && <div className="alert error">{error}</div>}

      <div className="field">
        <label>Заголовок *</label>
        <input value={form.title} onChange={(e)=>onTitle(e.target.value)} />
      </div>
      <div className="field">
        <label>Slug *</label>
        <input value={form.slug} onChange={(e)=>{ setSlugTouched(true); set('slug', e.target.value); }} />
      </div>
      <div className="field">
        <label>Короткий опис (excerpt)</label>
        <input value={form.excerpt} onChange={(e)=>set('excerpt', e.target.value)} />
      </div>

      <div className="row">
        <div className="field">
          <label>Категорія</label>
          <select value={form.category_id} onChange={(e)=>set('category_id', e.target.value)}>
            <option value="">— без категорії —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Статус</label>
          <select value={form.status} onChange={(e)=>set('status', e.target.value)}>
            <option value="draft">Чернетка</option>
            <option value="published">Опубліковано</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Обкладинка (URL або завантаження)</label>
        <input value={form.cover_url} onChange={(e)=>set('cover_url', e.target.value)} placeholder="https://…" />
        <div style={{ marginTop: 8, display:'flex', gap:10, alignItems:'center' }}>
          <input type="file" accept="image/*" onChange={(e)=>onUpload(e.target.files?.[0])} />
          {uploading && <span className="kicker">завантаження…</span>}
        </div>
        {form.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.cover_url} alt="" style={{ marginTop:10, maxHeight:140, borderRadius:4, border:'1px solid var(--line)' }} />
        )}
      </div>

      <div className="field">
        <label>Теги</label>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {tags.map((t) => (
            <button key={t.id} type="button" className={`chip${form.tagIds.includes(t.id)?' active':''}`} onClick={()=>toggleTag(t.id)}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Текст статті (HTML) *</label>
        <textarea value={form.content} onChange={(e)=>set('content', e.target.value)} placeholder="<p>Текст…</p>" />
      </div>

      <details style={{ marginBottom: 16 }}>
        <summary style={{ cursor:'pointer', fontWeight:600, fontSize:'0.85rem' }}>SEO-метатеги</summary>
        <div className="field" style={{ marginTop: 12 }}>
          <label>Meta title</label>
          <input value={form.meta_title} onChange={(e)=>set('meta_title', e.target.value)} />
        </div>
        <div className="field">
          <label>Meta description</label>
          <input value={form.meta_description} onChange={(e)=>set('meta_description', e.target.value)} />
        </div>
      </details>

      <div className="btn-row">
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Збереження…' : 'Зберегти'}</button>
        <button className="btn ghost" onClick={onCancel}>Скасувати</button>
      </div>
    </div>
  );
}

// ===================== CATEGORIES =====================
function CategoriesView() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', slug:'', description:'' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => api.listCategories().then((r) => setItems(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setError('');
    try {
      if (editId) await api.updateCategory(editId, form);
      else await api.createCategory(form);
      setForm({ name:'', slug:'', description:'' }); setEditId(null); load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="row" style={{ alignItems:'flex-start' }}>
      <div className="panel" style={{ flex: 2 }}>
        <table className="table">
          <thead><tr><th>Назва</th><th>Slug</th><th>Статей</th><th></th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td><td style={{ fontFamily:'var(--font-mono)', fontSize:12 }}>{c.slug}</td>
                <td>{c.article_count}</td>
                <td style={{ textAlign:'right', whiteSpace:'nowrap' }}>
                  <button className="btn ghost" style={{ height:30 }} onClick={()=>{ setEditId(c.id); setForm({ name:c.name, slug:c.slug, description:c.description||'' }); }}>✎</button>{' '}
                  <button className="btn btn-danger" style={{ height:30 }} onClick={async ()=>{ if(confirm('Видалити категорію?')){ try{ await api.deleteCategory(c.id); load(); }catch(e){ alert(e.message); } } }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel panel-pad" style={{ flex: 1, minWidth: 260 }}>
        <strong>{editId ? 'Редагувати' : 'Нова категорія'}</strong>
        {error && <div className="alert error" style={{ marginTop:10 }}>{error}</div>}
        <div className="field" style={{ marginTop: 12 }}>
          <label>Назва</label>
          <input value={form.name} onChange={(e)=>setForm((f)=>({ ...f, name:e.target.value, slug: editId? f.slug : slugify(e.target.value) }))} />
        </div>
        <div className="field"><label>Slug</label><input value={form.slug} onChange={(e)=>setForm((f)=>({ ...f, slug:e.target.value }))} /></div>
        <div className="field"><label>Опис</label><textarea style={{ minHeight: 80 }} value={form.description} onChange={(e)=>setForm((f)=>({ ...f, description:e.target.value }))} /></div>
        <div className="btn-row">
          <button className="btn" onClick={save}>Зберегти</button>
          {editId && <button className="btn ghost" onClick={()=>{ setEditId(null); setForm({ name:'', slug:'', description:'' }); }}>Скасувати</button>}
        </div>
      </div>
    </div>
  );
}

// ===================== TAGS =====================
function TagsView() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => api.listTags().then((r) => setItems(r.data)), []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    setError('');
    try { await api.createTag({ name, slug: slugify(name) }); setName(''); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div className="row" style={{ alignItems:'flex-start' }}>
      <div className="panel" style={{ flex: 2 }}>
        <table className="table">
          <thead><tr><th>Тег</th><th>Slug</th><th>Статей</th><th></th></tr></thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>#{t.name}</td><td style={{ fontFamily:'var(--font-mono)', fontSize:12 }}>{t.slug}</td>
                <td>{t.article_count}</td>
                <td style={{ textAlign:'right' }}>
                  <button className="btn btn-danger" style={{ height:30 }} onClick={async ()=>{ if(confirm('Видалити тег?')){ await api.deleteTag(t.id); load(); } }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel panel-pad" style={{ flex: 1, minWidth: 240 }}>
        <strong>Новий тег</strong>
        {error && <div className="alert error" style={{ marginTop:10 }}>{error}</div>}
        <div className="field" style={{ marginTop: 12 }}>
          <label>Назва</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&add()} />
        </div>
        <button className="btn" onClick={add}>Додати</button>
      </div>
    </div>
  );
}
