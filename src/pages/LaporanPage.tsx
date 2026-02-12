import { useState } from "react";
import { FileText, ArrowDownCircle, ArrowUpCircle, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const laporanMasuk = [
  { tanggal: "2025-06-15", nama: "Biji Kopi", qty: "20 Kg", supplier: "PT Kopi", total: "Rp 3.000.000" },
  { tanggal: "2025-06-15", nama: "Susu Full Cream", qty: "15 L", supplier: "CV Dairy", total: "Rp 375.000" },
  { tanggal: "2025-06-14", nama: "Gula Pasir", qty: "10 Kg", supplier: "Toko Manis", total: "Rp 180.000" },
];

const laporanKeluar = [
  { tanggal: "2025-06-15", nama: "Gelas Plastik", qty: "100 Pcs", tujuan: "Outlet A", total: "Rp 50.000" },
  { tanggal: "2025-06-14", nama: "Sedotan", qty: "50 Pack", tujuan: "Outlet B", total: "Rp 750.000" },
];

const laporanStok = [
  { nama: "Biji Kopi Arabica", stok: 50, min: 10, max: 100, status: "Normal" },
  { nama: "Gelas Plastik 16oz", stok: 500, min: 100, max: 1000, status: "Normal" },
  { nama: "Susu Full Cream", stok: 30, min: 20, max: 80, status: "Warning" },
  { nama: "Sirup Vanilla", stok: 8, min: 10, max: 30, status: "Danger" },
  { nama: "Gula Pasir", stok: 25, min: 15, max: 60, status: "Normal" },
];

type Tab = "masuk" | "keluar" | "stok";

export default function LaporanPage() {
  const [tab, setTab] = useState<Tab>("masuk");

  const tabs: { key: Tab; label: string; icon: typeof FileText }[] = [
    { key: "masuk", label: "Barang Masuk", icon: ArrowDownCircle },
    { key: "keluar", label: "Barang Keluar", icon: ArrowUpCircle },
    { key: "stok", label: "Laporan Stok", icon: BarChart3 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" /> Laporan
          </h2>
          <p className="text-muted-foreground">Laporan lengkap transaksi dan stok barang</p>
        </div>
        <Button variant="gradient"><Download className="h-4 w-4" /> Export PDF</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
              tab === t.key
                ? "bg-gradient-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {tab === "masuk" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tanggal</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Supplier</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {laporanMasuk.map((r, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">{r.tanggal}</td>
                    <td className="py-3 px-4 font-medium">{r.nama}</td>
                    <td className="py-3 px-4 text-right">{r.qty}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.supplier}</td>
                    <td className="py-3 px-4 text-right font-medium">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "keluar" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tanggal</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tujuan</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {laporanKeluar.map((r, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">{r.tanggal}</td>
                    <td className="py-3 px-4 font-medium">{r.nama}</td>
                    <td className="py-3 px-4 text-right">{r.qty}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.tujuan}</td>
                    <td className="py-3 px-4 text-right font-medium">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "stok" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stok</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Min</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Max</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {laporanStok.map((r, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{r.nama}</td>
                    <td className="py-3 px-4 text-right">{r.stok}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{r.min}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{r.max}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.status === "Normal" ? "bg-success/30 text-success-foreground"
                          : r.status === "Warning" ? "bg-warning/30 text-warning-foreground"
                          : "bg-destructive/30 text-destructive-foreground"
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
