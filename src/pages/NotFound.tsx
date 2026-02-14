import { useLocation, Link } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Halaman tidak ditemukan</p>
        <p className="mb-8 text-sm text-muted-foreground">Route: {location.pathname}</p>
        <Link to="/dashboard" className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
