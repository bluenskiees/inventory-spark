function getStatus(stok: number, min: number) {
  if (stok <= min * 0.5) return { label: "Kritis", color: "bg-destructive/30 text-destructive-foreground" };
  if (stok <= min) return { label: "Rendah", color: "bg-warning/30 text-warning-foreground" };
  return { label: "Normal", color: "bg-success/30 text-success-foreground" };
}

interface Props {
  filtered: any[];
}

export default function StokTable({ filtered }: Props) {
  return (
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
  );
}
