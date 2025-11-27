import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentCheckIcon, ArrowLeftIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

const EditGuru = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    class_name: "",
    subject_id: "",
    email: "",
    phone: "",
    bio: "",
    join_date: "",
    is_active: 1,
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const kelasOptions = ["1", "2", "3", "4", "5", "6"].map(k => ({
    value: k,
    label: `Kelas ${k}`
  }));

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

  useEffect(() => {
    fetchSubjects();
    if (id) fetchGuru();
  }, [id]);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/subjects");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.data || data?.subjects || [];
      const cleaned = arr
        .map(s => ({
          id: s.id || s.subject_id || s._id,
          name: s.name || s.subject_name || "Tanpa Nama"
        }))
        .filter(s => s.id);
      setSubjects(cleaned.length > 0 ? cleaned : fallbackSubjects);
    } catch (err) {
      console.warn("Gagal fetch subjects, pakai fallback");
      setSubjects(fallbackSubjects);
    }
  };

  const fetchGuru = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/teachers/${id}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const result = await res.json();
      const guru = result.data || result;

      setFormData({
        name: guru.name || "",
        nip: guru.nip || "",
        class_name: guru.class_name || "",
        subject_id: guru.subject_id || "",
        email: guru.email || "",
        phone: guru.phone || "",
        bio: guru.bio || "",
        join_date: guru.join_date ? guru.join_date.split("T")[0] : "",
        is_active: guru.is_active ?? 1,
      });

      const photoPath = guru.photo_url || guru.photo || guru.foto;
      if (photoPath) {
        const fullUrl = photoPath.startsWith("http")
          ? photoPath
          : `http://localhost:5000/uploads/teachers/${photoPath}`;
        setPhotoPreview(fullUrl);
      }
    } catch (err) {
      setError("Gagal memuat data guru. Pastikan ID benar.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // DIPERBAIKI DI SINI
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowed.includes(file.type)) {
      setError("Format foto hanya JPG atau PNG!");
      return;
    }
    if (file.size > maxSize) {
      setError("Ukuran foto maksimal 5MB!");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader(); // DIPERBAIKI: new FileReader()
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

    setSaving(true);
    setError("");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (photoFile) formDataToSend.append("photo", photoFile);

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formDataToSend
      });

      if (res.ok) {
        alert("Data guru berhasil diperbarui!");
        navigate("/admin/dashboard");
      } else {
        const err = await res.json();
        setError(err?.message || "Gagal menyimpan perubahan");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-blue-800">Memuat data guru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Edit Data Guru</h1>
            <p className="text-gray-600 mt-2">Perbarui informasi guru dengan teliti</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium shadow-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Kembali
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg shadow">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Foto Upload */}
            <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <label className="block text-lg font-bold text-blue-900 mb-6">Foto Profil Guru</label>
              {!photoPreview ? (
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="w-48 h-48 mx-auto bg-gray-200 border-4 border-dashed border-blue-400 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                    <PhotoIcon className="w-20 h-20 text-blue-500" />
                  </div>
                  <p className="mt-4 text-blue-700 font-medium">Klik untuk upload foto</p>
                  <p className="text-sm text-gray-600">JPG/PNG • Maks. 5MB</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoChange}
                    className="hidden"
                    disabled={saving}
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-56 h-56 object-cover rounded-full shadow-2xl border-8 border-white"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=6366f1&color=fff&size=256&bold=true`;
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={saving}
                    className="absolute top-2 right-2 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 shadow-lg transition"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                  <label
                    htmlFor="photo-upload"
                    className="block mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Ganti Foto
                  </label>
                  <input id="photo-upload" type="file" accept="image/jpeg,image/png" onChange={handlePhotoChange} className="hidden" />
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Semua field sama persis dengan TambahGuru */}
              <div>
                <label className="block font-bold text-blue-900 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700 placeholder-gray-400"
                  placeholder="Contoh: Siti Aminah, S.Pd."
                />
              </div>
              <div>
                <label className="block font-bold text-blue-900 mb-2">NIP / NUPTK</label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700"
                  placeholder="123456789012345678"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-2">Kelas yang Diajar *</label>
                <select
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {kelasOptions.map(k => (
                    <option key={k.value} value={k.value}>{k.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-2">Mata Pelajaran *</label>
                <select
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700"
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700"
                  placeholder="guru@sdn01banjarharjo.sch.id"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-2">No. Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700"
                  placeholder="085712345678"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-2">Tanggal Bergabung</label>
                <input
                  type="date"
                  name="join_date"
                  value={formData.join_date}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-2">Status</label>
                <select
                  name="is_active"
                  value={formData.is_active}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition text-lg text-gray-700"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Tidak Aktif</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-blue-900 mb-2">Bio / Keterangan</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  disabled={saving}
                  className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-600 transition resize-none text-lg text-gray-700"
                  placeholder="Contoh: Guru berpengalaman 15 tahun..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 pt-10 border-t-4 border-blue-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xl rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all shadow-2xl disabled:opacity-70"
              >
                {saving ? (
                  <>Menyimpan...</>
                ) : (
                  <>
                    <DocumentCheckIcon className="w-8 h-8" />
                    Simpan Perubahan
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={saving}
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

export default EditGuru;