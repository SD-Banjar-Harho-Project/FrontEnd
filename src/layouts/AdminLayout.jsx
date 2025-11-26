import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  AcademicCapIcon,
  NewspaperIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  ClockIcon,
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

  const menuItems = [
    {
      title: "Dashboard",
      icon: <HomeIcon />,
      path: "/admin/dashboard"
    },
    {
      title: "Data Guru",
      icon: <UserIcon />,
      submenu: [
        { title: "Daftar Guru", icon: <ListBulletIcon />, path: "/admin/guru" },
        {
          title: "Tambah Guru",
          icon: <PlusCircleIcon />,
          path: "/admin/guru/tambah"
        }
      ]
    },
    {
      title: "Data Murid",
      icon: <AcademicCapIcon />,
      submenu: [
        {
          title: "Daftar Murid",
          icon: <ListBulletIcon />,
          path: "/admin/murid"
        },
        {
          title: "Tambah Murid",
          icon: <PlusCircleIcon />,
          path: "/admin/murid/tambah"
        }
      ]
    },
    {
      title: "Data Berita",
      icon: <NewspaperIcon />,
      submenu: [
        {
          title: "Daftar Berita",
          icon: <ListBulletIcon />,
          path: "/admin/berita"
        },
        {
          title: "Tambah Berita",
          icon: <PlusCircleIcon />,
          path: "/admin/berita/tambah"
        }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 fixed h-full z-20 overflow-y-auto`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {isSidebarOpen ? <ClockIcon /> : <Bars3Icon />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <div key={index}>
              {/* Menu tanpa submenu */}
              {!item.submenu ? (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition ${
                    isActive(item.path)
                      ? "bg-gray-800 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span>{item.title}</span>}
                </Link>
              ) : (
                /* Menu dengan submenu */
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      {isSidebarOpen && <span>{item.title}</span>}
                    </div>
                    {isSidebarOpen && (
                      <ChevronDownIcon
                        className={`transition-transform ${
                          expandedMenu === item.title ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {isSidebarOpen && expandedMenu === item.title && (
                    <div className="bg-gray-800">
                      {item.submenu.map((subitem, subindex) => (
                        <Link
                          key={subindex}
                          to={subitem.path}
                          className={`flex items-center gap-3 px-8 py-2 hover:bg-gray-700 transition text-sm ${
                            isActive(subitem.path)
                              ? "bg-gray-700 border-l-4 border-blue-400"
                              : ""
                          }`}
                        >
                          <span>{subitem.icon}</span>
                          <span>{subitem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 hover:bg-red-600 transition text-red-400 hover:text-white"
          >
            <span className="text-xl">
              <ArrowRightStartOnRectangleIcon />
            </span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Top Navigation */}
        <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              SD Negeri 1 Banjar Harjo - Admin Panel
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin</span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="p-6 overflow-y-auto"
          style={{ height: "calc(100vh - 73px)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
