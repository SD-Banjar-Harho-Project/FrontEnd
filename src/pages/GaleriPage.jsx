import { useState } from 'react';

const GaleriPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const galleryData = [
    {
      id: 1,
      title: "Jum'at Bersih",
      description: "Beberapa Foto saat kegiatan jum'at bersih di SDN 01 Bandarharjo",
      image: "src/assets/images/gallery/jumat_bersih.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "Outing Class Klaten - Solo",
      description: "Beberapa Foto Ketika Outing Class goes to Klaten - Solo SDN 01 Bandarharjo",
      image: "src/assets/images/gallery/outing_class.png",
      link: "#"
    },
    {
      id: 3,
      title: "Lomba - lomba",
      description: "Beberapa Foto Ketika Anak anak SDN 01 Bandarharjo juara Lomba",
      image: "src/assets/images/gallery/lomba_kaligrafi.jpg",
      link: "#"
    },
    {
      id: 4,
      title: "ANBK dan Tes",
      description: "Beberapa Foto ketika siswa siswi SDN 01 Bandarharjo sedang menjalankan ANBK dan tes",
      image: "src/assets/images/gallery/anbk_2.jpg",
      link: "#"
    },
    {
      id: 5,
      title: "MPLS 2025",
      description: "Beberapa Foto Ketika MPLS ( Masa Pengenalan Lingkunga Sekolah SDN 01 Bandarharjo",
      image: "src/assets/images/gallery/mpls.png",
      link: "#"
    },
    {
      id: 6,
      title: "Fasilitas Sekolah",
      description: "Beberapa Foto Fasilitas SDN 01 Bandarharjo",
      image: "src/assets/images/gallery/ANBK_sd.jpg",
      link: "#"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Background */}
      <div 
        className="relative bg-cover bg-center pt-20 min-h-[350px]" 
        style={{backgroundImage: 'url(https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg)'}}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gallery
            </h1>
            <p className="text-2xl font-semibold text-white">
              SD Negeri 01 Banjar Harjo
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-6 py-2 rounded-md font-bold text-lg">
                  {item.title}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {item.description}
                </p>
                <a 
                  href={item.link}
                  className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Lihat Foto →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-12">
          <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition">1</button>
          <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold transition shadow">2</button>
          <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold transition shadow">3</button>
          <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold transition shadow">4</button>
          <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold transition shadow">5</button>
          <button className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GaleriPage;