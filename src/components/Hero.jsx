import Swal from "sweetalert2";

const Hero = () => {
  const handleContactClick = () => {
    Swal.fire({
      title: "Hubungi Kami",
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input type="text" id="nama" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama Anda">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan email Anda">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
            <textarea id="pesan" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tulis pesan Anda"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Batal",
      confirmButtonColor: "#1E88E5",
      preConfirm: () => {
        const nama = document.getElementById("nama").value;
        const email = document.getElementById("email").value;
        const pesan = document.getElementById("pesan").value;

        if (!nama || !email || !pesan) {
          Swal.showValidationMessage("Mohon lengkapi semua field");
          return false;
        }
        return { nama, email, pesan };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Pesan Terkirim!",
          text: "Terima kasih, pesan Anda telah diterima.",
          confirmButtonColor: "#1E88E5"
        });
      }
    });
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(https://picsum.photos/seed/school-hero/1920/1080)"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <p className="text-2xl font-light md:text-xl lg:text-md mb-6 opacity-50">
            MOTTO
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            SD Negeri 01 Bandar Harjo Beriman, Berilmu, dan Berbudi Luhur.
          </h1>
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
