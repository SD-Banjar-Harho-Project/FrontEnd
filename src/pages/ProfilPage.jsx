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
  InformationCircleIcon,
  EyeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const ProfilPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section dengan Background */}
      <div 
        className="relative bg-cover bg-center pt-20" 
        style={{
          backgroundImage: 'url(https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg)',
          backgroundColor: '#1a1a2e'
        }}
      >
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content - Hanya Judul dengan Padding Lebih Besar */}
        <div className="relative z-10 container mx-auto px-4 py-32 md:py-40 lg:py-48">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Profile SD Negeri 1 Banjar Harjo
            </h1>
          </div>
        </div>
      </div>

      {/* Visi dan Misi Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Visi */}
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <div className="bg-blue-500 text-white py-4 px-6 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                  <EyeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold">Visi</h3>
              </div>
              <div className="p-8">
                <p className="text-gray-700 leading-relaxed text-justify">
                  Membentuk pembelajar yang akhlakul karimah, berilmu, beretika, berwawasan lingkungan untuk menuju pentas dunia.
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <div className="bg-blue-500 text-white py-4 px-6 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                  <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold">Misi</h3>
              </div>
              <div className="p-8">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Mewujudkan pendidikan dengan keteladanan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Mengembangkan budaya belajar dengan didasari pada kecintaan terhadap ilmu pengetahuan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 font-bold">•</span>
                    <span>Meningkatkan fasilitas sekolah menuju sekolah bersih, sehat dan berwawasan lingkungan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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

      {/* Fasilitas Sekolah Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Fasilitas Sekolah
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
              <img 
                src="https://picsum.photos/seed/aula-facility/400/300" 
                alt="Aula Sekolah"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center bg-gradient-to-b from-white to-gray-50">
                <h3 className="font-bold text-gray-800 text-lg">Aula Sekolah</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
              <img 
                src="https://picsum.photos/seed/kantin-facility/400/300" 
                alt="Kantin"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center bg-gradient-to-b from-white to-gray-50">
                <h3 className="font-bold text-gray-800 text-lg">Kantin</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
              <img 
                src="https://picsum.photos/seed/building-facility/400/300" 
                alt="SDN01 Banjar Harjo"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center bg-gradient-to-b from-white to-gray-50">
                <h3 className="font-bold text-gray-800 text-lg">SDN01 Banjar Harjo</h3>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
              <img 
                src="https://picsum.photos/seed/field-facility/400/300" 
                alt="Halaman"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center bg-gradient-to-b from-white to-gray-50">
                <h3 className="font-bold text-gray-800 text-lg">Halaman</h3>
              </div>
            </div>
          </div>

          {/* Slider Navigation untuk Fasilitas */}
          <div className="flex justify-center mt-8 gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition">
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition">
              <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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