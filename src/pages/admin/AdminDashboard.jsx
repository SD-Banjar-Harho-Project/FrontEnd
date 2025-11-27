import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  AcademicCapIcon,
  NewspaperIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTable, setActiveTable] = useState("guru");

  const [stats, setStats] = useState({
    totalGuru: 0,
    totalMurid: 0,
    totalBerita: 0,
  });

  const [guruData, setGuruData] = useState([]);
  const [muridData, setMuridData] = useState([]);
  const [beritaData, setBeritaData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping mata pelajaran
  const subjectsMap = {
    1: "Matematika",
    2: "Bahasa Indonesia",
    3: "Bahasa Inggris",
    4: "IPA",
    5: "IPS",
    6: "Seni Budaya",
    7: "Pendidikan Jasmani",
    8: "PKN",
    9: "Agama",
    10: "TIK",
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // FUNGSI AMAN UNTUK AMBIL ARRAY DARI RESPONSE APA PUN BENTUKNYA
  const getArrayFromResponse = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (response.teachers && Array.isArray(response.teachers)) return response.teachers;
    if (response.students && Array.isArray(response.students)) return response.students;
    if (response.posts && Array.isArray(response.posts)) return response.posts;
    if (response.result && Array.isArray(response.result)) return response.result;
    if (response.items && Array.isArray(response.items)) return response.items;

    // Kalau masih object, cari value yang array
    const values = Object.values(response);
    const foundArray = values.find(Array.isArray);
    return foundArray || [];
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [guruRes, muridRes, beritaRes] = await Promise.all([
        api.get("/teachers"),
        api.get("/students"),
        api.get("/posts"),
      ]);

      const guruList = getArrayFromResponse(guruRes);
      const muridList = getArrayFromResponse(muridRes);
      const beritaList = getArrayFromResponse(beritaRes);

      // Tambah nama mata pelajaran untuk guru
      const guruWithSubject = guruList.map((g) => ({
        ...g,
        subject_name:
          g.subject?.name ||
          g.mata_pelajaran ||
          subjectsMap[g.subject_id] ||
          subjectsMap[g.mapel_id] ||
          "Tidak Diketahui",
      }));

      setGuruData(guruWithSubject);
      setMuridData(muridList);
      setBeritaData(beritaList);

      setStats({
        totalGuru: guruWithSubject.length,
        totalMurid: muridList.length,
        totalBerita: beritaList.length,
      });
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Gagal memuat data. Pastikan backend berjalan di http://localhost:5000");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      let endpoint = "";
      if (type === "guru") endpoint = `/teachers/${id}`;
      if (type === "murid") endpoint = `/students/${id}`;
      if (type === "berita") endpoint = `/posts/${id}`;

      await api.delete(endpoint);
      await fetchAllData();
      alert("Data berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus data. Pastikan masih login.");
    }
  };

  const handleEdit = (id, type) => {
    if (type === "guru") navigate(`/admin/guru/edit/${id}`);
    if (type === "murid") navigate(`/admin/murid/edit/${id}`);
    if (type === "berita") navigate(`/admin/berita/edit/${id}`);
  };

  const handleTambah = () => {
    if (activeTable === "guru") navigate("/admin/guru/tambah");
    if (activeTable === "murid") navigate("/admin/murid/tambah");
    if (type === "berita") navigate("/admin/berita/tambah");
  };

  const getTableTitle = () => {
    return activeTable === "guru"
      ? "Daftar Guru"
      : activeTable === "murid"
      ? "Daftar Murid"
      : "Daftar Artikel";
  };

  const getTambahText = () => {
    return activeTable === "guru"
      ? "Tambah Guru"
      : activeTable === "murid"
      ? "Tambah Murid"
      : "Tambah Artikel";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-xl text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button onClick={fetchAllData} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">DASHBOARD ADMIN</h1>
          <p className="text-gray-600 mt-2">Kelola data guru, murid, dan artikel SD Negeri 01 Bandarharjo</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-12 h-12 text-blue-600" />
            </div>
            <p className="text-gray-600 text-lg">Total Guru</p>
            <p className="text-5xl font-bold text-blue-600 mt-2">{String(stats.totalGuru).padStart(2, "0")}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AcademicCapIcon className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-gray-600 text-lg">Total Murid</p>
            <p className="text-5xl font-bold text-green-600 mt-2">{stats.totalMurid}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <NewspaperIcon className="w-12 h-12 text-purple-600" />
            </div>
            <p className="text-gray-600 text-lg">Total Artikel</p>
            <p className="text-5xl font-bold text-purple-600 mt-2">{String(stats.totalBerita).padStart(2, "0")}</p>
          </div>
        </div>

        {/* Pilih Data & Tambah */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">Pilih Data untuk Dikelola:</label>
              <select
                value={activeTable}
                onChange={(e) => setActiveTable(e.target.value)}
                className="w-full lg:w-96 px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg"
              >
                <option value="guru">Data Guru</option>
                <option value="murid">Data Murid</option>
                <option value="berita">Data Artikel</option>
              </select>
            </div>
            <button
              onClick={handleTambah}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <PlusIcon className="w-8 h-8" />
              {getTambahText()}
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-5">
            <h2 className="text-2xl font-bold text-white">{getTableTitle()}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">No</th>
                  {activeTable === "guru" && (
                    <>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Nama</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">NIP</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Mata Pelajaran</th>
                    </>
                  )}
                  {activeTable === "murid" && (
                    <>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Nama</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">NISN</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Kelas</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Jenis Kelamin</th>
                    </>
                  )}
                  {activeTable === "berita" && (
                    <>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Judul</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Tanggal</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase">Penulis</th>
                    </>
                  )}
                  <th className="px-8 py-4 text-center text-sm font-bold text-gray-700 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeTable === "guru" && guruData.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-16 text-gray-500 text-lg">Belum ada data guru</td></tr>
                )}
                {activeTable === "guru" && guruData.map((g, i) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-4">{i + 1}</td>
                    <td className="px-8 py-4 font-medium">{g.name || g.nama || "-"}</td>
                    <td className="px-8 py-4">{g.nip || "-"}</td>
                    <td className="px-8 py-4">{g.subject_name}</td>
                    <td className="px-8 py-4 text-center">
                      <button onClick={() => handleEdit(g.id, "guru")} className="text-blue-600 hover:bg-blue-100 p-3 rounded-lg transition">
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      <button onClick={() => handleDelete(g.id, "guru")} className="text-red-600 hover:bg-red-100 p-3 rounded-lg ml-3 transition">
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}

                {activeTable === "murid" && muridData.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-16 text-gray-500 text-lg">Belum ada data murid</td></tr>
                )}
                {activeTable === "murid" && muridData.map((m, i) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-4">{i + 1}</td>
                    <td className="px-8 py-4 font-medium">{m.name || m.nama}</td>
                    <td className="px-8 py-4">{m.nisn || "-"}</td>
                    <td className="px-8 py-4 text-center">{m.class || m.kelas || "-"}</td>
                    <td className="px-8 py-4 text-center">
                      {m.gender === "L" || m.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button onClick={() => handleEdit(m.id, "murid")} className="text-blue-600 hover:bg-blue-100 p-3 rounded-lg transition">
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      <button onClick={() => handleDelete(m.id, "murid")} className="text-red-600 hover:bg-red-100 p-3 rounded-lg ml-3 transition">
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}

                {activeTable === "berita" && beritaData.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-16 text-gray-500 text-lg">Belum ada artikel</td></tr>
                )}
                {activeTable === "berita" && beritaData.map((b, i) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-4">{i + 1}</td>
                    <td className="px-8 py-4 font-medium">{b.title || b.judul}</td>
                    <td className="px-8 py-4">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString("id-ID") : b.tanggal || "-"}
                    </td>
                    <td className="px-8 py-4">{b.author || b.penulis || "Admin"}</td>
                    <td className="px-8 py-4 text-center">
                      <button onClick={() => handleEdit(b.id, "berita")} className="text-blue-600 hover:bg-blue-100 p-3 rounded-lg transition">
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      <button onClick={() => handleDelete(b.id, "berita")} className="text-red-600 hover:bg-red-100 p-3 rounded-lg ml-3 transition">
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;