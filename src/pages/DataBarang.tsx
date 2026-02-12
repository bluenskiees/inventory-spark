import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const dummyBarang = [
  { id: 1, kode: "BRG-001", nama: "Biji Kopi Arabica", kategori: "Bahan Baku", stok: 50, satuan: "Kg", harga: 150000 },
  { id: 2, kode: "BRG-002", nama: "Gelas Plastik 16oz", kategori: "Packaging", stok: 500, satuan: "Pcs", harga: 500 },
  { id: 3, kode: "BRG-003", nama: "Susu Full Cream", kategori: "Bahan Baku", stok: 30, satuan: "Liter", harga: 25000 },
  { id: 4, kode: "BRG-004", nama: "Gula Pasir", kategori: "Bahan Baku", stok: 25, satuan: "Kg", harga: 18000 },
  { id: 5, kode: "BRG-005", nama: "Sedotan", kategori: "Packaging", stok: 200, satuan: "Pack", harga: 15000 },
  { id: 6, kode: "BRG-006", nama: "Sirup Vanilla", kategori: "Bahan Baku", stok: 8, satuan: "Botol", harga: 85000 },
];

export default function DataBarang() {
  const [search, setSearch] = useState("");
  const [data] = useState(dummyBarang);

  const filtered = data.filter((b) =>
    b.nama.toLowerCase().includes(search.toLowerCase()) ||
    b.kode.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Hapus barang ini?")) toast.success("Barang berhasil dihapus");
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

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari barang..."
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
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
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{item.kode}</td>
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> {item.nama}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{item.kategori}</td>
                  <td className="py-3 px-4 text-right">{item.stok} {item.satuan}</td>
                  <td className="py-3 px-4 text-right">Rp {item.harga.toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <Button variant="gradient" size="sm"><Edit className="h-3 w-3" /> Edit</Button>
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
