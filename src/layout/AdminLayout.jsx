import { useState } from "react";
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
  ListBulletIcon
} from "@heroicons/react/24/outline";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const toggleSubmenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? "" : menu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isMenuActive = (submenu) => {
    return submenu?.some(sub => location.pathname.startsWith(sub.path.split('/').slice(0, -1).join('/')));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: HomeIcon,
      path: "/admin/dashboard"
    },
    {
      title: "Data Guru",
      icon: UserIcon,
      submenu: [
        { title: "Daftar Guru", icon: ListBulletIcon, path: "/admin/guru" },
        { title: "Tambah Guru", icon: PlusCircleIcon, path: "/admin/guru/tambah" }
      ]
    },
    {
      title: "Data Murid",
      icon: AcademicCapIcon,
      submenu: [
        { title: "Daftar Murid", icon: ListBulletIcon, path: "/admin/murid" },
        { title: "Tambah Murid", icon: PlusCircleIcon, path: "/admin/murid/tambah" }
      ]
    },
    {
      title: "Data Berita",
      icon: NewspaperIcon,
      submenu: [
        { title: "Daftar Berita", icon: ListBulletIcon, path: "/admin/berita" },
        { title: "Tambah Berita", icon: PlusCircleIcon, path: "/admin/berita/tambah" }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } fixed lg:static w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen transition-transform duration-300 ease-in-out z-20 flex flex-col shadow-2xl`}
      >
        {/* Logo & Brand */}
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
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const hasActiveSubmenu = isMenuActive(item.submenu);

            return (
              <div key={index} className="mb-1">
                {/* Menu tanpa submenu */}
                {!item.submenu ? (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ) : (
                  /* Menu dengan submenu */
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        hasActiveSubmenu || expandedMenu === item.title
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        expandedMenu === item.title ? "max-h-96 mt-1" : "max-h-0"
                      }`}
                    >
                      <div className="bg-gray-800 bg-opacity-50 rounded-lg py-1 px-2">
                        {item.submenu.map((subitem, subindex) => {
                          const SubIcon = subitem.icon;
                          return (
                            <Link
                              key={subindex}
                              to={subitem.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                                isActive(subitem.path)
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
                              }`}
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

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200 font-medium"
          >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-md px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;