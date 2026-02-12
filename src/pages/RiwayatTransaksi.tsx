import { useState } from "react";
import { History, ArrowDownCircle, ArrowUpCircle, CheckCircle, Search } from "lucide-react";

const allTransactions = [
  { id: 1, tanggal: "2025-06-15", jam: "09:45", nama: "Biji Kopi Arabica", type: "masuk", qty: "20 Kg", supplier: "PT Kopi Nusantara", status: "Selesai" },
  { id: 2, tanggal: "2025-06-15", jam: "10:30", nama: "Gelas Plastik 16oz", type: "keluar", qty: "100 Pcs", supplier: "Outlet A", status: "Selesai" },
  { id: 3, tanggal: "2025-06-15", jam: "11:15", nama: "Susu Full Cream", type: "masuk", qty: "15 Liter", supplier: "CV Dairy Farm", status: "Selesai" },
  { id: 4, tanggal: "2025-06-14", jam: "08:00", nama: "Sedotan", type: "keluar", qty: "50 Pack", supplier: "Outlet B", status: "Selesai" },
  { id: 5, tanggal: "2025-06-14", jam: "14:30", nama: "Gula Pasir", type: "masuk", qty: "10 Kg", supplier: "Toko Manis", status: "Pending" },
  { id: 6, tanggal: "2025-06-13", jam: "16:00", nama: "Sirup Vanilla", type: "masuk", qty: "5 Botol", supplier: "PT Flavor", status: "Selesai" },
];

export default function RiwayatTransaksi() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "masuk" | "keluar">("all");

  const filtered = allTransactions
    .filter((t) => filter === "all" || t.type === filter)
    .filter((t) => t.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <History className="h-8 w-8 text-primary" /> Riwayat Transaksi
        </h2>
        <p className="text-muted-foreground">Semua riwayat transaksi barang masuk dan keluar</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "masuk", "keluar"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                filter === f
                  ? "bg-gradient-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {f === "all" ? "Semua" : f === "masuk" ? "Masuk" : "Keluar"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tanggal</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Jam</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipe</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Supplier/Tujuan</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground">{tx.tanggal}</td>
                  <td className="py-3 px-4">{tx.jam}</td>
                  <td className="py-3 px-4 font-medium">{tx.nama}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      tx.type === "masuk" ? "bg-success/30 text-success-foreground" : "bg-destructive/30 text-destructive-foreground"
                    }`}>
                      {tx.type === "masuk" ? <ArrowDownCircle className="h-3 w-3" /> : <ArrowUpCircle className="h-3 w-3" />}
                      {tx.type === "masuk" ? "Masuk" : "Keluar"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">{tx.qty}</td>
                  <td className="py-3 px-4 text-muted-foreground">{tx.supplier}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      tx.status === "Selesai" ? "bg-success/30 text-success-foreground" : "bg-warning/30 text-warning-foreground"
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
