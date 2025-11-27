// src/pages/BeritaPage.jsx → VERSI FINAL 100% BERHASIL! (Gambar Muncul + Detail Lancar)

import { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon, ArrowRightIcon, NewspaperIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from "../services/api";

const BeritaPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  // URL Backend
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        let list = [];

        // Ambil array dari response apapun bentuknya
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res.data)) list = res.data;
        else if (res.posts) list = res.posts;
        else if (res.result) list = res.result;
        else list = Object.values(res).find(Array.isArray) || [];

        // Filter published & urutkan dari terbaru
        const published = list
          .filter(post => !post.status || post.status === "published")
          .sort((a, b) => new Date(b.created_at || b.tanggal) - new Date(a.created_at || a.tanggal));

        setPosts(published);
      } catch (err) {
        console.error("Error fetching posts:", err);
        alert("Gagal memuat berita. Pastikan backend jalan!");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fix gambar: cek semua kemungkinan field
  const getImageUrl = (post) => {
    const img = post.img_url || post.image || post.gambar || post.photo;
    if (!img) return "https://via.placeholder.com/1200x600/1E40AF/ffffff?text=SDN+01+BANJAR+HARJO";
    if (img.startsWith("http")) return img;
    return `${BACKEND_URL}/${img.startsWith("/") ? img.slice(1) : img}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleReadMore = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-blue-700 font-medium">Memuat berita terbaru...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <section className="relative h-[350px] bg-cover bg-center"
          style={{backgroundImage: "url('src/assets/images/gallery/sd-01.png')"}}>
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">Berita Sekolah</h1>
            <p className="text-lg md:text-xl text-white/80 font-medium">SD Negeri 01 Banjar Harjo</p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-20 text-center">
          <NewspaperIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Belum Ada Berita</h2>
          <p className="text-xl text-gray-600">Belum ada berita yang dipublikasikan.</p>
        </div>
      </div>
    );
  }

  const featured = posts[0];
  const sidebar = posts.slice(1, 6);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* HERO */}
        <section className="relative h-[350px] bg-cover bg-center"
          style={{backgroundImage: "url('https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg')"}}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">Berita Sekolah</h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium">SD Negeri 01 Banjar Harjo</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Featured + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all group">
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(featured)}
                    alt={featured.title || featured.judul}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      BERITA UTAMA
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(featured.created_at)}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {featured.title || featured.judul}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    {(featured.content || featured.konten || "").substring(0, 200)}...
                  </p>
                  <button 
                    onClick={() => handleReadMore(featured)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Baca Selengkapnya
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 pb-3 border-b-4 border-yellow-400 inline-block">
                Berita Terkini
              </h3>
              {sidebar.map((post) => (
                <div key={post.id} onClick={() => handleReadMore(post)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <img src={getImageUrl(post)} alt="" className="w-24 h-24 object-cover rounded-xl group-hover:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 text-sm mb-2">
                        {post.title || post.judul}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semua Berita */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Semua Berita Terbaru</h2>
              <div className="h-1 w-24 bg-blue-600 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post.id} onClick={() => handleReadMore(post)} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group cursor-pointer">
                  <img src={getImageUrl(post)} alt="" className="w-full h-56 object-cover group-hover:scale-110 transition-transform" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600">
                      {post.title || post.judul}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {(post.content || post.konten || "").substring(0, 120)}...
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                      Baca selengkapnya
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative h-[400px]">
                <img src={getImageUrl(selectedPost)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button onClick={handleCloseDetail} className="absolute top-6 right-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg">
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <button onClick={handleCloseDetail} className="absolute top-6 left-6 bg-white/90 hover:bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span className="font-semibold">Kembali</span>
                </button>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{formatDate(selectedPost.created_at)}</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {selectedPost.title || selectedPost.judul}
                </h1>
                <div className="h-1 w-24 bg-blue-600 rounded-full mb-8"></div>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedPost.content || selectedPost.konten || "Tidak ada isi berita."}
                </div>
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <button onClick={handleCloseDetail} className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Kembali ke Daftar Berita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeritaPage;
