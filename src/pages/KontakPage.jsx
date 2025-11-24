import { useState } from 'react';
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

const KontakPage = () => {
  const [formData, setFormData] = useState({
    alamat: '',
    email: '',
    subject: '',
    pesan: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Tambahkan logic kirim form di sini
    alert('Pesan berhasil dikirim!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Background */}
      <div 
        className="relative bg-cover bg-center pt-20 min-h-[350px]" 
        style={{backgroundImage: 'url(https://picsum.photos/seed/school-contact/1920/400)'}}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Kontak Sekolah
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-2">
              Hubungi kami untuk informasi resmi
            </p>
            <p className="text-2xl font-semibold text-white">
              SD Negeri 01 Banjar Harjo
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Informasi Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">INFORMASI</h2>
              <div className="w-20 h-1 bg-gray-800"></div>
            </div>

            {/* Alamat Card */}
            <div className="bg-gray-300 rounded-lg p-8 mb-6 text-center">
              <div className="flex justify-center mb-4">
                <MapPinIcon className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Alamat</h3>
              <p className="text-gray-700 leading-relaxed">
                Jl. Brigjen S. Sudiarto KM 10 ,<br />
                Pedurungan, Kec.<br />
                Pedurungan, Kota Semarang<br />
                Prov. Jawa Tengah
              </p>
            </div>

            {/* Contact Card */}
            <div className="bg-gray-300 rounded-lg p-8 mb-6 text-center">
              <div className="flex justify-center mb-4">
                <PhoneIcon className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact</h3>
              <p className="text-gray-700 mb-2">sdnpedurungankidul01@gmail.com</p>
              <p className="text-gray-700 mb-2">Telp : (024) 6715408</p>
              <p className="text-gray-700">Fax : (024) 6715408</p>
            </div>

            {/* Jam Operasional Card */}
            <div className="bg-gray-300 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <ClockIcon className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Jam Operasioinal</h3>
              <p className="text-gray-700 mb-2">Senin - Kamis: Pukul 08.00 - 15.00 WIB</p>
              <p className="text-gray-700 mb-2">Jumat: Pukul 08.00 - 11.30 WIB</p>
              <p className="text-gray-700">Sabtu: PPK di Rumah Masing-masing</p>
            </div>
          </div>

          {/* Form Pengaduan Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">FORM PENGADUAN</h2>
              <div className="w-20 h-1 bg-gray-800"></div>
            </div>

            <div className="bg-gray-300 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Alamat Input */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Alamat"
                    className="w-full px-4 py-3 rounded-md border-2 border-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md border-2 border-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-md border-2 border-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Pesan Textarea */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Pesan</label>
                  <textarea
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    placeholder="Pesan"
                    rows="5"
                    className="w-full px-4 py-3 rounded-md border-2 border-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-md transition duration-300 border-2 border-gray-400"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-16">
          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg" style={{height: '450px'}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.3089624851614!2d110.44247931477466!3d-6.986418395009729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708cd5e3e3e3e3%3A0x3e3e3e3e3e3e3e3e!2sSMP%20Negeri%201%20Cibadak!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{border: 0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KontakPage;