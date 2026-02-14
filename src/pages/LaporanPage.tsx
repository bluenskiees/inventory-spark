import { useState, useEffect } from "react";
import { FileText, ArrowDownCircle, ArrowUpCircle, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";

type Tab = "masuk" | "keluar" | "stok";

export default function LaporanPage() {
  const [tab, setTab] = useState<Tab>("masuk");
  const [txMasuk, setTxMasuk] = useState<any[]>([]);
  const [txKeluar, setTxKeluar] = useState<any[]>([]);
  const [stokData, setStokData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: masuk } = await supabase
        .from("transactions")
        .select("tanggal, supplier_or_target, transaction_items(qty, satuan, items(nama, harga))")
        .eq("type", "masuk")
        .order("tanggal", { ascending: false });
      if (masuk) setTxMasuk(masuk.flatMap((tx: any) =>
        tx.transaction_items?.map((ti: any) => ({
          tanggal: tx.tanggal, nama: ti.items?.nama, qty: `${ti.qty} ${ti.satuan}`,
          supplier: tx.supplier_or_target, total: `Rp ${((ti.items?.harga || 0) * ti.qty).toLocaleString("id-ID")}`,
        })) || []
      ));

      const { data: keluar } = await supabase
        .from("transactions")
        .select("tanggal, supplier_or_target, transaction_items(qty, satuan, items(nama, harga))")
        .eq("type", "keluar")
        .order("tanggal", { ascending: false });
      if (keluar) setTxKeluar(keluar.flatMap((tx: any) =>
        tx.transaction_items?.map((ti: any) => ({
          tanggal: tx.tanggal, nama: ti.items?.nama, qty: `${ti.qty} ${ti.satuan}`,
          tujuan: tx.supplier_or_target, total: `Rp ${((ti.items?.harga || 0) * ti.qty).toLocaleString("id-ID")}`,
        })) || []
      ));

      const { data: items } = await supabase.from("items").select("nama, stok, stok_min, stok_max, satuan").order("nama");
      if (items) setStokData(items.map((i: any) => ({
        ...i,
        status: i.stok <= i.stok_min * 0.5 ? "Kritis" : i.stok <= i.stok_min ? "Rendah" : "Normal",
      })));
    };
    fetchAll();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Laporan Inventory", 14, 22);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 30);

    if (tab === "masuk") {
      (doc as any).autoTable({
        startY: 40, head: [["Tanggal", "Nama Barang", "Jumlah", "Supplier", "Total"]],
        body: txMasuk.map((r) => [r.tanggal, r.nama, r.qty, r.supplier, r.total]),
        theme: "grid", headStyles: { fillColor: [10, 36, 114] },
      });
    } else if (tab === "keluar") {
      (doc as any).autoTable({
        startY: 40, head: [["Tanggal", "Nama Barang", "Jumlah", "Tujuan", "Total"]],
        body: txKeluar.map((r) => [r.tanggal, r.nama, r.qty, r.tujuan, r.total]),
        theme: "grid", headStyles: { fillColor: [10, 36, 114] },
      });
    } else {
      (doc as any).autoTable({
        startY: 40, head: [["Nama Barang", "Stok", "Min", "Max", "Status"]],
        body: stokData.map((r: any) => [r.nama, `${r.stok} ${r.satuan}`, r.stok_min, r.stok_max, r.status]),
        theme: "grid", headStyles: { fillColor: [10, 36, 114] },
      });
    }

    doc.save(`laporan-${tab}-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF berhasil diexport!");
  };

  const tabs: { key: Tab; label: string; icon: typeof FileText }[] = [
    { key: "masuk", label: "Barang Masuk", icon: ArrowDownCircle },
    { key: "keluar", label: "Barang Keluar", icon: ArrowUpCircle },
    { key: "stok", label: "Laporan Stok", icon: BarChart3 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2"><FileText className="h-8 w-8 text-primary" /> Laporan</h2>
          <p className="text-muted-foreground">Laporan lengkap transaksi dan stok barang</p>
        </div>
        <Button variant="gradient" onClick={exportPDF}><Download className="h-4 w-4" /> Export PDF</Button>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${tab === t.key ? "bg-gradient-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {tab === "masuk" && (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tanggal</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Supplier</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
              </tr></thead>
              <tbody>
                {txMasuk.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Belum ada data</td></tr>
                  : txMasuk.map((r, i) => (
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
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tanggal</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tujuan</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
              </tr></thead>
              <tbody>
                {txKeluar.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Belum ada data</td></tr>
                  : txKeluar.map((r, i) => (
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
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stok</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Min</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Max</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr></thead>
              <tbody>
                {stokData.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Belum ada data</td></tr>
                  : stokData.map((r: any, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{r.nama}</td>
                    <td className="py-3 px-4 text-right">{r.stok} {r.satuan}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{r.stok_min}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{r.stok_max}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === "Normal" ? "bg-success/30 text-success-foreground" : r.status === "Rendah" ? "bg-warning/30 text-warning-foreground" : "bg-destructive/30 text-destructive-foreground"}`}>{r.status}</span>
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
