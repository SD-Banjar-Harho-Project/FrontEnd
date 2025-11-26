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
        api.get("/students"), // Sesuaikan dengan endpoint students di backend
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
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-600 mt-2">
          Selamat datang di halaman admin SD Negeri 1 Banjar Harjo
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Guru */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Guru</p>
              <h3 className="text-4xl font-bold mt-2">{stats.totalGuru}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <UserIcon className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card Murid */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Murid</p>
              <h3 className="text-4xl font-bold mt-2">{stats.totalMurid}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <AcademicCapIcon className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card Berita */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Total Berita
              </p>
              <h3 className="text-4xl font-bold mt-2">{stats.totalBerita}</h3>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <NewspaperIcon className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Data yang Ingin Ditampilkan:
        </label>
        <select
          value={activeTable}
          onChange={(e) => setActiveTable(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="guru">Data Guru</option>
          <option value="murid">Data Murid</option>
          <option value="berita">Data Berita</option>
        </select>
      </div>

      {/* Tables */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTable === "guru" && "Data Guru"}
            {activeTable === "murid" && "Data Murid"}
            {activeTable === "berita" && "Data Berita"}
          </h2>
          <button
            onClick={handleTambah}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" /> Tambah Data
          </button>
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
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Belum ada data guru
                    </td>
                  </tr>
                ) : (
                  guruData.map((guru, index) => (
                    <tr key={guru.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {guru.name || guru.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {guru.nip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {guru.subject || guru.mapel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(guru.id, "guru")}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(guru.id, "guru")}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
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
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Belum ada data murid
                    </td>
                  </tr>
                ) : (
                  muridData.map((murid, index) => (
                    <tr key={murid.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {murid.name || murid.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {murid.nisn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {murid.class || murid.kelas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {murid.gender || murid.jenisKelamin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(murid.id, "murid")}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(murid.id, "murid")}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
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
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Belum ada data berita
                    </td>
                  </tr>
                ) : (
                  beritaData.map((berita, index) => (
                    <tr key={berita.id} className="hover:bg-gray-50">
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
                          : berita.tanggal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {berita.author || berita.penulis || "Admin"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(berita.id, "berita")}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(berita.id, "berita")}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
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
  );
};

export default AdminDashboard;
