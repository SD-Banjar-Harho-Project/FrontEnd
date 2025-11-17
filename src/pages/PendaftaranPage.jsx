const PendaftaranPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center pt-20" 
        style={{backgroundImage: 'url(https://picsum.photos/seed/ppdb/1920/500)'}}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          {/* Tombol Download di Kanan Atas */}
          <div className="absolute top-8 right-8 flex gap-4">
            <button className="bg-white/90 hover:bg-white text-gray-800 px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Surat Edaran Untuk Semua SD
            </button>
            <button className="bg-white/90 hover:bg-white text-gray-800 px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Surat Pemberitahuna PPDB
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-6 py-2 rounded-md font-semibold transition">
              Cek Hasil PPDB
            </button>
          </div>

          {/* Judul Utama */}
          <div className="max-w-3xl mx-auto mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Selamat datang calon peserta didik baru
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              SMPN 1 CIBADAK
            </h2>
            <p className="text-2xl text-white/90 mb-8">
              Tahun Pelajaran 2021-2022
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold transition transform hover:scale-105">
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Informasi Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-500 text-white p-6 rounded-t-lg">
            <h2 className="text-3xl font-bold text-center">Informasi</h2>
          </div>
          
          <div className="bg-white p-12 rounded-b-lg shadow-lg">
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Sebagai informasi, Pendaftaran untuk periode 2021-2022 untuk jalur Afirmasi, Perpindahan Orangtua/Wali, dan Prestasi akan dibuka pada tanggal <strong>28 Juni s.d 2 Juli 2021</strong>, sedangkan untuk jalur Zonasi akan dibuka pada tanggal <strong>5 Juli – 9 Juli 2021</strong>
              </p>
              
              <p>
                Simulasi pendaftaran sudah dibuka, namun diluar tanggal yang disebutkan diatas, akan dihapus kembali
              </p>
              
              <p className="text-center font-semibold text-xl mt-8">
                Terima Kasih
              </p>
              
              <p className="text-center font-semibold text-gray-800">
                Admin PPDB SMPN 1 Cibadak
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendaftaranPage;