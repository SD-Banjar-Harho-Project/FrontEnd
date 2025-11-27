import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sambutan = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    Swal.fire({
      title: 'Apakah Anda ingin melanjutkan?',
      text: 'Anda akan diarahkan ke halaman sambutan lengkap',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#1E88E5',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/sambutan');
      }
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Image ONLY - tanpa tombol play */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <img 
              src="src/assets/images/gallery/sambutan_kepala_sekolah.png" 
              alt="Kepala Sekolah" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Sambutan Kepala Sekolah
            </h2>
            <h3 className="text-xl text-gray-600 mb-6">
              SD Negeri 01 BandarHarjo
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              "Puji dan syukur mari kita panjatkan kehadirat Allah SWT. Yang senantiasa dengan sifat kasih dan sayangnya banyak memberikan nikmat ..."
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

export default Sambutan;
