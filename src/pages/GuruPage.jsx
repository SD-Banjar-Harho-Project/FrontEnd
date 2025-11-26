import { useState, useEffect } from "react";
import api from "../services/api";

const GuruPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/teachers");
      console.log("Teachers Response:", response);

      // Robust extractor: handle array, { data: [...] }, paginated shapes, or nested properties
      const extractArray = (resp) => {
        if (!resp) return [];
        const body = resp.data ?? resp;
        if (!body) return [];
        if (Array.isArray(body)) return body;
        if (Array.isArray(body.data)) return body.data;
        if (Array.isArray(body.message)) return body.message;
        if (Array.isArray(body.results)) return body.results;
        if (Array.isArray(body.items)) return body.items;
        if (Array.isArray(body.teachers)) return body.teachers;
        return [];
      };

      const teacherList = extractArray(response);
      console.log("Parsed teacher list:", teacherList);
      setTeachers(teacherList);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError("Gagal memuat data guru. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  // Filter guru berdasarkan class_name untuk menentukan jabatan
  // Karena backend tidak punya field 'position', kita gunakan class_name atau bio sebagai acuan
  const kepalaSekolah = teachers.find((t) =>
    (t.class_name || t.bio)?.toLowerCase().includes("kepala sekolah")
  );

  const wakilKepala = teachers.filter(
    (t) =>
      (t.class_name || t.bio)?.toLowerCase().includes("wakil") ||
      (t.class_name || t.bio)?.toLowerCase().includes("wakep")
  );

  const staffTU = teachers.filter(
    (t) =>
      (t.class_name || t.bio)?.toLowerCase().includes("staff") ||
      (t.class_name || t.bio)?.toLowerCase().includes("tu") ||
      (t.class_name || t.bio)?.toLowerCase().includes("tata usaha")
  );

  const bendahara = teachers.filter((t) =>
    (t.class_name || t.bio)?.toLowerCase().includes("bendahara")
  );

  // Guru biasa adalah yang tidak termasuk kategori di atas
  const guruBiasa = teachers.filter((t) => {
    const identifier = (t.class_name || t.bio || "").toLowerCase();
    return (
      !identifier.includes("kepala") &&
      !identifier.includes("wakil") &&
      !identifier.includes("staff") &&
      !identifier.includes("bendahara") &&
      !identifier.includes("tu")
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data guru...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div
          className="relative bg-cover bg-center pt-20 min-h-[300px]"
          style={{
            backgroundImage:
              "url(https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg)"
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Struktur Organisasi & Data Guru
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                SD Negeri 01 Banjar Harjo
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchTeachers}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header dengan Background */}
      <div
        className="relative bg-cover bg-center pt-20 min-h-[300px] md:min-h-[350px]"
        style={{
          backgroundImage:
            "url(https://sdnbandarharjo02.dikdas.semarangkota.go.id/uploads/gallery/media/WhatsApp%20Image%202023-06-08%20at%2021.08.49.jpeg)"
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Struktur Organisasi & Data Guru
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              SD Negeri 01 Banjar Harjo
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Kepala Sekolah */}
        {kepalaSekolah ? (
          <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-6 uppercase">
              Kepala Sekolah
            </h2>
            <img
              src={
                kepalaSekolah.photo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  kepalaSekolah.name
                )}&size=200&background=3b82f6&color=fff`
              }
              alt="Kepala Sekolah"
              className="w-32 h-32 mx-auto rounded-lg mb-4 object-cover shadow-md"
            />
            <h3 className="text-xl font-bold mb-1">{kepalaSekolah.name}</h3>
            <p className="text-gray-600 font-semibold">
              {kepalaSekolah.nip || "NIP: -"}
            </p>
            {kepalaSekolah.subject_id && (
              <p className="text-sm text-gray-500 mt-2">
                Mata Pelajaran: {kepalaSekolah.subject_id}
              </p>
            )}
          </div>
        ) : null}

        {/* Wakil Kepala Sekolah */}
        {wakilKepala.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">
              Wakil Kepala Sekolah
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wakilKepala.map((wakep) => (
                <div
                  key={wakep.id}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-bold mb-4 uppercase">
                    {wakep.class_name || "Wakil Kepala Sekolah"}
                  </h3>
                  <img
                    src={
                      wakep.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        wakep.name
                      )}&size=150&background=10b981&color=fff`
                    }
                    alt={wakep.name}
                    className="w-28 h-28 mx-auto rounded-lg mb-3 object-cover shadow-md"
                  />
                  <p className="font-bold text-lg">{wakep.name}</p>
                  <p className="text-gray-600 font-semibold">
                    {wakep.nip || "NIP: -"}
                  </p>
                  {wakep.subject_id && (
                    <p className="text-sm text-gray-500 mt-2">
                      {wakep.subject_id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff TU & Bendahara */}
        {(staffTU.length > 0 || bendahara.length > 0) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">
              Staff Administrasi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...staffTU, ...bendahara].map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-bold mb-4 uppercase">
                    {staff.class_name || "Staff"}
                  </h3>
                  <img
                    src={
                      staff.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        staff.name
                      )}&size=150&background=f59e0b&color=fff`
                    }
                    alt={staff.name}
                    className="w-28 h-28 mx-auto rounded-lg mb-3 object-cover shadow-md"
                  />
                  <p className="font-bold text-lg">{staff.name}</p>
                  <p className="text-gray-600 font-semibold">
                    {staff.nip || "NIP: -"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daftar Guru */}
        {guruBiasa.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Daftar Guru</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guruBiasa.map((guru) => (
                <div
                  key={guru.id}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition"
                >
                  <img
                    src={
                      guru.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        guru.name
                      )}&size=150&background=8b5cf6&color=fff`
                    }
                    alt={guru.name}
                    className="w-28 h-28 mx-auto rounded-lg mb-3 object-cover shadow-md"
                  />
                  <p className="font-bold text-lg">{guru.name}</p>
                  <p className="text-gray-600 text-sm mb-2">
                    {guru.nip || "NIP: -"}
                  </p>
                  {guru.subject_id && (
                    <p className="text-sm text-blue-600 font-medium">
                      {guru.subject_id}
                    </p>
                  )}
                  {guru.class_name && (
                    <p className="text-xs text-gray-500 mt-1">
                      Kelas: {guru.class_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {teachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada data guru tersedia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuruPage;
