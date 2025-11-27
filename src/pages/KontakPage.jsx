import { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  EnvelopeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const KontakPage = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subject: '',
    pesan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
      setFormData({
        nama: '',
        email: '',
        subject: '',
        pesan: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Alamat',
      color: 'blue',
      content: [
        'Jl. Cumi-cumi Raya No 2',
        'Kec. Semarang Utara',
        'Kota Semarang',
        'Prov. Jawa Tengah'
      ]
    },
    {
      icon: PhoneIcon,
      title: 'Kontak',
      color: 'green',
      content: [
        'sdnbandarharjo01@gmail.com',
        'Telp: (024) 3551189',
        'Fax: (024) 3551189'
      ]
    },
    {
      icon: ClockIcon,
      title: 'Jam Operasional',
      color: 'purple',
      content: [
        'Senin - Jumat: 07.00 - 14.00 WIB',
        'Sabtu: 07.00 - 12.00 WIB',
        'Minggu: Libur'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

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
              Kontak Sekolah
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-2">
              Hubungi kami untuk informasi resmi
            </p>
            <p className="text-2xl font-semibold text-white">
              SD Negeri 01 Bandar Harjo
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information Section */}
          <div>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Informasi Kontak</h2>
              <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 ${getColorClasses(info.color)} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.content.map((line, idx) => (
                            <p key={idx} className="text-gray-600 leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <a
                href="tel:0243551189"
                className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center shadow-md hover:shadow-lg"
              >
                <PhoneIcon className="w-5 h-5 inline-block mr-2" />
                Telepon
              </a>
              <a
                href="mailto:sdnbandarharjo01@gmail.com"
                className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center shadow-md hover:shadow-lg"
              >
                <EnvelopeIcon className="w-5 h-5 inline-block mr-2" />
                Email
              </a>
            </div>
          </div>

          {/* Form Pengaduan Section */}
          <div>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Form Pengaduan</h2>
              <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama Input */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Subjek <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subjek pengaduan"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Pesan Textarea */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                    placeholder="Tulis pesan atau pengaduan Anda..."
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none resize-none transition-colors"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>

              {/* Privacy Note */}
              <p className="text-sm text-gray-500 text-center mt-4">
                Data Anda akan kami jaga kerahasiaannya dan hanya digunakan untuk keperluan komunikasi resmi.
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Lokasi Sekolah</h2>
            <p className="text-gray-600">Kunjungi kami di alamat berikut</p>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-2xl" style={{height: '500px'}}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0647857947573!2d110.42340731477442!3d-6.957499995006094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5c5c5c5c5c%3A0x5c5c5c5c5c5c5c5c!2sSemarang%2C%20Semarang%20City%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{border: 0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="School Location"
            ></iframe>
          </div>
        </div>

        {/* Additional CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Masih Ada Pertanyaan?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Tim kami siap membantu Anda. Hubungi kami melalui telepon atau email untuk informasi lebih lanjut tentang SD Negeri 01 Bandarharjo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0243551189"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              (024) 3551189
            </a>
            <a
              href="mailto:sdnbandarharjo01@gmail.com"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md border-2 border-white"
            >
              sdnbandarharjo01@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KontakPage;