import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import {
  AcademicCapIcon,
  UserIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  DocumentTextIcon,
  ChartBarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ProfilPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { src: "https://picsum.photos/800/400?random=1", caption: "Aula Sekolah" },
    { src: "https://picsum.photos/800/400?random=2", caption: "Kantin" },
    { src: "https://picsum.photos/800/400?random=3", caption: "SDN01 Banjar Harjo" },
    { src: "https://picsum.photos/800/400?random=4", caption: "Halaman" },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section dengan Background Gelap */}
      <div 
        className="relative bg-cover bg-center pt-20" 
        style={{
          backgroundImage: 'url(https://picsum.photos/seed/school-dark/1920/600)',
          backgroundColor: '#1a1a2e'
        }}
      >
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Judul */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Profile SD Negeri 1 Banjar Harjo
            </h1>
          </div>

          {/* Slider */}
          <div className="relative max-w-4xl mx-auto mb-8">
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img 
                src={slides[currentSlide].src} 
                alt={slides[currentSlide].caption} 
                className="w-full h-64 md:h-80 object-cover" 
              />
              
              {/* Tombol Prev */}
              <button 
                onClick={prevSlide} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition transform hover:scale-110"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
              </button>
              
              {/* Tombol Next */}
              <button 
                onClick={nextSlide} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition transform hover:scale-110"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-800" />
              </button>
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-semibold text-center text-lg">
                  {slides[currentSlide].caption}
                </p>
              </div>
            </div>

            {/* Thumbnail Navigasi */}
            <div className="flex justify-center gap-3 mt-4">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                    currentSlide === index 
                      ? 'border-blue-500 scale-110' 
                      : 'border-white/50 hover:border-white'
                  }`}
                >
                  <img 
                    src={slide.src} 
                    alt={slide.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Judul Section Putih */}
      <div className="bg-white py-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            SD Negeri 01 Banjar Harjo
          </h2>
        </div>
      </div>

      {/* Grid 3 Kolom */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom Kiri - Biru */}
          <div className="bg-blue-600 text-white p-8 rounded-xl space-y-6 shadow-xl">
            <InfoItem 
              icon={<AcademicCapIcon className="w-6 h-6 text-blue-600" />} 
              label="Nama Sekolah" 
              value="SMP Negeri 1 Cibadak" 
            />
            <InfoItem 
              icon={<UserIcon className="w-6 h-6 text-blue-600" />} 
              label="Nama Kepala Sekolah" 
              value="Drs Ossad" 
            />
            <InfoItem 
              icon={<MapPinIcon className="w-6 h-6 text-blue-600" />} 
              label="Alamat" 
              value="Jl. Siliwangi No. 123 Cibadak Sukabumi - Jawa Barat 43351" 
            />
            <InfoItem 
              icon={<GlobeAltIcon className="w-6 h-6 text-blue-600" />} 
              label="Website/Email" 
              value="smpn1cibadak.sch.id / smpn1cbd_kabsi@yahoo.com" 
            />
            <InfoItem 
              icon={<PhoneIcon className="w-6 h-6 text-blue-600" />} 
              label="No. Telp" 
              value="(0266) 531333" 
            />
          </div>

          {/* Kolom Tengah & Kanan */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoCard 
              icon={<DocumentTextIcon className="w-6 h-6 text-gray-500" />} 
              title="No. Pendirian Sekolah" 
              value="-" 
              items={[{label: "No. Sertifikat", value: "421 / 997 / 2005"}]} 
            />
            <InfoCard 
              icon={<AcademicCapIcon className="w-6 h-6 text-gray-500" />} 
              title="Jenjang Akreditasi" 
              value="A" 
              items={[
                {label: "Tahun Didirikan", value: "1965"},
                {label: "Tahun Operasional", value: "1966"}
              ]} 
            />
            <InfoCard 
              icon={<ChartBarIcon className="w-6 h-6 text-gray-500" />} 
              title="No. Statistik Sekolah" 
              value="20 1 02 06 10 008" 
              items={[{label: "NIS", value: "200080"}]} 
            />
            <InfoCard 
              icon={<HomeIcon className="w-6 h-6 text-gray-500" />} 
              title="Status Kepemilikan Tanah" 
              value="Hak Milik" 
              items={[{label: "Luas Tanah", value: "5.007 M²"}]} 
            />
            <InfoCard 
              icon={<BuildingOfficeIcon className="w-6 h-6 text-gray-500" />} 
              title="Status Kepemilikan Bangunan" 
              value="Pemerintah" 
              items={[{label: "Luas Seluruh Bangunan", value: "2.140 M²"}]} 
            />
            <InfoCard 
              icon={<InformationCircleIcon className="w-6 h-6 text-gray-500" />} 
              title="No. Pendirian Sekolah" 
              value="-" 
              items={[
                {label: "No. Sertifikat", value: "421 / 997 / 2005"},
                {label: "Fasilitas Lainnya", value: "-"},
                {label: "Sisi Lahan Seluruhnya", value: "-"}
              ]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen InfoItem untuk Kolom Kiri (Biru)
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-white rounded-full p-2 w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-lg">{value}</p>
      </div>
    </div>
  );
}

// Komponen InfoCard untuk Kolom Kanan (Putih)
function InfoCard({ icon, title, value, items = [] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition">
      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-bold text-center text-gray-800 mb-1">{title}</h3>
      <p className="text-xl font-semibold text-blue-600 text-center mb-2">{value}</p>
      {items.map((item, i) => (
        <div key={i} className="text-center mt-2">
          <p className="text-xs text-gray-500">{item.label}</p>
          <p className="text-sm font-medium text-gray-700">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export default ProfilPage;
