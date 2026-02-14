import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function DataBarang() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: items, error } = await supabase
      .from("items")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    if (!error && items) setData(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase.channel("items-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = data.filter((b: any) =>
    b.nama.toLowerCase().includes(search.toLowerCase()) ||
    b.kode.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus barang ini?")) return;
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus: " + error.message);
    else toast.success("Barang berhasil dihapus");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Data Barang</h2>
          <p className="text-muted-foreground">Kelola data barang inventory</p>
        </div>
        <Link to="/barang/tambah">
          <Button variant="gradient"><Plus className="h-4 w-4" /> Tambah Barang</Button>
        </Link>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari barang..."
          className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Kode</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama Barang</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Kategori</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stok</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Harga</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Tidak ada data barang</td></tr>
              ) : filtered.map((item: any) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{item.kode}</td>
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> {item.nama}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{item.categories?.name || "-"}</td>
                  <td className="py-3 px-4 text-right">{item.stok} {item.satuan}</td>
                  <td className="py-3 px-4 text-right">Rp {Number(item.harga).toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <Link to={`/barang/edit/${item.id}`}>
                        <Button variant="gradient" size="sm"><Edit className="h-3 w-3" /> Edit</Button>
                      </Link>
                      <Button variant="gradientDanger" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" /> Hapus
                      </Button>
                    </div>
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
