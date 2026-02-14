import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronRight, Save, X, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function EditBarang() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", kode: "", category_id: "", stok: "0", stok_min: "0", stok_max: "1000", satuan: "Pcs", harga: "0", deskripsi: "" });

  useEffect(() => {
    Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("items").select("*").eq("id", id).single(),
    ]).then(([catRes, itemRes]) => {
      if (catRes.data) setCategories(catRes.data);
      if (itemRes.data) {
        const d = itemRes.data;
        setForm({
          nama: d.nama, kode: d.kode, category_id: d.category_id || "",
          stok: String(d.stok), stok_min: String(d.stok_min), stok_max: String(d.stok_max),
          satuan: d.satuan, harga: String(d.harga), deskripsi: d.deskripsi || "",
        });
      }
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("items").update({
      nama: form.nama, kode: form.kode, category_id: form.category_id || null,
      stok_min: parseInt(form.stok_min), stok_max: parseInt(form.stok_max),
      satuan: form.satuan, harga: parseFloat(form.harga), deskripsi: form.deskripsi || null,
    }).eq("id", id);
    if (error) toast.error("Gagal mengupdate: " + error.message);
    else { toast.success("Barang berhasil diperbarui!"); navigate("/barang"); }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Hapus barang ini?")) return;
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) toast.error("Gagal menghapus: " + error.message);
    else { toast.success("Barang berhasil dihapus"); navigate("/barang"); }
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
        <Link to="/barang" className="hover:text-foreground transition-colors flex items-center gap-1"><Package className="h-4 w-4" /> Data Barang</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Edit Barang</span>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Edit Barang</h2>
        <p className="text-muted-foreground">Ubah informasi barang</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Kode Barang</label>
              <input className={inputClass} value={form.kode} onChange={(e) => setForm({...form, kode: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Barang</label>
              <input className={inputClass} value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select className={inputClass} value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})}>
                <option value="">-- Pilih --</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Satuan</label>
              <select className={inputClass} value={form.satuan} onChange={(e) => setForm({...form, satuan: e.target.value})}>
                {["Kg", "Liter", "Pcs", "Pack", "Botol", "Box"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Stok Saat Ini</label>
              <input type="number" className={`${inputClass} opacity-50`} value={form.stok} disabled />
              <p className="text-xs text-muted-foreground mt-1">Stok diubah via transaksi</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stok Min</label>
              <input type="number" className={inputClass} value={form.stok_min} onChange={(e) => setForm({...form, stok_min: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stok Max</label>
              <input type="number" className={inputClass} value={form.stok_max} onChange={(e) => setForm({...form, stok_max: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Harga Satuan (Rp)</label>
            <input type="number" className={inputClass} value={form.harga} onChange={(e) => setForm({...form, harga: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea className={`${inputClass} min-h-[80px]`} value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} />
          </div>
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="gradient" type="submit" disabled={loading}><Save className="h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan"}</Button>
            <Link to="/barang"><Button variant="outline"><X className="h-4 w-4" /> Batal</Button></Link>
            <Button type="button" variant="gradientDanger" className="ml-auto" onClick={handleDelete}><Trash2 className="h-4 w-4" /> Hapus</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
