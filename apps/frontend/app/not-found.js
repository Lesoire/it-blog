import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '90px 24px', textAlign: 'center' }}>
      <span className="kicker">404</span>
      <h1 className="display" style={{ fontSize: '3rem', marginTop: 14 }}>
        Сторінку не знайдено
      </h1>
      <p className="lede" style={{ margin: '16px auto 28px', maxWidth: 440 }}>
        Можливо, статтю видалено або адресу введено з помилкою.
      </p>
      <Link href="/" className="btn">На головну</Link>
    </div>
  );
}
