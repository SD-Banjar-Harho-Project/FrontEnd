import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SambutanPage from "./pages/SambutanPage";
import ProfilPage from "./pages/ProfilPage";
import GaleriPage from "./pages/GaleriPage";
import BeritaPage from "./pages/BeritaPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import GuruPage from "./pages/GuruPage";
import PendaftaranPage from "./pages/PendaftaranPage";
import KontakPage from "./pages/KontakPage";
import LoginPage from "./pages/LoginPage";
import SiswaPage from "./pages/SiswaPage";

// Import Admin Components
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TambahGuruPage from "./pages/admin/TambahGuruPage";

// Public Layout Wrapper
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - With Navbar & Footer */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/sambutan"
          element={
            <PublicLayout>
              <SambutanPage />
            </PublicLayout>
          }
        />
        <Route
          path="/profil"
          element={
            <PublicLayout>
              <ProfilPage />
            </PublicLayout>
          }
        />
        <Route
          path="/galeri"
          element={
            <PublicLayout>
              <GaleriPage />
            </PublicLayout>
          }
        />
        <Route
          path="/berita"
          element={
            <PublicLayout>
              <BeritaPage />
            </PublicLayout>
          }
        />
        <Route
          path="/guru"
          element={
            <PublicLayout>
              <GuruPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/pendaftaran"
          element={
            <PublicLayout>
              <PendaftaranPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <ProfilPage title="About" />
            </PublicLayout>
          }
        />
        <Route
          path="/siswa"
          element={
            <PublicLayout>
              <SiswaPage title="Data Siswa" />
            </PublicLayout>
          }
        />
        <Route
          path="/lainnya"
          element={
            <PublicLayout>
              <PlaceholderPage title="Lainnya" />
            </PublicLayout>
          }
        />
        <Route
          path="/kontak"
          element={
            <PublicLayout>
              <KontakPage title="Kontak" />
            </PublicLayout>
          }
        />
        <Route
          path="/ppdb"
          element={
            <PublicLayout>
              <PlaceholderPage title="PPDB SD N1 BANJAR HARJO" />
            </PublicLayout>
          }
        />
        <Route
          path="/panduan-ppdb"
          element={
            <PublicLayout>
              <PlaceholderPage title="Panduan PPDB" />
            </PublicLayout>
          }
        />
        <Route
          path="/lokasi"
          element={
            <PublicLayout>
              <PlaceholderPage title="Lokasi" />
            </PublicLayout>
          }
        />

        {/* Admin Routes - With AdminLayout (Protected, No Navbar/Footer) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  {/* Dashboard */}
                  <Route path="dashboard" element={<AdminDashboard />} />

                  {/* Guru Routes */}
                  <Route path="guru" element={<AdminDashboard />} />
                  <Route path="guru/tambah" element={<TambahGuruPage />} />
                  {/*
                  <Route path="guru/edit/:id" element={<EditGuruPage />} />

                  {/* Murid Routes
                  <Route path="murid" element={<AdminDashboard />} />
                  <Route path="murid/tambah" element={<TambahMuridPage />} />
                  <Route path="murid/edit/:id" element={<EditMuridPage />} />

                  {/* Berita Routes
                  <Route path="berita" element={<AdminDashboard />} />
                  <Route path="berita/tambah" element={<TambahBeritaPage />} />
                  <Route path="berita/edit/:id" element={<EditBeritaPage />} />
                  */}
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
