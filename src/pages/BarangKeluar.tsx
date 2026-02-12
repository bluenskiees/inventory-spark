import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpCircle, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ItemRow { barang: string; qty: string; satuan: string; tujuan: string; }

export default function BarangKeluar() {
  const navigate = useNavigate();
  const [penerima, setPenerima] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<ItemRow[]>([{ barang: "", qty: "", satuan: "", tujuan: "" }]);

  const addRow = () => setItems([...items, { barang: "", qty: "", satuan: "", tujuan: "" }]);
  const removeRow = (i: number) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof ItemRow, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!penerima) { toast.error("Penerima wajib diisi"); return; }
    if (items.some((r) => !r.barang || !r.qty)) { toast.error("Lengkapi data barang"); return; }
    toast.success("Transaksi barang keluar berhasil disimpan!");
    navigate("/transaksi/riwayat");
  };

  const inputClass = "w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <ArrowUpCircle className="h-8 w-8 text-warning-foreground" /> Barang Keluar
        </h2>
        <p className="text-muted-foreground">Catat transaksi barang keluar dari gudang</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">Penerima / Tujuan</label>
              <input className={inputClass} placeholder="Nama penerima" value={penerima} onChange={(e) => setPenerima(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal</label>
              <input type="date" className={inputClass} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium">Daftar Barang</label>
              <Button type="button" variant="outline" size="sm" onClick={addRow}><Plus className="h-3 w-3" /> Tambah</Button>
            </div>
            <div className="space-y-3">
              {items.map((row, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-4">
                    <select className={inputClass} value={row.barang} onChange={(e) => updateRow(i, "barang", e.target.value)} required>
                      <option value="">Pilih Barang</option>
                      <option value="Biji Kopi Arabica">Biji Kopi Arabica</option>
                      <option value="Gelas Plastik 16oz">Gelas Plastik 16oz</option>
                      <option value="Susu Full Cream">Susu Full Cream</option>
                      <option value="Gula Pasir">Gula Pasir</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input type="number" className={inputClass} placeholder="Qty" value={row.qty} onChange={(e) => updateRow(i, "qty", e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <select className={inputClass} value={row.satuan} onChange={(e) => updateRow(i, "satuan", e.target.value)}>
                      <option value="">Satuan</option>
                      <option value="Kg">Kg</option>
                      <option value="Liter">Liter</option>
                      <option value="Pcs">Pcs</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input className={inputClass} placeholder="Tujuan" value={row.tujuan} onChange={(e) => updateRow(i, "tujuan", e.target.value)} />
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(i)} className="text-destructive hover:bg-destructive/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="gradient" type="submit"><Save className="h-4 w-4" /> Simpan Transaksi</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
