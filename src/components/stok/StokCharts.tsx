import { TrendingUp, Activity, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ["hsl(222, 84%, 24%)", "hsl(168, 42%, 35%)", "hsl(21, 79%, 57%)", "hsl(349, 81%, 45%)", "hsl(217, 91%, 60%)", "hsl(280, 60%, 50%)"];
const tooltipStyle = { backgroundColor: "hsl(232, 38%, 16%)", border: "1px solid hsl(229, 19%, 22%)", borderRadius: "8px", color: "#fff" };

interface Props {
  trendData: any[];
  categoryDistribution: any[];
  stockMovement: any[];
  items: any[];
}

export default function StokCharts({ trendData, categoryDistribution, stockMovement, items }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </>
  );
}
