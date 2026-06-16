import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthor, getAuthorArticles } from "@/lib/api";
import { SITE, formatDate } from "@/lib/site";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const res = await getAuthor(params.slug);
  const author = res?.data || res;
  if (!author) return {};
  return {
    title: `${author.name} - ${SITE.name}`,
    description: author.bio || `Статті автора ${author.name} на IT Blog.`,
    alternates: { canonical: `/authors/${params.slug}` },
  };
}

export default async function AuthorPage({ params }) {
  const [authorRes, articlesRes] = await Promise.all([
    getAuthor(params.slug),
    getAuthorArticles(params.slug),
  ]);

  const author = authorRes?.data || authorRes;
  if (!author) notFound();

  const articles = articlesRes?.data?.articles || articlesRes?.articles || [];

  return (
    <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: "3rem", flexWrap: "wrap" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, background: "#f3f4f6", border: "3px solid var(--border, #e5e7eb)" }}>
          {author.avatar_url ? (
            <Image src={author.avatar_url} alt={author.name} fill style={{ objectFit: "cover" }} sizes="120px" priority />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "#9ca3af" }}>
              {author.name?.[0] || "?"}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>{author.name}</h1>
          <p style={{ color: "var(--text-2, #6b7280)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
            Автор з {formatDate(author.created_at)}
          </p>
          {author.bio && (
            <p style={{ fontSize: "1rem", lineHeight: 1.7, marginBottom: "1rem", maxWidth: 600 }}>{author.bio}</p>
          )}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {author.github_url && (
              <a href={author.github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent, #4f46e5)", textDecoration: "none", fontWeight: 500 }}>
                GitHub
              </a>
            )}
            {author.linkedin_url && (
              <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--accent, #4f46e5)", textDecoration: "none", fontWeight: 500 }}>
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div style={{ padding: "1rem 1.5rem", border: "1px solid var(--border, #e5e7eb)", borderRadius: "10px", textAlign: "center", minWidth: 120 }}>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent, #4f46e5)" }}>{articles.length}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-2, #6b7280)", marginTop: "0.2rem" }}>
            {articles.length === 1 ? "стаття" : articles.length < 5 ? "статті" : "статей"}
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Статті автора</h2>
        {articles.length === 0 ? (
          <p style={{ color: "var(--text-2, #6b7280)" }}>Поки що немає опублікованих статей.</p>
        ) : (
          <div className="grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link href="/authors" style={{ fontSize: "0.9rem", color: "var(--accent, #4f46e5)", textDecoration: "none" }}>
          Всі автори
        </Link>
      </div>
    </div>
  );
}