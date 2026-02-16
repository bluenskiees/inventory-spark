import { useEffect, useState } from "react";
import { Package, ArrowDownCircle, ArrowUpCircle, AlertTriangle, CheckCircle, ArrowRight, Settings, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["hsl(222, 84%, 24%)", "hsl(168, 42%, 35%)", "hsl(21, 79%, 57%)", "hsl(349, 81%, 45%)", "hsl(217, 91%, 60%)"];

type WidgetKey = "stats" | "weeklyTrend" | "categoryPie" | "recentTx" | "stockAlerts";

const WIDGET_LABELS: Record<WidgetKey, string> = {
  stats: "Kartu Statistik",
  weeklyTrend: "Tren Mingguan",
  categoryPie: "Distribusi Kategori",
  recentTx: "Transaksi Terbaru",
  stockAlerts: "Peringatan Stok",
};

function getDefaultWidgets(): Record<WidgetKey, boolean> {
  const saved = localStorage.getItem("dashboard-widgets");
  if (saved) return JSON.parse(saved);
  return { stats: true, weeklyTrend: true, categoryPie: true, recentTx: true, stockAlerts: true };
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalItems: 0, masukToday: 0, keluarToday: 0, lowStock: 0, criticalStock: 0 });
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [widgets, setWidgets] = useState<Record<WidgetKey, boolean>>(getDefaultWidgets);

  const toggleWidget = (key: WidgetKey) => {
    const updated = { ...widgets, [key]: !widgets[key] };
    setWidgets(updated);
    localStorage.setItem("dashboard-widgets", JSON.stringify(updated));
  };

  const fetchData = async () => {
    const today = new Date().toISOString().split("T")[0];

    const [itemsRes, masukRes, keluarRes, recentRes] = await Promise.all([
      supabase.from("items").select("id", { count: "exact", head: true }),
      supabase.from("transactions").select("id", { count: "exact", head: true }).eq("type", "masuk").gte("tanggal", today),
      supabase.from("transactions").select("id", { count: "exact", head: true }).eq("type", "keluar").gte("tanggal", today),
      supabase.from("transactions").select("*, transaction_items(*, items(nama))").order("created_at", { ascending: false }).limit(5),
    ]);

    // Fetch all items for low stock calculation (can't compare columns in PostgREST)
    const { data: allItems } = await supabase.from("items").select("id, nama, stok, stok_min, satuan, category_id, categories(name)");
    const lowItems = allItems?.filter((i: any) => i.stok <= i.stok_min) || [];
    const criticalItems = allItems?.filter((i: any) => i.stok <= i.stok_min * 0.5) || [];

    setStats({
      totalItems: itemsRes.count || 0,
      masukToday: masukRes.count || 0,
      keluarToday: keluarRes.count || 0,
      lowStock: lowItems.length,
      criticalStock: criticalItems.length,
    });

    // Sort by urgency: critical first, then low
    setLowStockItems(
      lowItems
        .map((item: any) => ({
          ...item,
          severity: item.stok <= item.stok_min * 0.5 ? "critical" : "low",
          percentage: item.stok_min > 0 ? Math.round((item.stok / item.stok_min) * 100) : 100,
        }))
        .sort((a: any, b: any) => a.percentage - b.percentage)
        .slice(0, 5)
    );

    // Category distribution
    const catMap: Record<string, number> = {};
    allItems?.forEach((item: any) => {
      const catName = item.categories?.name || "Lainnya";
      catMap[catName] = (catMap[catName] || 0) + 1;
    });
    setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

    // Recent transactions
    if (recentRes.data) {
      setRecentTx(recentRes.data.map((tx: any) => ({
        time: new Date(tx.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        name: tx.transaction_items?.[0]?.items?.nama || tx.supplier_or_target,
        type: tx.type,
        qty: tx.transaction_items?.reduce((sum: number, ti: any) => sum + ti.qty, 0) || 0,
        status: tx.status,
      })));
    }

    // Weekly data (last 7 days)
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    const { data: weekTx } = await supabase
      .from("transactions")
      .select("type, tanggal")
      .gte("tanggal", days[0])
      .lte("tanggal", days[6]);

    setWeeklyData(days.map((day) => {
      const dayName = new Date(day).toLocaleDateString("id-ID", { weekday: "short" });
      const masuk = weekTx?.filter((t: any) => t.tanggal === day && t.type === "masuk").length || 0;
      const keluar = weekTx?.filter((t: any) => t.tanggal === day && t.type === "keluar").length || 0;
      return { name: dayName, masuk, keluar };
    }));
  };

  useEffect(() => {
    fetchData();
    const channel = supabase.channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const statCards = [
    { label: "Total Jenis Barang", value: stats.totalItems, icon: Package, gradient: "bg-gradient-primary" },
    { label: "Barang Masuk Hari Ini", value: stats.masukToday, icon: ArrowDownCircle, gradient: "bg-gradient-success" },
    { label: "Barang Keluar Hari Ini", value: stats.keluarToday, icon: ArrowUpCircle, gradient: "bg-gradient-warning" },
    { label: "Stok Rendah", value: stats.lowStock, icon: AlertTriangle, gradient: "bg-gradient-danger", subtitle: stats.criticalStock > 0 ? `${stats.criticalStock} kritis` : undefined },
  ];

  const tooltipStyle = { backgroundColor: "hsl(232, 38%, 16%)", border: "1px solid hsl(229, 19%, 22%)", borderRadius: "8px", color: "#fff" };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Ringkasan Sistem Inventory Anda</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
          title="Kustomisasi Dashboard"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Widget Settings */}
      {showSettings && (
        <div className="bg-card border border-border rounded-xl p-4 animate-fade-in">
          <h4 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">Tampilkan Widget</h4>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(WIDGET_LABELS) as WidgetKey[]).map((key) => (
              <button
                key={key}
                onClick={() => toggleWidget(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  widgets[key]
                    ? "bg-primary/20 text-primary-foreground border border-primary/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {widgets[key] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {WIDGET_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      {widgets.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.label} className={`${stat.gradient} rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-primary-foreground/70 text-sm mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-primary-foreground">{stat.value}</h3>
                  {stat.subtitle && <p className="text-xs text-destructive-foreground mt-1">{stat.subtitle}</p>}
                </div>
                <stat.icon className="h-10 w-10 text-primary-foreground/30" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stock Alerts */}
      {widgets.stockAlerts && lowStockItems.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-foreground" />
              Peringatan Stok
            </h3>
            <Link to="/stok" className="text-info-foreground text-sm hover:underline flex items-center gap-1">
              Lihat Detail <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item: any) => (
              <div
                key={item.id}
                className={`rounded-lg p-4 border ${
                  item.severity === "critical"
                    ? "bg-destructive/10 border-destructive/30"
                    : "bg-warning/10 border-warning/30"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">{item.nama}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.severity === "critical"
                      ? "bg-destructive/30 text-destructive-foreground"
                      : "bg-warning/30 text-warning-foreground"
                  }`}>
                    {item.severity === "critical" ? "Kritis" : "Rendah"}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{item.stok} <span className="text-xs text-muted-foreground font-normal">{item.satuan}</span></p>
                    <p className="text-xs text-muted-foreground">Min: {item.stok_min}</p>
                  </div>
                  <div className="w-16">
                    <div className="bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.severity === "critical" ? "bg-destructive" : "bg-warning"}`}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right mt-1">{item.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        {widgets.weeklyTrend && (
          <div className={`${widgets.categoryPie ? "lg:col-span-2" : "lg:col-span-3"} bg-card border border-border rounded-xl p-6`}>
            <h3 className="text-lg font-bold mb-4">Tren Transaksi Mingguan</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(229, 19%, 22%)" />
                <XAxis dataKey="name" stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <YAxis stroke="hsl(0, 0%, 60%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="masuk" fill="hsl(168, 42%, 35%)" radius={[4, 4, 0, 0]} name="Masuk" />
                <Bar dataKey="keluar" fill="hsl(21, 79%, 57%)" radius={[4, 4, 0, 0]} name="Keluar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Pie */}
        {widgets.categoryPie && (
          <div className={`${widgets.weeklyTrend ? "" : "lg:col-span-3"} bg-card border border-border rounded-xl p-6`}>
            <h3 className="text-lg font-bold mb-4">Distribusi Kategori</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
            )}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {widgets.recentTx && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Riwayat Transaksi Terbaru</h3>
            <Link to="/transaksi/riwayat" className="text-info-foreground text-sm hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Jam</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tipe</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Jumlah</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Belum ada transaksi</td></tr>
                ) : recentTx.map((tx, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4">{tx.time}</td>
                    <td className="py-3 px-4 font-medium">{tx.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${tx.type === "masuk" ? "bg-success/30 text-success-foreground" : "bg-destructive/30 text-destructive-foreground"}`}>
                        {tx.type === "masuk" ? <ArrowDownCircle className="h-3 w-3" /> : <ArrowUpCircle className="h-3 w-3" />}
                        {tx.type === "masuk" ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{tx.qty}</td>
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
      )}
    </div>
  );
}
