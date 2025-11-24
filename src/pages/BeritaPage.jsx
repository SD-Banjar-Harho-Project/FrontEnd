import { useState, useEffect } from "react";
import { getPosts } from "../services/postService";

const BeritaPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts(1, 10);
        // Sesuaikan dengan struktur response dari backend
        // Bisa response.data, response.posts, atau langsung response
        const postsData = response.data || response.posts || response;
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Gagal memuat berita. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Ambil berita pertama sebagai featured
  const featuredNews = posts[0];

  // Sisanya untuk sidebar (berita ke-2 dst)
  const sidebarNews = posts.slice(2);

  // Untuk latest news, gunakan semua data
  const latestNews = posts;

  // Loading State
  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (posts.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Header Section */}
        <div
          className="relative bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://picsum.photos/seed/school-dark/1920/600)",
            backgroundColor: "#1a1a2e"
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 container mx-auto px-4 py-32 md:py-14 lg:py-18">
            <div className="text-center">
              <h1 className="text-4xl md:text-2xl lg:text-4xl font-bold text-white">
                Berita{" "}
                <p className="font-light py-2">SD Negeri 1 Banjar Harjo</p>
              </h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Belum ada berita tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header Section dengan Background */}
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://picsum.photos/seed/school-dark/1920/600)",
          backgroundColor: "#1a1a2e"
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 container mx-auto px-4 py-32 md:py-14 lg:py-18">
          <div className="text-center">
            <h1 className="text-4xl md:text-2xl lg:text-4xl font-bold text-white">
              Berita <p className="font-light py-2">SD Negeri 1 Banjar Harjo</p>
            </h1>
          </div>
        </div>
      </div>

      {/* Berita Terbaru Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Berita Terbaru</h2>
          <a
            href="/berita"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            See all
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Featured Article - Left Side */}
          {featuredNews && (
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <img
                  src={
                    featuredNews.image ||
                    "https://picsum.photos/seed/default/400/300"
                  }
                  alt={featuredNews.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {featuredNews.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {featuredNews.excerpt ||
                      featuredNews.content?.substring(0, 150) + "..."}
                  </p>
                  <a
                    href={`/berita/${featuredNews.slug || featuredNews.id}`}
                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition text-sm"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Articles - Right Side */}
          <div className="lg:w-1/2">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {sidebarNews.map((item) => (
                <div
                  key={item.id || item._id}
                  className="flex gap-4 bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition"
                >
                  <img
                    src={
                      item.image || "https://picsum.photos/seed/default/400/300"
                    }
                    alt={item.title}
                    className="w-24 h-20 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex flex-col justify-center">
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-xs line-clamp-2">
                      {item.excerpt || item.content?.substring(0, 100) + "..."}
                    </p>
                    <a
                      href={`/berita/${item.slug || item.id}`}
                      className="text-blue-500 hover:text-blue-600 text-xs font-medium mt-1"
                    >
                      Read More...
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest News</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.map((news) => (
            <div
              key={news.id || news._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={news.image || "https://picsum.photos/seed/default/400/300"}
                alt={news.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-3 mb-3">
                  {news.excerpt || news.content?.substring(0, 100) + "..."}
                </p>
                <a
                  href={`/berita/${news.slug || news.id}`}
                  className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                >
                  Read More...
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeritaPage;