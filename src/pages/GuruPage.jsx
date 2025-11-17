import { useState } from 'react';

const GuruPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Data guru (contoh)
  const guruData = [
    {
      id: 1,
      nama: "Ps. ELSI HERIYANTI, S.Pd.",
      nip: "196606051992032008",
      pelajaran: "Ilmu Pengetahuan Sosial",
      foto: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      nama: "Drs. Ossad",
      nip: "196203121989031014",
      pelajaran: "Bahasa Indonesia",
      foto: "https://i.pravatar.cc/150?img=33"
    },
    {
      id: 3,
      nama: "Hj. ENCENG NURJASANAH, S.Pd",
      nip: "196202011983042045",
      pelajaran: "Bahasa Indonesia",
      foto: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 4,
      nama: "HANA RIYAN, S.Pd.",
      nip: "196201070198302001",
      pelajaran: "Matematika",
      foto: "https://i.pravatar.cc/150?img=9"
    },
    {
      id: 5,
      nama: "MAMAN, S.Pd, M.M.Pd",
      nip: "196405191989031005",
      pelajaran: "Penjasorkes",
      foto: "https://i.pravatar.cc/150?img=13"
    },
    {
      id: 6,
      nama: "RAHMAN, S.Pd, M.Si.",
      nip: "196703151996031062",
      pelajaran: "Pendidikan Kewarganegaraan",
      foto: "https://i.pravatar.cc/150?img=14"
    },
    {
      id: 7,
      nama: "SITA NURAENI, S.Pd.",
      nip: "197108041998022003",
      pelajaran: "Ilmu Pengetahuan Alam",
      foto: "https://i.pravatar.cc/150?img=10"
    },
    {
      id: 8,
      nama: "DIA LAILASARI, S.Pd",
      nip: "196611231998022001",
      pelajaran: "Bahasa Sunda",
      foto: "https://i.pravatar.cc/150?img=26"
    },
    {
      id: 9,
      nama: "SUPRAYOGI, S.Tn.",
      nip: "196511151998031001",
      pelajaran: "Bahasa Inggris",
      foto: "https://i.pravatar.cc/150?img=12"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header dengan Background */}
      <div 
        className="relative bg-cover bg-center pt-20" 
        style={{backgroundImage: 'url(https://picsum.photos/seed/school-building/1920/400)'}}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Struktur Organisasi & Data Guru
          </h1>
          <p className="text-xl text-white/90">SD Negeri 01 Banjar Harjo</p>
        </div>
      </div>

      {/* Kepala Sekolah */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">KEPALA SEKOLAH</h2>
          <img 
            src="https://i.pravatar.cc/200?img=33" 
            alt="Kepala Sekolah"
            className="w-32 h-32 mx-auto rounded-lg mb-4 object-cover"
          />
          <h3 className="text-xl font-bold mb-1">SYAHRONI, S, PK</h3>
          <p className="text-gray-600">123456</p>
        </div>

        {/* Wakep Sekolah */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-bold mb-3">WAKEP SEKOLAH {num}</h3>
              <img 
                src={`https://i.pravatar.cc/150?img=${30 + num}`} 
                alt={`Wakep ${num}`}
                className="w-24 h-24 mx-auto rounded-lg mb-3 object-cover"
              />
              <p className="font-semibold">SYAHRONI, S, PK</p>
              <p className="text-gray-600 text-sm">123456</p>
            </div>
          ))}
        </div>

        {/* Koordinator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          {[1, 2].map((num) => (
            <div key={num} className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-bold mb-3">KOORDINATOR {num}</h3>
              <img 
                src={`https://i.pravatar.cc/150?img=${35 + num}`} 
                alt={`Koordinator ${num}`}
                className="w-24 h-24 mx-auto rounded-lg mb-3 object-cover"
              />
              <p className="font-semibold">SYAHRONI, S, PK</p>
              <p className="text-gray-600 text-sm">123456</p>
            </div>
          ))}
        </div>

        {/* Data Guru Grid */}
        <div className="border-t-2 border-gray-300 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guruData.map((guru) => (
              <div key={guru.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img 
                  src={guru.foto} 
                  alt={guru.nama}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Nama</span>
                    <p className="font-semibold">{guru.nama}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">NIP</span>
                    <p className="font-semibold">{guru.nip}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Pelajaran</span>
                    <p className="font-semibold">{guru.pelajaran}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-8 h-8 rounded-full bg-blue-600 text-white">1</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">2</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">3</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">4</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300">5</button>
            <button className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuruPage;