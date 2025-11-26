import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  AcademicCapIcon,
  NewspaperIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import api from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTable, setActiveTable] = useState("guru");
  const [stats, setStats] = useState({
    totalGuru: 0,
    totalMurid: 0,
    totalBerita: 0
  });

  const [guruData, setGuruData] = useState([]);
  const [muridData, setMuridData] = useState([]);
  const [beritaData, setBeritaData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari API
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch semua data secara parallel
      const [guruResponse, muridResponse, beritaResponse] = await Promise.all([
        api.get("/teachers"),
        api.get("/students"),
        api.get("/posts")
      ]);

      // Set data guru
      const guruList = guruResponse.data || guruResponse;
      setGuruData(Array.isArray(guruList) ? guruList : []);

      // Set data murid
      const muridList = muridResponse.data || muridResponse;
      setMuridData(Array.isArray(muridList) ? muridList : []);

      // Set data berita
      const beritaList = beritaResponse.data || beritaResponse;
      setBeritaData(Array.isArray(beritaList) ? beritaList : []);

      // Update stats
      setStats({
        totalGuru: Array.isArray(guruList) ? guruList.length : 0,
        totalMurid: Array.isArray(muridList) ? muridList.length : 0,
        totalBerita: Array.isArray(beritaList) ? beritaList.length : 0
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      return;
    }

    try {
      let endpoint = "";

      if (type === "guru") {
        endpoint = `/teachers/${id}`;
      } else if (type === "murid") {
        endpoint = `/students/${id}`;
      } else if (type === "berita") {
        endpoint = `/posts/${id}`;
      }

      await api.delete(endpoint);

      // Refresh data setelah delete
      await fetchAllData();

      alert("Data berhasil dihapus!");
    } catch (err) {
      console.error("Error deleting data:", err);
      alert("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const handleEdit = (id, type) => {
    if (type === "guru") {
      navigate(`/admin/guru/edit/${id}`);
    } else if (type === "murid") {
      navigate(`/admin/murid/edit/${id}`);
    } else if (type === "berita") {
      navigate(`/admin/berita/edit/${id}`);
    }
  };

  const handleTambah = () => {
    if (activeTable === "guru") {
      navigate("/admin/guru/tambah");
    } else if (activeTable === "murid") {
      navigate("/admin/murid/tambah");
    } else if (activeTable === "berita") {
      navigate("/admin/berita/tambah");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 mb-6 text-lg font-medium">{error}</p>
          <button
            onClick={fetchAllData}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
          >
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
          <h1 className="text-4xl font-bold text-gray-800">DASHBOARD</h1>
          <p className="text-gray-600 mt-2">
            Kelola data guru, murid, dan artikel SD Negeri 01 Bandarharjo
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Guru */}
          <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-gray-700 text-lg font-semibold mb-2">Guru</h3>
              <p className="text-5xl font-bold text-blue-600">
                {String(stats.totalGuru).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Card Murid */}
          <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <AcademicCapIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-gray-700 text-lg font-semibold mb-2">Murid</h3>
              <p className="text-5xl font-bold text-green-600">{stats.totalMurid}</p>
            </div>
          </div>

          {/* Card Fasilitas - Placeholder */}
          <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-gray-700 text-lg font-semibold mb-2">Fasilitas</h3>
              <p className="text-5xl font-bold text-yellow-600">0</p>
            </div>
          </div>

          {/* Card Artikel */}
          <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-3">
                <NewspaperIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-gray-700 text-lg font-semibold mb-2">Artikel</h3>
              <p className="text-5xl font-bold text-purple-600">
                {String(stats.totalBerita).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Statistik Data</h2>
        </div>

        {/* Dropdown Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Data yang Ingin Ditampilkan:
              </label>
              <select
                value={activeTable}
                onChange={(e) => setActiveTable(e.target.value)}
                className="w-full md:w-80 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="guru">Data Guru</option>
                <option value="murid">Data Murid</option>
                <option value="berita">Data Artikel</option>
              </select>
            </div>
            <button
              onClick={handleTambah}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5" /> Tambah Data
            </button>
          </div>
        </div>

        {/* Tables */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="px-6 py-4 bg-gray-50 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTable === "guru" && "Data Guru"}
              {activeTable === "murid" && "Data Murid"}
              {activeTable === "berita" && "Data Artikel"}
            </h2>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {/* Tabel Guru */}
            {activeTable === "guru" && (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mata Pelajaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guruData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <UserIcon className="w-16 h-16 text-gray-300 mb-3" />
                          <p className="text-lg font-medium">Belum ada data guru</p>
                          <p className="text-sm text-gray-400 mt-1">Klik tombol "Tambah Data" untuk menambahkan guru</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    guruData.map((guru, index) => (
                      <tr key={guru.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {guru.name || guru.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guru.nip || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guru.subject || guru.mapel || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(guru.id, "guru")}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
                              title="Edit"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(guru.id, "guru")}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                              title="Hapus"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Tabel Murid */}
            {activeTable === "murid" && (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NISN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {muridData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <AcademicCapIcon className="w-16 h-16 text-gray-300 mb-3" />
                          <p className="text-lg font-medium">Belum ada data murid</p>
                          <p className="text-sm text-gray-400 mt-1">Klik tombol "Tambah Data" untuk menambahkan murid</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    muridData.map((murid, index) => (
                      <tr key={murid.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {murid.name || murid.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {murid.nisn || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {murid.class || murid.kelas || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {murid.gender || murid.jenisKelamin || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(murid.id, "murid")}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
                              title="Edit"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(murid.id, "murid")}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                              title="Hapus"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Tabel Berita */}
            {activeTable === "berita" && (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penulis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beritaData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <NewspaperIcon className="w-16 h-16 text-gray-300 mb-3" />
                          <p className="text-lg font-medium">Belum ada data artikel</p>
                          <p className="text-sm text-gray-400 mt-1">Klik tombol "Tambah Data" untuk menambahkan artikel</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    beritaData.map((berita, index) => (
                      <tr key={berita.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {berita.title || berita.judul}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {berita.created_at
                            ? new Date(berita.created_at).toLocaleDateString(
                                "id-ID"
                              )
                            : berita.tanggal || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {berita.author || berita.penulis || "Admin"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(berita.id, "berita")}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
                              title="Edit"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(berita.id, "berita")}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                              title="Hapus"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;