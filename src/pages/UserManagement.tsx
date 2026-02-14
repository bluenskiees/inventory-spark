import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, ShieldCheck, UserCheck, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (!profiles) return;

    // Fetch roles for all users
    const { data: roles } = await supabase.from("user_roles").select("*");
    const roleMap: Record<string, string> = {};
    roles?.forEach((r: any) => { roleMap[r.user_id] = r.role; });

    setUsers(profiles.map((p: any) => ({
      ...p,
      role: roleMap[p.user_id] || "staff",
    })));
  };

  useEffect(() => { fetchUsers(); }, []);

  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const activeStaff = users.filter((u) => u.status === "active" && u.role !== "admin").length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Manajemen User</h2>
          <p className="text-muted-foreground">Kelola pengguna sistem inventory</p>
        </div>
        <Link to="/admin/users/tambah">
          <Button variant="gradient"><UserPlus className="h-4 w-4" /> Tambah User</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total User", value: totalUsers, icon: Users },
          { label: "Admin", value: admins, icon: ShieldCheck },
          { label: "Staff Aktif", value: activeStaff, icon: UserCheck },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
              <stat.icon className="h-8 w-8 text-primary/20" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Nama User</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Username</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Role</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Bergabung</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Tidak ada user</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
                        {user.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                      </div>
                      <span className="font-medium">{user.full_name || "-"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{user.username || "-"}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${user.role === "admin" ? "bg-primary/30 text-info-foreground" : "bg-success/30 text-success-foreground"}`}>{user.role}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${user.status === "active" ? "bg-success/30 text-success-foreground" : "bg-destructive/30 text-destructive-foreground"}`}>
                      {user.status === "active" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {user.status === "active" ? "Aktif" : "Non-Aktif"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <Link to={`/admin/users/edit/${user.id}`}>
                        <Button variant="gradient" size="sm"><Edit className="h-3 w-3" /> Edit</Button>
                      </Link>
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
