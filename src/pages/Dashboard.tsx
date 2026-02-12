import { Package, ArrowDownCircle, ArrowUpCircle, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Jenis Barang", value: "45", sub: "5 barang baru", icon: Package, gradient: "bg-gradient-primary" },
  { label: "Barang Masuk Hari Ini", value: "12", sub: "8 transaksi selesai", icon: ArrowDownCircle, gradient: "bg-gradient-success" },
  { label: "Barang Keluar Hari Ini", value: "8", sub: "6 transaksi selesai", icon: ArrowUpCircle, gradient: "bg-gradient-warning" },
  { label: "Stok Rendah", value: "5", sub: "Segera perbarui stok", icon: AlertTriangle, gradient: "bg-gradient-danger" },
];

const recentTransactions = [
  { time: "09:45", name: "Biji Kopi", type: "masuk", qty: "20 Kg", status: "Selesai" },
  { time: "10:30", name: "Gelas Plastik", type: "keluar", qty: "100 Pcs", status: "Selesai" },
  { time: "11:15", name: "Susu", type: "masuk", qty: "15 Liter", status: "Selesai" },
  { time: "12:00", name: "Sedotan", type: "keluar", qty: "50 Pack", status: "Pending" },
  { time: "14:30", name: "Gula Pasir", type: "masuk", qty: "10 Kg", status: "Selesai" },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Ringkasan Sistem Inventory Anda</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.gradient} rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-primary-foreground/70 text-sm mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-primary-foreground">{stat.value}</h3>
              </div>
              <stat.icon className="h-10 w-10 text-primary-foreground/30" />
            </div>
            <p className="text-primary-foreground/70 text-sm flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            Riwayat Transaksi Terbaru
          </h3>
          <Link to="/transaksi/riwayat" className="text-primary text-sm hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Jam</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipe</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4">{tx.time}</td>
                  <td className="py-3 px-4 font-medium">{tx.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      tx.type === "masuk"
                        ? "bg-success/30 text-success-foreground"
                        : "bg-destructive/30 text-destructive-foreground"
                    }`}>
                      {tx.type === "masuk" ? <ArrowDownCircle className="h-3 w-3" /> : <ArrowUpCircle className="h-3 w-3" />}
                      {tx.type === "masuk" ? "Masuk" : "Keluar"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">{tx.qty}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      tx.status === "Selesai"
                        ? "bg-success/30 text-success-foreground"
                        : "bg-warning/30 text-warning-foreground"
                    }`}>
                      <CheckCircle className="h-3 w-3" /> {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
