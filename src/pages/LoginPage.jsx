import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Tambahkan logic login di sini
    alert('Login berhasil!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Background */}
      <div 
        className="relative bg-cover bg-center pt-20 min-h-[350px]" 
        style={{backgroundImage: 'url(https://picsum.photos/seed/school-login/1920/400)'}}
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
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-10">
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
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition duration-300 text-lg shadow-lg"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;