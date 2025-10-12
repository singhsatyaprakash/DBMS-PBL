import React, { useState, useEffect, useContext } from "react";
import {AdminContext} from "../../context/AdminContext";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRegNewspaper,
  FaBullhorn,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import NavbarAdmin from "./NavbarAdmin";
import axios from "axios";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const {admin}=useContext(AdminContext);
  const fetchAnnouncements = async () => {
    try {
      const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`);
      setAnnouncements(response.data.announcements);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: "1200",
      icon: <FaUserGraduate />,
      color: "bg-blue-500",
    },
    {
      title: "Total Faculty",
      value: "80",
      icon: <FaChalkboardTeacher />,
      color: "bg-green-500",
    },
    {
      title: "Courses",
      value: "45",
      icon: <FaBookOpen />,
      color: "bg-yellow-500",
    },
    {
      title: "Notices",
      value: "10",
      icon: <FaRegNewspaper />,
      color: "bg-purple-500",
    },
    {
      title: "Announcements",
      value: "6",
      icon: <FaBullhorn />,
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavbarAdmin toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} />

        {/* This main content shifts right when sidebar is open */}
        <main
          className={`transition-all duration-300 flex-1 p-6 overflow-y-auto ${
            isOpen ? "ml-[220px]" : "ml-0"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Dashboard Overview
          </h2>

          {/* ===== Stats Section ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {/* ===== Recent Announcements ===== */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                <FaBullhorn className="text-pink-500" /> Recent Announcements
              </h3>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-gray-500 italic">No announcements yet.</p>
              ) : (
                announcements.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-all p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex flex-col">
                      <h4 className="font-medium text-gray-800">
                        {item.title}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {item.date}
                      </span>
                    </div>
                    <FaRegNewspaper className="text-gray-400 text-2xl" />
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
