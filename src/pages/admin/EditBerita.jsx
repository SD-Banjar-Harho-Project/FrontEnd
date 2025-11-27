import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentCheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from "../../services/api";

const EditBerita = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", author: "", status: "published"
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const data = res.data.data || res.data;
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          author: data.author || "",
          status: data.status || "published",
        });
      } catch {
        setError("Artikel tidak ditemukan");
        setTimeout(() => navigate("/admin"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === "title"
        ? value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : prev.slug
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError("Judul wajib diisi!");
    if (!formData.content.trim()) return setError("Konten wajib diisi!");

    setSaving(true);
    setError("");

    try {
      await api.put(`/posts/${id}`, formData);
      alert("Artikel berhasil diperbarui!");
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal update artikel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Edit Artikel</h1>
            <p className="text-gray-600 mt-2">Perbarui konten artikel</p>
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

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sama persis seperti TambahBeritaPage di atas */}
              {/* Grid 2 kolom, textarea besar, tombol sama */}
              {/* ... (kode form sama persis) ... */}

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400 shadow-lg text-lg"
                >
                  {saving ? "Menyimpan..." : <><DocumentCheckIcon className="w-6 h-6" /> Update Artikel</>}
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
      </div>
    </div>
  );
};

export default EditBerita;