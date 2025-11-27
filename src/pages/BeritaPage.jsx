import { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon, ArrowRightIcon, NewspaperIcon, XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const BeritaPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        const data = await res.json();
        
        // Filter hanya berita yang published dan urutkan dari terbaru
        const published = (data?.data || [])
          .filter(post => post.status === "published")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setPosts(published);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleReadMore = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto'; // Restore scroll
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
        {/* Hero Section - Empty State */}
        <section 
          className="relative h-[350px] bg-cover bg-center"
          style={{
            backgroundImage: "url('https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg')"
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
              Berita Sekolah 
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-medium">
              SD Negeri 01 Banjar Harjo
            </p>
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
  const sidebar = posts.slice(1, 4);
  const allNews = posts;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* HERO SECTION - Background sama seperti gambar */}
        <section 
          className="relative h-[350px] bg-cover bg-center"
          style={{
            backgroundImage: "url('https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl">
              Berita Sekolah
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              SD Negeri 01 Bandar Harjo.
            </p>
            <p className="text-lg md:text-xl text-white/80 font-medium">
              SD Negeri 01 Banjar Harjo
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Featured + Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                <div className="relative overflow-hidden">
                  <img
                    src={featured.img_url || "https://via.placeholder.com/1200x600/1E40AF/ffffff?text=SDN+01+BANJAR+HARJO"}
                    alt={featured.title}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      BERITA UTAMA
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(featured.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>5 min baca</span>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                    {featured.title}
                  </h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {featured.content.substring(0, 200)}...
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

            {/* Sidebar - Recent News */}
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 pb-3 border-b-4 border-yellow-400 inline-block">
                  Berita Terkini
                </h3>
              </div>
              
              {sidebar.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleReadMore(post)}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={post.img_url || "https://via.placeholder.com/120x100"}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm mb-2">
                        {post.title}
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

          {/* All News Grid */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Semua Berita Terbaru
              </h2>
              <div className="h-1 w-24 bg-blue-600 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allNews.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleReadMore(post)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.img_url || "https://via.placeholder.com/400x250/3B82F6/ffffff?text=BERITA"}
                      alt={post.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {post.content.substring(0, 120)}...
                    </p>
                    
                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>Baca selengkapnya</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Detail Berita Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
              {/* Header Image */}
              <div className="relative h-[400px]">
                <img
                  src={selectedPost.img_url || "https://via.placeholder.com/1200x600"}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Close Button */}
                <button
                  onClick={handleCloseDetail}
                  className="absolute top-6 right-6 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Back Button */}
                <button
                  onClick={handleCloseDetail}
                  className="absolute top-6 left-6 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  <span className="font-semibold">Kembali</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{formatDate(selectedPost.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    <span>5 min baca</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {selectedPost.title}
                </h1>

                {/* Divider */}
                <div className="h-1 w-24 bg-blue-600 rounded-full mb-8"></div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {selectedPost.content}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <button
                    onClick={handleCloseDetail}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
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