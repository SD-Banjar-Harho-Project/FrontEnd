import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Gallery = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    Swal.fire({
      title: 'Apakah Anda ingin melanjutkan?',
      text: 'Anda akan diarahkan ke halaman galeri lengkap',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#1E88E5',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/galeri');
      }
    });
  };

  const images = [
    'https://picsum.photos/seed/gallery1/600/400',
    'https://picsum.photos/seed/gallery2/600/400',
    'https://picsum.photos/seed/gallery3/600/400',
    'https://picsum.photos/seed/gallery4/600/400',
    'https://picsum.photos/seed/gallery5/600/400',
    'https://picsum.photos/seed/gallery6/600/400',
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Gallery
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {images.map((img, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300 group"
            >
              <img 
                src={img} 
                alt={`Gallery ${index + 1}`}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={handleLearnMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
          >
            Lebih Lanjut
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;