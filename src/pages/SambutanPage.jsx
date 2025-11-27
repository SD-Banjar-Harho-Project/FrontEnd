import backgroundSD from "/src/assets/images/gallery/sd-01.png"; 
const SambutanPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER dengan Background Sekolah */}
      <div
        className="relative bg-cover bg-center pt-20 min-h-[350px]"
        style={{ backgroundImage: `url(${backgroundSD})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
              Sambutan Kepala Sekolah
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-2">
              Selamat datang di website resmi sekolah kami
            </p>
            <p className="text-2xl font-semibold text-white">
              SD Negeri 01 Banjarharjo
            </p>
          </div>
        </div>
      </div>

      {/* ISI SAMBUTAN */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* Foto Kepala Sekolah */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <img
                  src="/images/kepsek.jpg"
                  alt="Kepala Sekolah"
                  className="w-full rounded-xl shadow-lg object-cover aspect-square"
                  onError={(e) =>
                    (e.target.src =
                      "src/assets/images/gallery/sambutan_kepala_sekolah_2.png")
                  }
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Christina Ardiyanti, S.Pd.
                  </h3>
                  <p className="text-blue-600 font-medium">Kepala Sekolah</p>
                </div>
              </div>
            </div>
          </div>

          {/* Teks Sambutan */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Assalamu'alaikum Warahmatullahi Wabarakatuh
              </h2>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-6 leading-relaxed">
                <p>
                  Puji dan syukur kita panjatkan ke hadirat Allah SWT atas limpahan rahmat dan karunia-Nya, sehingga website resmi <strong>SD Negeri 01 Banjarharjo</strong> dapat hadir sebagai sarana informasi dan komunikasi bagi seluruh warga sekolah dan masyarakat.
                </p>

                <p>
                  Melalui website ini, kami berupaya menyajikan informasi yang aktual, transparan, dan mudah diakses terkait berbagai kegiatan pembelajaran, prestasi siswa, program sekolah, serta pengumuman penting lainnya.
                </p>

                <p>
                  SD Negeri 01 Banjarharjo senantiasa berkomitmen untuk mewujudkan visi <strong>“Terwujudnya Generasi Cerdas, Berakhlak Mulia, dan Berwawasan Lingkungan”</strong> melalui pembelajaran yang inovatif, berbasis teknologi, dan berorientasi pada pengembangan karakter.
                </p>

                <p>
                  Kami percaya bahwa pendidikan yang berkualitas hanya dapat terwujud melalui kerja sama yang solid antara sekolah, orang tua, dan masyarakat. Oleh karena itu, kami sangat mengharapkan dukungan, saran, dan partisipasi aktif dari semua pihak demi kemajuan anak-anak kita.
                </p>

                <p>
                  Semoga website ini dapat menjadi jembatan komunikasi yang efektif dan bermanfaat bagi kita semua.
                </p>

                <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border-l-4 border-blue-600">
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    Wassalamu'alaikum Warahmatullahi Wabarakatuh
                  </p>
                  <p className="text-lg font-bold text-blue-700 mt-8">
                    Hormat kami,
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-3">
                    Christina Ardiyanti, S.Pd.
                  </p>
                  <p className="text-blue-600 font-medium">
                    Kepala Sekolah SD Negeri 01 Banjarharjo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SambutanPage;
