import { User, Edit, CheckCircle, LogIn as LogInIcon, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Home</h2>
        <p className="text-muted-foreground">Selamat datang di Sistem Inventory</p>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-primary rounded-xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-primary-foreground mb-2">Selamat Datang Kembali! 👋</h3>
        <p className="text-primary-foreground/80">Mari kelola inventori Anda dengan efisien</p>
      </div>

      {/* Profile + Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profil Saya
            </h3>
            <Button variant="gradient" size="sm"><Edit className="h-4 w-4" /> Edit</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Nama Lengkap", value: "Admin User" },
              { label: "Email", value: "admin@inventory.local" },
              { label: "Username", value: "admin" },
              { label: "Role", value: "Administrator" },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-sm text-muted-foreground">{item.label}</label>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold">Info Cepat</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Login</span>
              <span className="text-sm font-medium">Hari ini</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/30 text-success-foreground text-xs font-medium">
                <CheckCircle className="h-3 w-3" /> Aktif
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Terdaftar</span>
              <span className="text-sm font-medium">30 Nov 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> Aktivitas Terbaru
        </h3>
        <div className="space-y-3">
          {[
            { icon: LogInIcon, text: "Login ke sistem", time: "Hari ini", color: "bg-primary/20 text-primary" },
            { icon: CheckCircle, text: "Transaksi barang masuk", time: "2 jam yang lalu", color: "bg-success/20 text-success-foreground" },
            { icon: FileText, text: "Generate laporan stok", time: "5 jam yang lalu", color: "bg-primary/20 text-primary" },
          ].map((activity, i) => (
            <div key={i} className={`flex items-center gap-4 ${i < 2 ? "pb-3 border-b border-border/50" : ""}`}>
              <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center`}>
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.text}</p>
                <p className="text-muted-foreground text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
