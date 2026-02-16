import { useState, useEffect } from "react";
import { BarChart3, Search, AlertTriangle, CheckCircle, Package, TrendingDown, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StokCharts from "@/components/stok/StokCharts";
import StokTable from "@/components/stok/StokTable";

export default function StokPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [stockMovement, setStockMovement] = useState<any[]>([]);

  const fetchData = async () => {
    const { data } = await supabase.from("items").select("*, categories(name)").order("nama");
    if (data) {
      setItems(data);

      const catMap: Record<string, { count: number; totalStok: number }> = {};
      data.forEach((item: any) => {
        const cat = item.categories?.name || "Lainnya";
        if (!catMap[cat]) catMap[cat] = { count: 0, totalStok: 0 };
        catMap[cat].count++;
        catMap[cat].totalStok += item.stok;
      });
      setCategoryDistribution(Object.entries(catMap).map(([name, v]) => ({ name, value: v.totalStok, count: v.count })));
    }

    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const { data: txData } = await supabase
      .from("transactions")
      .select("type, tanggal, transaction_items(qty)")
      .gte("tanggal", days[0]);

    const trend = days.map((day) => {
      const dayTx = txData?.filter((t: any) => t.tanggal === day) || [];
      const masuk = dayTx.filter((t: any) => t.type === "masuk").reduce((s: number, t: any) => s + (t.transaction_items?.reduce((a: number, ti: any) => a + ti.qty, 0) || 0), 0);
      const keluar = dayTx.filter((t: any) => t.type === "keluar").reduce((s: number, t: any) => s + (t.transaction_items?.reduce((a: number, ti: any) => a + ti.qty, 0) || 0), 0);
      return { name: new Date(day).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }), masuk, keluar, net: masuk - keluar };
    });
    setTrendData(trend);

    const itemActivity: Record<string, { nama: string; masuk: number; keluar: number }> = {};
    txData?.forEach((tx: any) => {
      tx.transaction_items?.forEach((ti: any) => {
        const item = data?.find((it: any) => it.id === ti.item_id);
        if (!item) return;
        if (!itemActivity[item.id]) itemActivity[item.id] = { nama: item.nama, masuk: 0, keluar: 0 };
        if (tx.type === "masuk") itemActivity[item.id].masuk += ti.qty;
        else itemActivity[item.id].keluar += ti.qty;
      });
    });
    setStockMovement(Object.values(itemActivity).sort((a, b) => (b.masuk + b.keluar) - (a.masuk + a.keluar)).slice(0, 8));
  };

  useEffect(() => {
    fetchData();
    const channel = supabase.channel("stok-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = items.filter((s: any) => s.nama.toLowerCase().includes(search.toLowerCase()));
  const totalItems = items.length;
  const lowStock = items.filter((s: any) => s.stok <= s.stok_min).length;
  const criticalStock = items.filter((s: any) => s.stok <= s.stok_min * 0.5).length;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2"><BarChart3 className="h-8 w-8 text-primary" /> Manajemen Stok</h2>
        <p className="text-muted-foreground">Monitor dan kelola stok barang secara real-time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Item", value: totalItems, icon: Package, color: "text-primary" },
          { label: "Stok Normal", value: totalItems - lowStock, icon: CheckCircle, color: "text-success-foreground" },
          { label: "Stok Rendah", value: lowStock - criticalStock, icon: AlertTriangle, color: "text-warning-foreground" },
          { label: "Stok Kritis", value: criticalStock, icon: TrendingDown, color: "text-destructive-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-30`} />
            </div>
          </div>
        ))}
      </div>

      <StokCharts
        trendData={trendData}
        categoryDistribution={categoryDistribution}
        stockMovement={stockMovement}
        items={items}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" placeholder="Cari barang..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <StokTable filtered={filtered} />
    </div>
  );
}
