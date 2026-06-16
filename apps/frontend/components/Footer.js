import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container cols">
        <div style={{ maxWidth: 320 }}>
          <div className="foot-brand">{SITE.name}</div>
          <p style={{ marginTop: 8 }}>{SITE.tagline}.</p>
        </div>
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>розділи</div>
          <div style={{ display: "grid", gap: 6 }}>
            <Link href="/categories/frontend">Frontend</Link>
            <Link href="/categories/backend-devops">Backend та DevOps</Link>
            <Link href="/categories/ai-ml">ШІ та ML</Link>
            <Link href="/categories/cybersecurity">Кібербезпека</Link>
          </div>
        </div>
        <div>
          <div className="kicker" style={{ marginBottom: 12 }}>сервіс</div>
          <div style={{ display: "grid", gap: 6 }}>
            <Link href="/authors">Автори</Link>
            <Link href="/about">Про нас</Link>
            <Link href="/search">Пошук</Link>
            <a href="/rss.xml">RSS</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: 28, fontSize: "0.82rem" }}>
        © {year} {SITE.name}. Навчальний проєкт.
      </div>
    </footer>
  );
}