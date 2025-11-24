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
import KontakPage from './pages/KontakPage';
import LoginPage from './pages/LoginPage';
import SiswaPage from './pages/SiswaPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sambutan" element={<SambutanPage />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/galeri" element={<GaleriPage />} />
            <Route path="/berita" element={<BeritaPage />} />
            <Route path="/guru" element={<GuruPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pendaftaran" element={<PendaftaranPage />} />
            <Route path="/about" element={<ProfilPage title="About" />} />
            <Route
              path="/siswa"
              element={<SiswaPage title="Data Siswa" />}
            />
            <Route
              path="/lainnya"
              element={<PlaceholderPage title="Lainnya" />}
            />
            <Route
              path="/kontak"
              element={<KontakPage title="Kontak" />}
            />
            <Route
              path="/ppdb"
              element={<PlaceholderPage title="PPDB SD N1 BANJAR HARJO" />}
            />
            <Route
              path="/panduan-ppdb"
              element={<PlaceholderPage title="Panduan PPDB" />}
            />
            <Route
              path="/lokasi"
              element={<PlaceholderPage title="Lokasi" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;