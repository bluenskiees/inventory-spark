import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  TrendingUp, Home, Package, ArrowDownCircle, ArrowUpCircle,
  History, FileText, BarChart3, Users, LogOut, X, Boxes
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: TrendingUp },
  { title: "Home", path: "/home", icon: Home },
  { title: "Data Barang", path: "/barang", icon: Package },
  { title: "Barang Masuk", path: "/transaksi/masuk", icon: ArrowDownCircle },
  { title: "Barang Keluar", path: "/transaksi/keluar", icon: ArrowUpCircle },
  { title: "Riwayat Transaksi", path: "/transaksi/riwayat", icon: History },
  { title: "Laporan", path: "/laporan", icon: FileText },
  { title: "Stok", path: "/stok", icon: BarChart3 },
  { title: "Admin", path: "/admin/users", icon: Users },
];

interface AppSidebarProps {
  onClose: () => void;
}

export default function AppSidebar({ onClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path === "/home") return location.pathname === "/home";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Boxes className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">Inventory</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-primary-foreground/70 hover:text-primary-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-primary-foreground/50 text-sm ml-11">v1.0</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? "bg-white/15 text-primary-foreground font-medium shadow-sm"
                : "text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/20 pt-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-destructive/30 hover:text-primary-foreground transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
