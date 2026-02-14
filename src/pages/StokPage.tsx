import { useState, useEffect } from "react";
import { BarChart3, Search, AlertTriangle, CheckCircle, Package, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ["hsl(222, 84%, 24%)", "hsl(168, 42%, 35%)", "hsl(21, 79%, 57%)", "hsl(349, 81%, 45%)", "hsl(217, 91%, 60%)", "hsl(280, 60%, 50%)"];

function getStatus(stok: number, min: number) {
  if (stok <= min * 0.5) return { label: "Kritis", color: "bg-destructive/30 text-destructive-foreground" };
  if (stok <= min) return { label: "Rendah", color: "bg-warning/30 text-warning-foreground" };
  return { label: "Normal", color: "bg-success/30 text-success-foreground" };
}

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

      // Category distribution for pie chart
      const catMap: Record<string, { count: number; totalStok: number }> = {};
      data.forEach((item: any) => {
        const cat = item.categories?.name || "Lainnya";
        if (!catMap[cat]) catMap[cat] = { count: 0, totalStok: 0 };
        catMap[cat].count++;
        catMap[cat].totalStok += item.stok;
      });
      setCategoryDistribution(Object.entries(catMap).map(([name, v]) => ({ name, value: v.totalStok, count: v.count })));
    }

    // Trend data - last 14 days of transactions
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

    // Stock movement per item (top 8 items by activity)
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

  const tooltipStyle = { backgroundColor: "hsl(232, 38%, 16%)", border: "1px solid hsl(229, 19%, 22%)", borderRadius: "8px", color: "#fff" };

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

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart - 14 Day Analytics */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Tren Pergerakan Stok (14 Hari)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="masukGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(168, 42%, 35%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(168, 42%, 35%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="keluarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(21, 79%, 57%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(21, 79%, 57%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(229, 19%, 22%)" />
              <XAxis dataKey="name" stroke="hsl(0, 0%, 60%)" fontSize={11} />
              <YAxis stroke="hsl(0, 0%, 60%)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="masuk" stroke="hsl(168, 42%, 35%)" fill="url(#masukGrad)" name="Masuk" strokeWidth={2} />
              <Area type="monotone" dataKey="keluar" stroke="hsl(21, 79%, 57%)" fill="url(#keluarGrad)" name="Keluar" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution - Traffic Source Analytics */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Distribusi Stok per Kategori</h3>
          </div>
          {categoryDistribution.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={260}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={4}>
                    {categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {categoryDistribution.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.count} item · {cat.value} unit</p>
                    </div>
                    <span className="text-sm font-bold">{items.length > 0 ? Math.round((cat.value / items.reduce((s: number, it: any) => s + it.stok, 0)) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
          )}
        </div>
      </div>

      {/* Stock Movement Per Item - Data Visualization */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Pergerakan Stok per Barang (Top 8)</h3>
        </div>
        {stockMovement.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stockMovement} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(229, 19%, 22%)" />
              <XAxis type="number" stroke="hsl(0, 0%, 60%)" fontSize={11} />
              <YAxis dataKey="nama" type="category" width={140} stroke="hsl(0, 0%, 60%)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="masuk" fill="hsl(168, 42%, 35%)" name="Masuk" radius={[0, 4, 4, 0]} />
              <Bar dataKey="keluar" fill="hsl(21, 79%, 57%)" name="Keluar" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[320px] flex items-center justify-center text-muted-foreground text-sm">Belum ada data transaksi</div>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" placeholder="Cari barang..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Tidak ada data</td></tr>
              ) : filtered.map((item: any) => {
                const status = getStatus(item.stok, item.stok_min);
                const progress = Math.min((item.stok / item.stok_max) * 100, 100);
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4 font-medium">{item.nama}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.categories?.name || "-"}</td>
                    <td className="py-3 px-4 text-right">{item.stok} {item.satuan}</td>
                    <td className="py-3 px-4">
                      <div className="bg-muted rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${progress > 50 ? "bg-gradient-primary" : progress > 25 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${progress}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
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
