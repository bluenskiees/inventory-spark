import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Save, X, Users, User, Mail, Lock, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function TambahUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", username: "", password: "", confirmPassword: "", role: "staff" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.username) { toast.error("Lengkapi semua field wajib"); return; }
    if (form.password.length < 6) { toast.error("Password minimal 6 karakter"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Password tidak cocok"); return; }

    setLoading(true);
    // Create user via auth signup - profile & role created by trigger
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.nama, username: form.username },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) { toast.error("Gagal: " + error.message); setLoading(false); return; }

    // Update role if not default staff
    if (data.user && form.role !== "staff") {
      await supabase.from("user_roles").update({ role: form.role as any }).eq("user_id", data.user.id);
    }

    toast.success("User berhasil ditambahkan!");
    navigate("/admin/users");
    setLoading(false);
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
        <Link to="/admin/users" className="hover:text-foreground transition-colors flex items-center gap-1"><Users className="h-4 w-4" /> Manajemen User</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Tambah User Baru</span>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Tambah User Baru</h2>
        <p className="text-muted-foreground">Formulir untuk menambahkan pengguna baru ke sistem</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2"><User className="inline h-4 w-4 mr-2" />Nama Lengkap</label>
            <input className={inputClass} placeholder="Masukkan nama lengkap" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2"><Mail className="inline h-4 w-4 mr-2" />Email</label>
            <input type="email" className={inputClass} placeholder="user@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2"><AtSign className="inline h-4 w-4 mr-2" />Username</label>
            <input className={inputClass} placeholder="username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2"><Lock className="inline h-4 w-4 mr-2" />Password</label>
              <input type="password" className={inputClass} placeholder="Min 6 karakter" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2"><Lock className="inline h-4 w-4 mr-2" />Konfirmasi</label>
              <input type="password" className={inputClass} placeholder="Ulangi password" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select className={inputClass} value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} required>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="gradient" type="submit" disabled={loading}><Save className="h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan User"}</Button>
            <Link to="/admin/users"><Button variant="outline"><X className="h-4 w-4" /> Batal</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
