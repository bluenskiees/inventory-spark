import { useEffect, useState } from "react";
import { User, Edit, CheckCircle, LogIn as LogInIcon, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Home() {
  const { profile, role, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", username: "" });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name, username: profile.username || "" });
    }
  }, [profile]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("transactions")
        .select("type, created_at, supplier_or_target")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setRecentActivity(data);
    };
    fetchActivity();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      username: form.username,
    }).eq("user_id", user.id);
    if (error) toast.error("Gagal menyimpan: " + error.message);
    else { toast.success("Profil berhasil diperbarui"); setEditing(false); }
  };

  const inputClass = "bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all";

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Home</h2>
        <p className="text-muted-foreground">Selamat datang di Inventory Pro</p>
      </div>

      <div className="bg-gradient-primary rounded-xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-primary-foreground mb-2">Selamat Datang Kembali, {profile?.full_name || "User"}! 👋</h3>
        <p className="text-primary-foreground/80">Kelola inventory bisnis Anda dengan mudah dan efisien</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profil Saya</h3>
            {editing ? (
              <div className="flex gap-2">
                <Button variant="gradient" size="sm" onClick={handleSave}>Simpan</Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Batal</Button>
              </div>
            ) : (
              <Button variant="gradient" size="sm" onClick={() => setEditing(true)}><Edit className="h-4 w-4" /> Edit</Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Nama Lengkap</label>
              {editing ? <input className={inputClass} value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} />
                : <p className="font-medium">{profile?.full_name || "-"}</p>}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="font-medium">{user?.email || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Username</label>
              {editing ? <input className={inputClass} value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
                : <p className="font-medium">{profile?.username || "-"}</p>}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Role</label>
              <p className="font-medium capitalize">{role || "Staff"}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold">Info Cepat</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/30 text-success-foreground text-xs font-medium">
                <CheckCircle className="h-3 w-3" /> Aktif
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize">{role || "Staff"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Terdaftar</span>
              <span className="text-sm font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> Aktivitas Terbaru
        </h3>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-sm">Belum ada aktivitas</p>
          ) : recentActivity.map((a, i) => (
            <div key={i} className={`flex items-center gap-4 ${i < recentActivity.length - 1 ? "pb-3 border-b border-border/50" : ""}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.type === "masuk" ? "bg-success/20 text-success-foreground" : "bg-warning/20 text-warning-foreground"}`}>
                {a.type === "masuk" ? <LogInIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">Transaksi {a.type} - {a.supplier_or_target}</p>
                <p className="text-muted-foreground text-sm">{new Date(a.created_at).toLocaleString("id-ID")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
