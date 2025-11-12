import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRegNewspaper,
  FaBullhorn,
  FaCalendarAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import NavbarAdmin from "./NavbarAdmin";
import axios from "axios";
import { motion } from "framer-motion";

// Helper for formatted date
const getCurrentDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// --- ✨ Modern Stat Card ---
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
    className={`relative p-6 rounded-2xl shadow-lg text-white backdrop-blur-lg ${color}
    bg-opacity-80 border border-white/20 transition-all duration-300 overflow-hidden`}
  >
    <div className="relative z-10">
      <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">
        {title}
      </h3>
      <p className="text-5xl font-extrabold mt-2 drop-shadow-sm">{value || 0}</p>
    </div>
    <div className="absolute -right-2 -bottom-2 text-7xl opacity-15 z-0">
      {icon}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const { admin } = useContext(AdminContext);
  const [details, setDetails] = useState({});

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`
      );
      setAnnouncements(response.data.announcements);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  const countDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/count-details`
      );
      setDetails(response.data.data);
    } catch (err) {
      console.error("Failed to fetch counts:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    countDetails();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: details?.studentCount,
      icon: <FaUserGraduate />,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      title: "Total Faculty",
      value: details?.facultyCount,
      icon: <FaChalkboardTeacher />,
      color: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      title: "Courses",
      value: details?.courseCount,
      icon: <FaBookOpen />,
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    },
    {
      title: "Notices",
      value: details?.announcementCount,
      icon: <FaRegNewspaper />,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      title: "Departments",
      value: details?.departmentCount,
      icon: <FaBullhorn />,
      color: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 mt-12">
      <NavbarAdmin toggleSidebar={() => setIsOpen(!isOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} />

        <main
          className={`transition-all duration-500 flex-1 p-8 overflow-y-auto ${
            isOpen ? "ml-[220px]" : "ml-0"
          }`}
        >
          {/* ===== Header ===== */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
              Welcome back, {admin?.name || "Admin"}! 👋
            </h2>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <FaCalendarAlt className="text-slate-400" />
              {getCurrentDate()}
            </p>
          </motion.div>

          {/* ===== Stats Grid ===== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </motion.div>

          {/* ===== Announcements ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
                <FaBullhorn className="text-pink-500" /> Recent Announcements
              </h3>
            </div>

            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <FaRegNewspaper className="mx-auto text-5xl text-slate-300 mb-3" />
                  <p className="text-slate-500 italic">
                    No announcements to show.
                  </p>
                </div>
              ) : (
                announcements.slice(0, 5).map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md border border-slate-200/60 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-full flex items-center justify-center">
                      <FaBullhorn />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 text-base">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
