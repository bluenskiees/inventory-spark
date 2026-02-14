import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronRight, Save, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", username: "", status: "active", role: "staff" });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (profile) {
        setForm({ full_name: profile.full_name, username: profile.username || "", status: profile.status, role: "staff" });
        const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", profile.user_id).single();
        if (roleData) setForm((prev) => ({ ...prev, role: roleData.role }));
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: profile } = await supabase.from("profiles").select("user_id").eq("id", id).single();
    if (!profile) { toast.error("User tidak ditemukan"); setLoading(false); return; }

    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      username: form.username,
      status: form.status,
    }).eq("id", id);

    if (error) { toast.error("Gagal: " + error.message); setLoading(false); return; }

    // Update role
    await supabase.from("user_roles").update({ role: form.role as any }).eq("user_id", profile.user_id);

    toast.success("User berhasil diperbarui!");
    navigate("/admin/users");
    setLoading(false);
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
        <Link to="/admin/users" className="hover:text-foreground transition-colors flex items-center gap-1"><Users className="h-4 w-4" /> Manajemen User</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Edit User</span>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Edit User</h2>
        <p className="text-muted-foreground">Ubah informasi pengguna sistem</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
            <input className={inputClass} value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input className={inputClass} value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
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
                <input type="radio" name="status" value="active" checked={form.status === "active"} onChange={() => setForm({...form, status: "active"})} />
                <span>Aktif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value="inactive" checked={form.status === "inactive"} onChange={() => setForm({...form, status: "inactive"})} />
                <span>Non-Aktif</span>
              </label>
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="gradient" type="submit" disabled={loading}><Save className="h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan"}</Button>
            <Link to="/admin/users"><Button variant="outline"><X className="h-4 w-4" /> Batal</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
