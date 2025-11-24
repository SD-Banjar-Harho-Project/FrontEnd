import { useState } from 'react';

const GuruPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header dengan Background */}
      <div 
        className="relative bg-cover bg-center pt-20 min-h-[300px] md:min-h-[350px]" 
        style={{backgroundImage: 'url(https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg)'}}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Struktur Organisasi & Data Guru
            </h1>
            <p className="text-xl md:text-2xl text-white/90">SD Negeri 01 Banjar Harjo</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Kepala Sekolah */}
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-6 uppercase">Kepala Sekolah</h2>
          <img src="https://i.pravatar.cc/200?img=47" alt="Kepala Sekolah" className="w-32 h-32 mx-auto rounded-lg mb-4 object-cover shadow-md" />
          <h3 className="text-xl font-bold mb-1">Christina Ardiyanti, S. Pd</h3>
          <p className="text-gray-600 font-semibold">123456789012345678</p>
        </div>

        {/* Wakep Sekolah */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <h3 className="text-lg font-bold mb-4 uppercase">Wakil Kepala Sekolah {num}</h3>
              <img src={`https://i.pravatar.cc/150?img=${30 + num}`} alt={`Wakep ${num}`} className="w-28 h-28 mx-auto rounded-lg mb-3 object-cover shadow-md" />
              <p className="font-bold text-lg">Nama Wakep {num}, S.Pd</p>
              <p className="text-gray-600 font-semibold">123456789012345678</p>
            </div>
          ))}
        </div>

        {/* Staff TU & Bendahara */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {["Staff TU", "Staff TU", "Bendahara", "Bendahara"].map((title, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <h3 className="text-lg font-bold mb-4 uppercase">{title}</h3>
              <img src={`https://i.pravatar.cc/150?img=${40 + i}`} alt={title} className="w-28 h-28 mx-auto rounded-lg mb-3 object-cover shadow-md" />
              <p className="font-bold text-lg">Nama {title}, S.Pd</p>
              <p className="text-gray-600 font-semibold">123456789012345678</p>
            </div>
          ))}
        </div>

        {/* Staff TU Tambahan */}
        <div className="max-w-xs mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
            <h3 className="text-lg font-bold mb-4 uppercase">Staff TU</h3>
            <img src="https://i.pravatar.cc/150?img=45" alt="Staff TU" className="w-28 h-28 mx-auto rounded-lg mb-3 object-cover shadow-md" />
            <p className="font-bold text-lg">Nama Staff, S.Pd</p>
            <p className="text-gray-600 font-semibold">123456789012345678</p>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default GuruPage;