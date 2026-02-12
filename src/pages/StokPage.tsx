import { useState } from "react";
import { BarChart3, Search, AlertTriangle, CheckCircle, Package } from "lucide-react";

const stockData = [
  { id: 1, nama: "Biji Kopi Arabica", kategori: "Bahan Baku", stok: 50, min: 10, max: 100, satuan: "Kg" },
  { id: 2, nama: "Gelas Plastik 16oz", kategori: "Packaging", stok: 500, min: 100, max: 1000, satuan: "Pcs" },
  { id: 3, nama: "Susu Full Cream", kategori: "Bahan Baku", stok: 30, min: 20, max: 80, satuan: "Liter" },
  { id: 4, nama: "Gula Pasir", kategori: "Bahan Baku", stok: 25, min: 15, max: 60, satuan: "Kg" },
  { id: 5, nama: "Sedotan", kategori: "Packaging", stok: 200, min: 50, max: 500, satuan: "Pack" },
  { id: 6, nama: "Sirup Vanilla", kategori: "Bahan Baku", stok: 8, min: 10, max: 30, satuan: "Botol" },
  { id: 7, nama: "Sirup Hazelnut", kategori: "Bahan Baku", stok: 5, min: 10, max: 30, satuan: "Botol" },
];

function getStatus(stok: number, min: number) {
  if (stok <= min * 0.5) return { label: "Kritis", color: "bg-destructive/30 text-destructive-foreground" };
  if (stok <= min) return { label: "Rendah", color: "bg-warning/30 text-warning-foreground" };
  return { label: "Normal", color: "bg-success/30 text-success-foreground" };
}

function getProgress(stok: number, max: number) {
  return Math.min((stok / max) * 100, 100);
}

export default function StokPage() {
  const [search, setSearch] = useState("");
  const filtered = stockData.filter((s) => s.nama.toLowerCase().includes(search.toLowerCase()));

  const totalItems = stockData.length;
  const lowStock = stockData.filter((s) => s.stok <= s.min).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" /> Manajemen Stok
        </h2>
        <p className="text-muted-foreground">Monitor dan kelola stok barang</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Item</p>
              <h3 className="text-3xl font-bold">{totalItems}</h3>
            </div>
            <Package className="h-8 w-8 text-primary/30" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Stok Normal</p>
              <h3 className="text-3xl font-bold text-success-foreground">{totalItems - lowStock}</h3>
            </div>
            <CheckCircle className="h-8 w-8 text-success-foreground/30" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Stok Rendah</p>
              <h3 className="text-3xl font-bold text-warning-foreground">{lowStock}</h3>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning-foreground/30" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stock Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Kategori</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stok</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium w-48">Progress</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const status = getStatus(item.stok, item.min);
                const progress = getProgress(item.stok, item.max);
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{item.nama}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.kategori}</td>
                    <td className="py-3 px-4 text-right">{item.stok} {item.satuan}</td>
                    <td className="py-3 px-4">
                      <div className="bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress > 50 ? "bg-gradient-primary" : progress > 25 ? "bg-warning" : "bg-destructive"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
