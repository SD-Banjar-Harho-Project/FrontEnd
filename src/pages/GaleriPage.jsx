import { useState } from 'react';

const GaleriPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, url: 'https://picsum.photos/seed/gallery1/800/600', title: 'Kegiatan Belajar Mengajar' },
    { id: 2, url: 'https://picsum.photos/seed/gallery2/800/600', title: 'Upacara Bendera' },
    { id: 3, url: 'https://picsum.photos/seed/gallery3/800/600', title: 'Kegiatan Ekstrakurikuler' },
    { id: 4, url: 'https://picsum.photos/seed/gallery4/800/600', title: 'Lomba Olahraga' },
    { id: 5, url: 'https://picsum.photos/seed/gallery5/800/600', title: 'Peringatan Hari Besar' },
    { id: 6, url: 'https://picsum.photos/seed/gallery6/800/600', title: 'Kegiatan Literasi' },
    { id: 7, url: 'https://picsum.photos/seed/gallery7/800/600', title: 'Kunjungan Industri' },
    { id: 8, url: 'https://picsum.photos/seed/gallery8/800/600', title: 'Pentas Seni' },
    { id: 9, url: 'https://picsum.photos/seed/gallery9/800/600', title: 'Kegiatan Pramuka' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Galeri Foto</h1>
        <p className="text-gray-600 mb-12">
          Dokumentasi kegiatan dan momen berharga di SD Negeri 01 Bandar Harjo
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div 
              key={image.id}
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300 group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="w-full rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaleriPage;