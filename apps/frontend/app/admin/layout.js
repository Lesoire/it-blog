// Адмін-панель не індексується пошуковими системами.
export const metadata = {
  title: 'Адмін-панель',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="admin-shell">{children}</div>;
}
