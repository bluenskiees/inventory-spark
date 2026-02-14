import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import DataBarang from "@/pages/DataBarang";
import TambahBarang from "@/pages/TambahBarang";
import EditBarang from "@/pages/EditBarang";
import BarangMasuk from "@/pages/BarangMasuk";
import BarangKeluar from "@/pages/BarangKeluar";
import RiwayatTransaksi from "@/pages/RiwayatTransaksi";
import LaporanPage from "@/pages/LaporanPage";
import StokPage from "@/pages/StokPage";
import UserManagement from "@/pages/UserManagement";
import TambahUser from "@/pages/TambahUser";
import EditUser from "@/pages/EditUser";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/barang" element={<DataBarang />} />
              <Route path="/barang/tambah" element={<TambahBarang />} />
              <Route path="/barang/edit/:id" element={<EditBarang />} />
              <Route path="/transaksi/masuk" element={<BarangMasuk />} />
              <Route path="/transaksi/keluar" element={<BarangKeluar />} />
              <Route path="/transaksi/riwayat" element={<RiwayatTransaksi />} />
              <Route path="/laporan" element={<LaporanPage />} />
              <Route path="/stok" element={<StokPage />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/tambah" element={<TambahUser />} />
              <Route path="/admin/users/edit/:id" element={<EditUser />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
