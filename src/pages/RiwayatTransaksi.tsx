import { useState, useEffect } from "react";
import { History, ArrowDownCircle, ArrowUpCircle, CheckCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function RiwayatTransaksi() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "masuk" | "keluar">("all");
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchData = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*, transaction_items(qty, satuan, items(nama))")
      .order("created_at", { ascending: false });
    if (data) setTransactions(data);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase.channel("tx-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = transactions
    .filter((t: any) => filter === "all" || t.type === filter)
    .filter((t: any) => {
      const itemNames = t.transaction_items?.map((ti: any) => ti.items?.nama || "").join(" ");
      return (itemNames + t.supplier_or_target).toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <History className="h-8 w-8 text-primary" /> Riwayat Transaksi
        </h2>
        <p className="text-muted-foreground">Semua riwayat transaksi barang masuk dan keluar</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text" placeholder="Cari transaksi..."
            className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "masuk", "keluar"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${filter === f ? "bg-gradient-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"}`}>
              {f === "all" ? "Semua" : f === "masuk" ? "Masuk" : "Keluar"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tanggal</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Barang</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipe</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Supplier/Tujuan</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Belum ada transaksi</td></tr>
              ) : filtered.map((tx: any) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground">{tx.tanggal}</td>
                  <td className="py-3 px-4 font-medium">{tx.transaction_items?.map((ti: any) => ti.items?.nama).filter(Boolean).join(", ") || "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${tx.type === "masuk" ? "bg-success/30 text-success-foreground" : "bg-destructive/30 text-destructive-foreground"}`}>
                      {tx.type === "masuk" ? <ArrowDownCircle className="h-3 w-3" /> : <ArrowUpCircle className="h-3 w-3" />}
                      {tx.type === "masuk" ? "Masuk" : "Keluar"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">{tx.transaction_items?.reduce((s: number, ti: any) => s + ti.qty, 0) || 0}</td>
                  <td className="py-3 px-4 text-muted-foreground">{tx.supplier_or_target}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${tx.status === "selesai" ? "bg-success/30 text-success-foreground" : "bg-warning/30 text-warning-foreground"}`}>
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
