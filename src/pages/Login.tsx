import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Boxes, Mail, Lock, Eye, EyeOff, LogIn, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Email/Username tidak boleh kosong"); return; }
    if (!password.trim()) { toast.error("Password tidak boleh kosong"); return; }
    if (password.length < 6) { toast.error("Password minimal 6 karakter"); return; }

    setLoading(true);
    // Demo login
    setTimeout(() => {
      if ((email === "admin" || email === "admin@inventory.local") && password === "admin123") {
        toast.success("Login berhasil!");
        navigate("/dashboard");
      } else {
        toast.error("Email/Username atau Password salah!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-2xl">
          {/* Left Side - Branding */}
          <div className="bg-gradient-primary hidden md:flex flex-col items-center justify-center p-12 relative overflow-hidden animate-slide-in-left">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />

            <div className="relative z-10 text-center">
              <div className="mb-8">
                <Boxes className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
              </div>
              <h1 className="text-4xl font-bold text-primary-foreground mb-4">Inventory</h1>
              <p className="text-primary-foreground/80 text-lg mb-12">Sistem Manajemen Stok Barang</p>

              <div className="space-y-4 text-left">
                {["Kelola stok barang dengan mudah", "Tracking transaksi real-time", "Laporan lengkap dan akurat"].map((text) => (
                  <div key={text} className="flex items-center gap-3 text-primary-foreground/80">
                    <CheckCircle className="h-5 w-5 text-primary-foreground flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-secondary p-8 md:p-12 flex flex-col justify-center animate-slide-in-right">
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                  <LogIn className="h-7 w-7" /> Login
                </h2>
                <p className="text-muted-foreground text-sm">Masuk ke akun Anda</p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-medium text-secondary-foreground mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />Email atau Username
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan email atau username"
                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-foreground mb-2">
                    <Lock className="inline h-4 w-4 mr-2" />Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button variant="gradient" className="w-full py-3 text-base" type="submit" disabled={loading}>
                  <LogIn className="h-4 w-4" />
                  {loading ? "Memproses..." : "Login"}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-8">
                Demo: admin / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
