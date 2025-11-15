const ProfilPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Profil Sekolah
          </h1>

          <div className="mb-8">
            <img 
              src="https://picsum.photos/seed/school-profile/800/600" 
              alt="Gedung Sekolah"
              className="w-full rounded-lg shadow-md"
            />
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Identitas Sekolah</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Nama Sekolah</p>
                  <p className="text-gray-800 font-semibold">SD Negeri 01 Bandar Harjo</p>
                </div>
                <div>
                  <p className="text-gray-600">NPSN</p>
                  <p className="text-gray-800 font-semibold">20123456</p>
                </div>
                <div>
                  <p className="text-gray-600">Alamat</p>
                  <p className="text-gray-800 font-semibold">Jl. Siliwangi No 123, Cibadak</p>
                </div>
                <div>
                  <p className="text-gray-600">Kode Pos</p>
                  <p className="text-gray-800 font-semibold">43351</p>
                </div>
                <div>
                  <p className="text-gray-600">Telepon</p>
                  <p className="text-gray-800 font-semibold">(0266)531333</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="text-gray-800 font-semibold">info@sdn1bnjrhrjo.sch.id</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Visi</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-gray-800 font-semibold text-lg">
                  "Mewujudkan Siswa yang Cerdas Beretika"
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Misi</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Menyelenggarakan pendidikan yang berkualitas dan berkarakter</li>
                <li>Mengembangkan potensi akademik dan non-akademik siswa secara optimal</li>
                <li>Menciptakan lingkungan belajar yang kondusif dan menyenangkan</li>
                <li>Menumbuhkan sikap religius dan berakhlak mulia</li>
                <li>Membangun kerjasama yang harmonis dengan orang tua dan masyarakat</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Motto</h2>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg">
                <p className="text-white font-bold text-xl text-center">
                  Ceria, Empati, Rasional, Damai, Aktif, Sabar, Bersih, Elok, Tulus, Iman, Konsiste, Amanah
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Fasilitas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Ruang Kelas</h3>
                  <p className="text-gray-600">Ruang kelas yang nyaman dan dilengkapi dengan fasilitas modern</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Perpustakaan</h3>
                  <p className="text-gray-600">Perpustakaan dengan koleksi buku yang lengkap dan beragam</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Laboratorium Komputer</h3>
                  <p className="text-gray-600">Laboratorium komputer untuk menunjang pembelajaran teknologi</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-800">Lapangan Olahraga</h3>
                  <p className="text-gray-600">Lapangan yang luas untuk kegiatan olahraga dan upacara</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;