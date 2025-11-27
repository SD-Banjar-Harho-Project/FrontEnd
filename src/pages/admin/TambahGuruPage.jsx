import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentCheckIcon, ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const TambahGuruPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    class_name: "",
    subject_id: "",
    email: "",
    phone: "",
    bio: "",
    join_date: new Date().toISOString().split("T")[0],
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState("");

  const fallbackSubjects = [
    { id: 1, name: "Matematika" },
    { id: 2, name: "Bahasa Indonesia" },
    { id: 3, name: "Bahasa Inggris" },
    { id: 4, name: "IPA" },
    { id: 5, name: "IPS" },
    { id: 6, name: "Pendidikan Agama" },
    { id: 7, name: "Pendidikan Jasmani" },
    { id: 8, name: "Seni Budaya" },
    { id: 9, name: "Prakarya" },
    { id: 10, name: "Bahasa Jawa" },
  ];

  const kelasOptions = ["1", "2", "3", "4", "5", "6"].map(k => ({
    value: k,
    label: `Kelas ${k}`
  }));

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subjects");
      const data = await response.json();

      let dataArray = [];
      if (Array.isArray(data)) dataArray = data;
      else if (data?.data) dataArray = data.data;
      else if (data?.subjects) dataArray = data.subjects;

      const cleaned = dataArray
        .map(item => ({
          id: item.id || item.subject_id || item._id,
          name: item.name || item.subject_name || "Tanpa Nama"
        }))
        .filter(item => item.id && item.name);

      setSubjects(cleaned.length > 0 ? cleaned : fallbackSubjects);
    } catch (err) {
      console.warn("Gagal ambil mata pelajaran, pakai fallback", err);
      setSubjects(fallbackSubjects);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (!allowed.includes(file.type)) {
      setError("Format foto hanya JPG, PNG, atau GIF!");
      return;
    }
    if (file.size > maxSize) {
      setError("Ukuran foto maksimal 5MB!");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("Nama wajib diisi!");
    if (!formData.class_name) return setError("Kelas wajib dipilih!");
    if (!formData.subject_id) return setError("Mata pelajaran wajib dipilih!");

    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("nip", formData.nip.trim());
    formDataToSend.append("class_name", formData.class_name);
    formDataToSend.append("subject_id", formData.subject_id);
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("phone", formData.phone.trim());
    formDataToSend.append("bio", formData.bio.trim());
    formDataToSend.append("join_date", formData.join_date);
    if (photoFile) formDataToSend.append("photo", photoFile);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data guru berhasil ditambahkan!");
        // LANGSUNG KEMBALI KE DASHBOARD
        navigate("/admin/dashboard");
      } else {
        setError(result?.message || "Gagal menambahkan guru");
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Tambah Data Guru</h1>
            <p className="text-gray-600 mt-2">Lengkapi formulir untuk menambah guru baru</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium shadow-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Kembali
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg shadow">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Foto Upload */}
            <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <label className="block text-lg font-bold text-blue-900 mb-6">Foto Profil Guru</label>
              {!photoPreview ? (
                <label htmlFor="photo" className="cursor-pointer">
                  <div className="w-48 h-48 mx-auto bg-gray-200 border-4 border-dashed border-blue-400 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                    <PhotoIcon className="w-20 h-20 text-blue-500" />
                  </div>
                  <p className="mt-4 text-blue-700 font-medium">Klik untuk upload foto</p>
                  <p className="text-sm text-gray-600">JPG/PNG, maks 5MB</p>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img src={photoPreview} alt="Preview" className="w-56 h-56 object-cover rounded-full shadow-2xl border-8 border-white" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 shadow-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nama & NIP */}
              <div>
                <label className="block font-bold text-blue-900 mb-2">Nama Lengkap *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={loading}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg"
                  placeholder="Siti Aminah, S.Pd." />
              </div>
              <div>
                <label className="block font-bold text-blue-900 mb-2">NIP / NUPTK</label>
                <input type="text" name="nip" value={formData.nip} onChange={handleChange} disabled={loading}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg"
                  placeholder="123456789012345678" />
              </div>

              {/* Kelas & Mata Pelajaran */}
              <div>
                <label className="block font-bold text-blue-900 mb-2">Kelas yang Diajar *</label>
                <select name="class_name" value={formData.class_name} onChange={handleChange} required disabled={loading}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg">
                  <option value="">-- Pilih Kelas --</option>
                  {kelasOptions.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-blue-900 mb-2">Mata Pelajaran *</label>
                {loadingSubjects ? (
                  <div className="w-full px-5 py-4 bg-gray-100 rounded-xl text-gray-500">Memuat...</div>
                ) : (
                  <select name="subject_id" value={formData.subject_id} onChange={handleChange} required disabled={loading}
                    className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg">
                    <option value="">-- Pilih Mata Pelajaran --</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                )}
              </div>

              {/* Email & Telepon */}
              <div>
                <label className="block font-bold text-blue-900 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg"
                  placeholder="guru@sdn01bandarhajo.sch.id" />
              </div>
              <div>
                <label className="block font-bold text-blue-900 mb-2">No. Telepon</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg"
                  placeholder="0857xxxxxxxx" />
              </div>

              {/* Tanggal Bergabung & Bio */}
              <div>
                <label className="block font-bold text-blue-900 mb-2">Tanggal Bergabung</label>
                <input type="date" name="join_date" value={formData.join_date} onChange={handleChange} disabled={loading}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-blue-900 mb-2">Bio / Keterangan</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" disabled={loading}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition resize-none text-lg"
                  placeholder="Guru berpengalaman 15 tahun..." />
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-center gap-6 pt-10 border-t-4 border-blue-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xl rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-2xl disabled:opacity-70"
              >
                {loading ? (
                  <>Menyimpan...</>
                ) : (
                  <>
                    <DocumentCheckIcon className="w-8 h-8" />
                    Simpan Data Guru
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="px-12 py-5 bg-gray-400 text-white font-bold text-xl rounded-2xl hover:bg-gray-500 transition shadow-xl"
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahGuruPage;