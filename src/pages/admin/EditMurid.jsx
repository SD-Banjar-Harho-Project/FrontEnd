import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentCheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from "../../services/api";

const EditMurid = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nisn: "",
    class: "",
    gender: "",
    score_uts: "",
    score_uas: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const kelasOptions = [
    { value: "1", label: "Kelas 1" },
    { value: "2", label: "Kelas 2" },
    { value: "3", label: "Kelas 3" },
    { value: "4", label: "Kelas 4" },
    { value: "5", label: "Kelas 5" },
    { value: "6", label: "Kelas 6" },
  ];

  useEffect(() => {
    fetchMurid();
  }, [id]);

  const fetchMurid = async () => {
    try {
      const res = await api.get(`/students/${id}`);
      const murid = res.data.data || res.data;

      setFormData({
        name: murid.name || "",
        nisn: murid.nisn || "",
        class: murid.class || "",
        gender: murid.gender || "",
        score_uts: murid.score_uts || "",
        score_uas: murid.score_uas || "",
      });
    } catch (err) {
      console.error("Gagal memuat data murid:", err);
      setError("Murid tidak ditemukan atau gagal dimuat");
      setTimeout(() => navigate("/admin/data-murid"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return setError("Nama lengkap wajib diisi!");
    if (!formData.nisn.trim()) return setError("NISN wajib diisi!");
    if (!formData.class) return setError("Kelas wajib dipilih!");
    if (!formData.gender) return setError("Jenis kelamin wajib dipilih!");

    setSaving(true);
    setError("");

    const payload = {
      name: formData.name.trim(),
      nisn: formData.nisn.trim(),
      class: formData.class,
      gender: formData.gender,
      score_uts: formData.score_uts ? parseFloat(formData.score_uts) : null,
      score_uas: formData.score_uas ? parseFloat(formData.score_uas) : null,
    };

    try {
      await api.put(`/students/${id}`, payload);
      alert("Data murid berhasil diperbarui!");
      navigate("/admin/data-murid");
    } catch (err) {
      console.error("Gagal update murid:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.nisn?.[0] ||
        "Gagal memperbarui. Pastikan NISN belum digunakan oleh murid lain.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Memuat data murid...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Edit Data Murid</h1>
            <p className="text-gray-600 mt-2">Perbarui informasi murid</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Kembali
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    placeholder="Ahmad Rizky Pratama"
                  />
                </div>

                {/* NISN */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    NISN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleChange}
                    required
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    placeholder="0051234567"
                    maxLength="10"
                    pattern="\d{10}"
                    title="NISN harus 10 digit angka"
                  />
                  <p className="text-xs text-gray-500 mt-1">10 digit angka unik (NISN resmi)</p>
                </div>

                {/* Kelas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kelas <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasOptions.map((k) => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  >
                    <option value="">-- Pilih --</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                {/* Nilai UTS */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nilai UTS
                  </label>
                  <input
                    type="number"
                    name="score_uts"
                    value={formData.score_uts}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    placeholder="87.50"
                  />
                </div>

                {/* Nilai UAS */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nilai UAS
                  </label>
                  <input
                    type="number"
                    name="score_uas"
                    value={formData.score_uas}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                    placeholder="90.00"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg text-lg"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <DocumentCheckIcon className="w-6 h-6" />
                      Simpan Perubahan
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                  className="px-8 py-4 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400 transition disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMurid;