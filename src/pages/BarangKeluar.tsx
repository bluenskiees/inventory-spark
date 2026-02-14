import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpCircle, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ItemRow { item_id: string; qty: string; satuan: string; tujuan: string; }

export default function BarangKeluar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [penerima, setPenerima] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<ItemRow[]>([{ item_id: "", qty: "", satuan: "", tujuan: "" }]);
  const [barangList, setBarangList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("items").select("id, nama, satuan, stok").order("nama").then(({ data }) => {
      if (data) setBarangList(data);
    });
  }, []);

  const addRow = () => setItems([...items, { item_id: "", qty: "", satuan: "", tujuan: "" }]);
  const removeRow = (i: number) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof ItemRow, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    if (field === "item_id") {
      const found = barangList.find((b: any) => b.id === value);
      if (found) updated[i].satuan = found.satuan;
    }
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penerima) { toast.error("Penerima wajib diisi"); return; }
    if (items.some((r) => !r.item_id || !r.qty)) { toast.error("Lengkapi data barang"); return; }

    // Check stock availability
    for (const row of items) {
      const item = barangList.find((b: any) => b.id === row.item_id);
      if (item && parseInt(row.qty) > item.stok) {
        toast.error(`Stok ${item.nama} tidak cukup (tersedia: ${item.stok})`);
        return;
      }
    }

    setLoading(true);
    const { data: tx, error: txError } = await supabase.from("transactions").insert({
      type: "keluar" as any,
      tanggal,
      supplier_or_target: penerima,
      status: "selesai" as any,
      created_by: user?.id,
    }).select().single();

    if (txError) { toast.error("Gagal: " + txError.message); setLoading(false); return; }

    const txItems = items.map((r) => ({
      transaction_id: tx.id,
      item_id: r.item_id,
      qty: parseInt(r.qty),
      satuan: r.satuan,
      keterangan: r.tujuan || null,
    }));

    const { error: itemsError } = await supabase.from("transaction_items").insert(txItems);
    if (itemsError) toast.error("Gagal menyimpan item: " + itemsError.message);
    else { toast.success("Transaksi barang keluar berhasil!"); navigate("/transaksi/riwayat"); }
    setLoading(false);
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

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
                    <select className={inputClass} value={row.item_id} onChange={(e) => updateRow(i, "item_id", e.target.value)} required>
                      <option value="">Pilih Barang</option>
                      {barangList.map((b: any) => <option key={b.id} value={b.id}>{b.nama} (stok: {b.stok})</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input type="number" className={inputClass} placeholder="Qty" value={row.qty} onChange={(e) => updateRow(i, "qty", e.target.value)} required min="1" />
                  </div>
                  <div className="col-span-2">
                    <input className={inputClass} placeholder="Satuan" value={row.satuan} readOnly />
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
            <Button variant="gradient" type="submit" disabled={loading}><Save className="h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Transaksi"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
