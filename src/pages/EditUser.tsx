import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronRight, Save, X, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const dummyUsers: Record<string, { name: string; email: string; username: string; role: string; status: string; joinDate: string }> = {
  "1": { name: "Admin User", email: "admin@inventory.local", username: "admin", role: "admin", status: "aktif", joinDate: "01 Jan 2025" },
  "2": { name: "Staff Manager", email: "staff@inventory.local", username: "staff_manager", role: "staff", status: "aktif", joinDate: "05 Feb 2025" },
  "3": { name: "Operator A", email: "operator.a@inventory.local", username: "operator_a", role: "staff", status: "aktif", joinDate: "10 Mar 2025" },
  "4": { name: "Operator B", email: "operator.b@inventory.local", username: "operator_b", role: "staff", status: "nonaktif", joinDate: "15 Apr 2025" },
  "5": { name: "Viewer User", email: "viewer@inventory.local", username: "viewer", role: "viewer", status: "aktif", joinDate: "20 May 2025" },
};

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = dummyUsers[id || "1"] || dummyUsers["1"];

  const [form, setForm] = useState({
    nama: userData.name,
    email: userData.email,
    username: userData.username,
    password: "",
    role: userData.role,
    status: userData.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.email) { toast.error("Lengkapi field wajib"); return; }
    toast.success("User berhasil diperbarui!");
    navigate("/admin/users");
  };

  const handleDelete = () => {
    if (confirm("Hapus user ini?")) {
      toast.success("User berhasil dihapus");
      navigate("/admin/users");
    }
  };

  const inputClass = "w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
        <Link to="/admin/users" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Users className="h-4 w-4" /> Manajemen User
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Edit User</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold">Edit User</h2>
        <p className="text-muted-foreground">Ubah informasi pengguna sistem</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        {/* User Info */}
        <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
            {userData.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-muted-foreground text-sm">User ID: USER-{String(id).padStart(4, "0")}</p>
            <p className="font-semibold">{userData.name}</p>
            <p className="text-muted-foreground text-sm">Bergabung: {userData.joinDate}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
            <input className={inputClass} value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input className={inputClass} value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reset Password (Opsional)</label>
            <p className="text-muted-foreground text-xs mb-2">Kosongkan jika tidak ingin mengubah password</p>
            <input type="password" className={inputClass} placeholder="Password baru" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select className={inputClass} value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value="aktif" checked={form.status === "aktif"} onChange={() => setForm({...form, status: "aktif"})} />
                <span>Aktif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value="nonaktif" checked={form.status === "nonaktif"} onChange={() => setForm({...form, status: "nonaktif"})} />
                <span>Non-Aktif</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="gradient" type="submit"><Save className="h-4 w-4" /> Simpan Perubahan</Button>
            <Link to="/admin/users"><Button variant="outline"><X className="h-4 w-4" /> Batal</Button></Link>
            <Button type="button" variant="gradientDanger" className="ml-auto" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" /> Hapus User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
