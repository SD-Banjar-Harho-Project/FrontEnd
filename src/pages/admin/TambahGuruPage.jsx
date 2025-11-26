import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const TambahGuruPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    class_name: "",
    subject_id: "",
    email: "",
    phone: "",
    bio: "",
    join_date: new Date().toISOString().split("T")[0],
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState("");

  // Data fallback (hardcode) kalau API error atau format salah
  const fallbackSubjects = [
    { id: 1, name: "Matematika" },
    { id: 2, name: "Bahasa Indonesia" },
    { id: 3, name: "Bahasa Inggris" },
    { id: 4, name: "IPA" },
    { id: 5, name: "IPS" },
    { id: 6, name: "Seni Budaya" },
    { id: 7, name: "Pendidikan Jasmani" },
    { id: 8, name: "PKN" },
    { id: 9, name: "Agama" },
    { id: 10, name: "TIK" },
  ];

  // Fetch daftar mata pelajaran
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      console.log("Full response /subjects:", response);

      let dataArray = [];

      // Coba ambil data dari berbagai kemungkinan struktur
      if (response?.data?.data && Array.isArray(response.data.data)) {
        dataArray = response.data.data;
      } else if (Array.isArray(response?.data)) {
        dataArray = response.data;
      } else if (response?.data?.subjects && Array.isArray(response.data.subjects)) {
        dataArray = response.data.subjects;
      } else if (response?.data && typeof response.data === "object") {
        // Kalau object biasa, ambil semua value yang valid
        dataArray = Object.values(response.data).filter(
          (item) => item && (item.id || item.subject_id)
        );
      }

      // Pastikan setiap item punya id & name
      const cleaned = dataArray
        .map((item) => ({
          id: item.id || item.subject_id || item._id,
          name: item.name || item.subject_name || "Tanpa Nama",
        }))
        .filter((item) => item.id);

      setSubjects(cleaned.length > 0 ? cleaned : fallbackSubjects);
    } catch (err) {
      console.error("Gagal mengambil mata pelajaran:", err);
      // Kalau error, pakai fallback
      setSubjects(fallbackSubjects);
      setError("Gagal memuat daftar mata pelajaran. Menggunakan data default.");
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nama lengkap harus diisi");
      return false;
    }
    if (!formData.subject_id) {
      setError("Mata pelajaran harus dipilih");
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        subject_id: parseInt(formData.subject_id, 10),
      };

      const response = await api.post("/teachers", dataToSend);

      if (response.status === 200 || response.status === 201) {
        alert("Data guru berhasil ditambahkan!");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Error submit:", err);
      if (err.response?.status === 401) {
        setError("Sesi habis. Mengalihkan ke login...");
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      } else if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        if (errors) {
          const msg = Object.values(errors).flat().join(", ");
          setError("Validasi gagal: " + msg);
        } else {
          setError("Data tidak valid");
        }
      } else {
        setError(err.response?.data?.message || "Gagal menyimpan data guru");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBatal = () => {
    const hasData = Object.values(formData).some(
      (val) => val && val !== new Date().toISOString().split("T")[0]
    );
    if (hasData && !window.confirm("Yakin ingin membatalkan? Data tidak akan disimpan.")) {
      return;
    }
    navigate("/admin/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
                Tambah Data Guru
              </h1>
              <p style={{ color: "#6b7280", marginTop: "8px" }}>
                Isi formulir di bawah untuk menambah data guru baru
              </p>
            </div>
            <button
              onClick={handleBatal}
              style={{
                padding: "12px 20px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Kembali
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "#fef2f2",
              borderLeft: "4px solid #ef4444",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ color: "#991b1b", margin: 0, fontWeight: "500" }}>{error}</p>
            <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "20px", cursor: "pointer" }}>
              x
            </button>
          </div>
        )}

        {/* Form */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            padding: "32px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {/* Nama Lengkap */}
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                  Nama Lengkap <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Masukkan nama lengkap"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
                />
              </div>

              {/* NIP */}
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>NIP</label>
                <input
                  type="text"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Masukkan NIP"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px" }}
                />
              </div>

              {/* Kelas */}
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Kelas</label>
                <input
                  type="text"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Contoh: 5A, 6B"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px" }}
                />
              </div>

              {/* Mata Pelajaran */}
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>
                  Mata Pelajaran <span style={{ color: "#ef4444" }}>*</span>
                </label>
                {loadingSubjects ? (
                  <div style={{ padding: "12px 16px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
                    Memuat mata pelajaran...
                  </div>
                ) : (
                  <select
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px" }}
                  >
                    <option value="">-- Pilih Mata Pelajaran --</option>
                    {Array.isArray(subjects) &&
                      subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="email@example.com"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px" }}
                />
              </div>

              {/* No Telepon */}
              <div>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>No. Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="08xx-xxxx-xxxx"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px" }}
                />
              </div>

              {/* Tanggal Bergabung */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Tanggal Bergabung</label>
                <input
                  type="date"
                  name="join_date"
                  value={formData.join_date}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px" }}
                />
              </div>

              {/* Bio */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontWeight: "600", marginBottom: "8px" }}>Bio / Keterangan</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  disabled={loading}
                  placeholder="Masukkan bio atau keterangan tambahan"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #d1d5db", borderRadius: "8px", resize: "vertical" }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "32px", paddingTop: "24px", borderTop: "2px solid #e5e7eb" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "12px 32px",
                  backgroundColor: loading ? "#93c5fd" : "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Menyimpan..." : "Simpan Data"}
              </button>
              <button
                type="button"
                onClick={handleBatal}
                disabled={loading}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#d1d5db",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahGuruPage;