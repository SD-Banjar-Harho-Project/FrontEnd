import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Profil = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    Swal.fire({
      title: 'Apakah Anda ingin melanjutkan?',
      text: 'Anda akan diarahkan ke halaman profil lengkap',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#1E88E5',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/profil');
      }
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
          {/* Image */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <img 
              src="src/assets/images/gallery/lomba_kaligrafi.jpg" 
              alt="Profil Sekolah" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Profil Sekolah
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Di samping adalah profil sekolah kami secara keseluruhan dari mulai bagian depan hingga seluruh fasilitas yang terdapat disekolah kami kami akan ...
            </p>
            <button 
              onClick={handleLearnMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
            >
              Lebih Lanjut
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profil;
