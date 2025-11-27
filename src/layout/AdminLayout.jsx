import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  AcademicCapIcon,
  NewspaperIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(""); // menu yang sedang dibuka
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-expand submenu berdasarkan URL saat mount atau ganti halaman
  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes("/admin/guru")) {
      setExpandedMenu("Data Guru");
    } else if (currentPath.includes("/admin/murid")) {
      setExpandedMenu("Data Murid");
    } else if (currentPath.includes("/admin/berita")) {
      setExpandedMenu("Data Berita");
    } else {
      setExpandedMenu(""); // Dashboard atau lainnya
    }
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleSubmenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? "" : menu);
  };

  const isActive = (path) => location.pathname === path;

  const isParentActive = (paths) => {
    return paths.some((p) => location.pathname.startsWith(p));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: HomeIcon,
      path: "/admin/dashboard",
    },
    {
      title: "Data Guru",
      icon: UserIcon,
      submenu: [
        { title: "Daftar Guru", icon: ListBulletIcon, path: "/admin/guru" },
        { title: "Tambah Guru", icon: PlusCircleIcon, path: "/admin/guru/tambah" },
      ],
      paths: ["/admin/guru"], // untuk deteksi aktif
    },
    {
      title: "Data Murid",
      icon: AcademicCapIcon,
      submenu: [
        { title: "Daftar Murid", icon: ListBulletIcon, path: "/admin/murid" },
        { title: "Tambah Murid", icon: PlusCircleIcon, path: "/admin/murid/tambah" },
      ],
      paths: ["/admin/murid"],
    },
    {
      title: "Data Berita",
      icon: NewspaperIcon,
      submenu: [
        { title: "Daftar Berita", icon: ListBulletIcon, path: "/admin/berita" },
        { title: "Tambah Berita", icon: PlusCircleIcon, path: "/admin/berita/tambah" },
      ],
      paths: ["/admin/berita"],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-transform duration-300 ease-in-out z-40 flex flex-col shadow-2xl`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">SD</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Panel</h1>
              <p className="text-xs text-gray-400">SD Negeri 01</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isExpanded = expandedMenu === item.title;
            const isParentMenuActive = item.paths ? isParentActive(item.paths) : false;

            return (
              <div key={index} className="mb-1">
                {!item.submenu ? (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isParentMenuActive || isExpanded
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="mt-1 bg-gray-800 bg-opacity-60 rounded-lg py-2 px-2">
                        {item.submenu.map((subitem, subindex) => {
                          const SubIcon = subitem.icon;
                          return (
                            <Link
                              key={subindex}
                              to={subitem.path}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all ${
                                isActive(subitem.path)
                                  ? "bg-blue-500 text-white font-medium shadow"
                                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
                              }`}
                              onClick={() => setIsSidebarOpen(false)} // tutup sidebar di mobile
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{subitem.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900 hover:text-white transition-all font-medium"
          >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  SD Negeri 01 Bandarharjo
                </h2>
                <p className="text-sm text-gray-500">Panel Administrasi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">Administrator</p>
                <p className="text-xs text-gray-500">admin@sdnbandarharjo.sch.id</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;