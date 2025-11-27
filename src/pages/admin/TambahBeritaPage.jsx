import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentCheckIcon, ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import api from "../../services/api";

const TambahBeritaPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // preview gambar

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "published",
    image: null,        // file dari upload
    imageUrl: "",       // atau link dari internet
  });

  // Auto generate slug dari judul
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0])); // preview
    } else if (name === "imageUrl") {
      setFormData(prev => ({ ...prev, imageUrl: value, image: null }));
      setImagePreview(value || "");
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError("Judul wajib diisi!");
    if (!formData.content.trim()) return setError("Konten wajib diisi!");

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("slug", generateSlug(formData.title));
    data.append("content", formData.content.trim());
    data.append("status", formData.status);

    // Prioritas: kalau upload file → pakai file, kalau isi URL → pakai URL
    if (formData.image) {
      data.append("image", formData.image);
    } else if (formData.imageUrl.trim()) {
      data.append("image_url", formData.imageUrl.trim()); // backend harus support ini
    }

    try {
      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Berita berhasil ditambahkan!");
      navigate("/admin/berita");
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menambah berita.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Tambah Berita Baru</h1>
            <p className="text-gray-600 mt-2">Isi formulir untuk membuat berita baru</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Kembali
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl shadow-xl p-8 border">
          {/* Judul & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                placeholder="Contoh: PPDB 2025/2026 Dibuka!"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status Publikasi
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
              >
                <option value="published">Publikasikan Sekarang</option>
                <option value="draft">Simpan sebagai Draft</option>
              </select>
            </div>
          </div>

          {/* Gambar: Upload atau URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Gambar Berita (Opsional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload File */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload dari Komputer
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-500 transition bg-gray-50">
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">Klik untuk upload gambar</span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>

              {/* Atau Pakai Link */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Atau Masukkan Link Gambar (URL)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/gambar.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Preview Gambar */}
            {imagePreview && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Pratinjau Gambar:</p>
                <img src={imagePreview} alt="Preview" className="max-h-80 rounded-lg shadow-lg" />
              </div>
            )}
          </div>

          {/* Konten */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Isi Berita <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="15"
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition resize-none"
              placeholder="Tulis isi berita di sini..."
            />
          </div>

          {/* Tombol */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-70 shadow-lg text-lg"
            >
              {loading ? "Menyimpan..." : <>
                <DocumentCheckIcon className="w-6 h-6" />
                Simpan Berita
              </>}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-400 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahBeritaPage;