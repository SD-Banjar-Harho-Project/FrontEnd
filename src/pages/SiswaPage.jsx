import { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const SiswaPage = () => {
  const [selectedYear, setSelectedYear] = useState('2024/2025');
  const [searchTerm, setSearchTerm] = useState('');

  const kelasData = [
    { id: 1, nama: 'Kelas 1', jumlahSiswa: 32 },
    { id: 2, nama: 'Kelas 2', jumlahSiswa: 30 },
    { id: 3, nama: 'Kelas 3', jumlahSiswa: 28 },
    { id: 4, nama: 'Kelas 4', jumlahSiswa: 35 },
    { id: 5, nama: 'Kelas 5', jumlahSiswa: 33 },
    { id: 6, nama: 'Kelas 6', jumlahSiswa: 31 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Background */}
      <div 
        className="relative bg-cover bg-center pt-20 min-h-[350px]" 
        style={{backgroundImage: 'url(https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg)'}}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Data Kelas
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-2">
              Informasi tentang pembagian kelas.
            </p>
            <p className="text-2xl font-semibold text-white">
              SD Negeri 01 Banjar Harjo
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          
          {/* Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Year Dropdown */}
            <div className="relative inline-block">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-300 rounded-lg px-6 py-3 pr-12 text-gray-800 font-semibold cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 shadow-md"
              >
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
                <option value="2022/2023">2022/2023</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none shadow-md"
              />
            </div>
          </div>

          {/* Kelas Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kelasData.map((kelas) => (
              <div 
                key={kelas.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition cursor-pointer p-8 text-center"
              >
                {/* Folder Icon */}
                <div className="flex justify-center mb-6">
                  <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14h4M12 12v4" />
                  </svg>
                </div>

                {/* Kelas Name */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {kelas.nama}
                </h3>

                {/* Jumlah Siswa */}
                <p className="text-gray-600">
                  {kelas.jumlahSiswa} Siswa
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiswaPage;