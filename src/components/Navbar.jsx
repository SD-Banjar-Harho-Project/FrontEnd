import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <img src="/src/assets/images/logo/logo_sd.png" alt="Logo SD"></img>
            </div>
            <span className="text-sm font-bold text-gray-800 hidden lg:block">
              MOTTO
            </span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>
            <Link
              to="/guru"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Guru
            </Link>
            <Link
              to="/siswa"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Siswa
            </Link>
            <Link
              to="/pendaftaran"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Pendaftaran
            </Link>
            <Link
              to="/lainnya"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              lainya
            </Link>
            <Link
              to="/kontak"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Kontak
            </Link>
            <Link
              to="/Login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;