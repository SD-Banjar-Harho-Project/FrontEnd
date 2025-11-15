import newsData from '../data/news.json';

const BeritaPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Berita Terkini</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsData.map((news) => (
            <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <div className="text-blue-600 font-semibold text-sm mb-2">
                  {news.date}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {news.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {news.excerpt}
                </p>
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
                  Baca Selengkapnya →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeritaPage;