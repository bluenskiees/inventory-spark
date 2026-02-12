import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Save, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TambahBarang() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", kode: "", kategori: "", stok: "", satuan: "", harga: "", deskripsi: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.kode) { toast.error("Nama dan kode barang wajib diisi"); return; }
    toast.success("Barang berhasil ditambahkan!");
    navigate("/barang");
  };

  const inputClass = "w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
        <Link to="/barang" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Package className="h-4 w-4" /> Data Barang
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Tambah Barang</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold">Tambah Barang Baru</h2>
        <p className="text-muted-foreground">Formulir untuk menambahkan barang baru ke inventory</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Kode Barang</label>
              <input className={inputClass} placeholder="BRG-007" value={form.kode} onChange={(e) => setForm({...form, kode: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Barang</label>
              <input className={inputClass} placeholder="Nama barang" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select className={inputClass} value={form.kategori} onChange={(e) => setForm({...form, kategori: e.target.value})} required>
                <option value="">-- Pilih Kategori --</option>
                <option value="Bahan Baku">Bahan Baku</option>
                <option value="Packaging">Packaging</option>
                <option value="Peralatan">Peralatan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Satuan</label>
              <select className={inputClass} value={form.satuan} onChange={(e) => setForm({...form, satuan: e.target.value})} required>
                <option value="">-- Pilih Satuan --</option>
                <option value="Kg">Kg</option>
                <option value="Liter">Liter</option>
                <option value="Pcs">Pcs</option>
                <option value="Pack">Pack</option>
                <option value="Botol">Botol</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Stok Awal</label>
              <input type="number" className={inputClass} placeholder="0" value={form.stok} onChange={(e) => setForm({...form, stok: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Harga Satuan (Rp)</label>
              <input type="number" className={inputClass} placeholder="0" value={form.harga} onChange={(e) => setForm({...form, harga: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea className={`${inputClass} min-h-[80px]`} placeholder="Deskripsi barang (opsional)" value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} />
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="gradient" type="submit"><Save className="h-4 w-4" /> Simpan</Button>
            <Link to="/barang"><Button variant="outline"><X className="h-4 w-4" /> Batal</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
