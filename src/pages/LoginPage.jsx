import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        username: formData.username,
        password: formData.password
      });

      console.log("Login Response:", response);

      // Backend mengembalikan token di response.data.token
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Token saved:", token);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          console.log("User saved:", user);
        }

        alert("Login berhasil!");
        navigate("/admin/dashboard");
      } else {
        setError("Login gagal. Token tidak ditemukan.");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        setError(err.response.data?.message || "Username atau password salah!");
      } else if (err.request) {
        setError(
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        );
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Background */}
      <div
        className="relative bg-cover bg-center pt-20 min-h-[350px]"
        style={{
          backgroundImage:
            "url(https://picsum.photos/seed/school-login/1920/400)"
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center flex items-center justify-center h-full px-4 py-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Login
            </h1>
            <p className="text-2xl font-semibold text-white">
              SD Negeri 01 Banjar Harjo
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-300 rounded-lg overflow-hidden shadow-xl">
            {/* Header Form */}
            <div className="bg-gray-300 border-b-4 border-gray-800 p-8 flex items-center justify-between">
              <h2 className="text-4xl font-bold text-gray-800">LOGIN</h2>
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-10">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p className="text-center font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Username */}
                <div>
                  <label className="block text-gray-800 font-bold text-lg mb-3 text-center">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full px-6 py-4 rounded-lg border-2 border-gray-400 focus:border-blue-500 focus:outline-none text-center text-lg"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-800 font-bold text-lg mb-3 text-center">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-6 py-4 rounded-lg border-2 border-gray-400 focus:border-blue-500 focus:outline-none text-center text-lg"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition duration-300 text-lg shadow-lg disabled:bg-blue-300"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {/* Development Mode */}
              {import.meta.env.DEV && (
                <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                  <p className="text-sm text-gray-700 text-center mb-2">
                    <strong>🔧 Mode Development</strong>
                  </p>
                  <p className="text-xs text-gray-600 text-center">
                    Pastikan backend sudah running di: <br />
                    <code className="bg-gray-200 px-2 py-1 rounded">
                      http://localhost:5000
                    </code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
