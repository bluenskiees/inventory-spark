import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Boxes, Mail, Lock, Eye, EyeOff, UserPlus, User, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) { toast.error("Nama lengkap wajib diisi"); return; }
    if (!form.email.trim()) { toast.error("Email wajib diisi"); return; }
    if (form.password.length < 6) { toast.error("Password minimal 6 karakter"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Password tidak cocok"); return; }

    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.fullName, form.username);
    if (error) {
      toast.error(error.message || "Registrasi gagal");
    } else {
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-2xl">
          {/* Left Side */}
          <div className="bg-gradient-primary hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden animate-slide-in-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />
            <div className="relative z-10 text-center">
              <Boxes className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-primary-foreground mb-4">Inventory Pro</h1>
              <p className="text-primary-foreground/80 text-lg">Bergabung untuk mengelola inventory bisnis Anda</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-card p-8 md:p-12 flex flex-col justify-center animate-slide-in-right">
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <UserPlus className="h-7 w-7" /> Daftar
                </h2>
                <p className="text-muted-foreground text-sm">Buat akun baru</p>
              </div>

              <form className="space-y-4" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-medium mb-2"><User className="inline h-4 w-4 mr-2" />Nama Lengkap</label>
                  <input className={inputClass} placeholder="Nama lengkap" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2"><AtSign className="inline h-4 w-4 mr-2" />Username</label>
                  <input className={inputClass} placeholder="Username" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2"><Mail className="inline h-4 w-4 mr-2" />Email</label>
                  <input type="email" className={inputClass} placeholder="email@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2"><Lock className="inline h-4 w-4 mr-2" />Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} className={inputClass} placeholder="Min 6 karakter" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2"><Lock className="inline h-4 w-4 mr-2" />Konfirmasi</label>
                    <input type={showPassword ? "text" : "password"} className={inputClass} placeholder="Ulangi password" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} required />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                  Tampilkan password
                </label>

                <Button variant="gradient" className="w-full py-3 text-base" type="submit" disabled={loading}>
                  <UserPlus className="h-4 w-4" />
                  {loading ? "Memproses..." : "Daftar"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-info-foreground hover:underline font-medium">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
