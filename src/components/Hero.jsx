import { useNavigate } from "react-router-dom"; 

const Hero = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/kontak");   // ganti "/kontak" dengan path yang sesuai di App.jsx
    // atau kalau ingin scroll ke atas halaman kontak:
    // navigate("/kontak", { replace: true });
    // window.scrollTo(0, 0);
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg)",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <p className="text-2xl font-light md:text-xl lg:text-md mb-6 opacity-50">
            MOTTO
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            SD Negeri 01 Bandar Harjo Beriman, Berilmu, dan Berbudi Luhur.
          </h1>

          {/* Tombol pindah ke halaman kontak */}
          <button
            onClick={handleContactClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition duration-300 transform hover:scale-105"
          >
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;