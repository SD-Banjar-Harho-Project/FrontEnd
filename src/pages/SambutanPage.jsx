const SambutanPage = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sambutan Kepala Sekolah
          </h1>
          <h2 className="text-2xl text-gray-600 mb-8">
            SMP Negeri 1 Cibadak
          </h2>
          
          <div className="mb-8">
            <img 
              src="https://picsum.photos/seed/headmaster-full/800/600" 
              alt="Kepala Sekolah"
              className="w-full rounded-lg shadow-md"
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Puji dan syukur mari kita panjatkan kehadirat Allah SWT. Yang senantiasa dengan sifat kasih dan sayangnya banyak memberikan nikmat kepada kita semua. Shalawat serta salam semoga selalu tercurah kepada Nabi Muhammad SAW, keluarga, sahabat, dan pengikutnya hingga akhir zaman.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Selamat datang di website resmi SD Negeri 01 Bandar Harjo. Melalui website ini, kami berharap dapat memberikan informasi yang lengkap dan terkini mengenai berbagai kegiatan dan program pendidikan yang kami selenggarakan.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              SD Negeri 01 Bandar Harjo berkomitmen untuk memberikan pendidikan yang berkualitas dengan mengedepankan nilai-nilai karakter yang tercermin dalam visi kami: "Cerdas Beretika". Kami percaya bahwa pendidikan tidak hanya tentang akademik, tetapi juga tentang membentuk karakter yang kuat dan berakhlak mulia.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kami terus berupaya meningkatkan kualitas pembelajaran dengan mengembangkan kurikulum yang inovatif, menyediakan fasilitas yang memadai, dan memberdayakan tenaga pendidik yang profesional dan berdedikasi tinggi.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kepada seluruh siswa, orang tua, dan masyarakat, mari kita bersama-sama menciptakan lingkungan belajar yang kondusif dan menyenangkan. Dengan kerja sama yang baik, kita dapat mewujudkan generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Semoga Allah SWT senantiasa memberikan kemudahan dan keberkahan dalam setiap langkah kita. Aamiin.
            </p>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <p className="text-gray-700 font-semibold">Wassalamu'alaikum Wr. Wb.</p>
              <p className="text-gray-800 font-bold mt-4">Kepala Sekolah</p>
              <p className="text-gray-700">SD Negeri 01 Bandar Harjo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SambutanPage;