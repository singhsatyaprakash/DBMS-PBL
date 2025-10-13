import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPoll, FaIdCard, FaHistory } from 'react-icons/fa';

const ExamSidebar = () => {
  const links = [
    { name: 'Result', path: '/student/exams/result', icon: <FaPoll /> },
    { name: 'Admit Card', path: '/student/exams/admit-card', icon: <FaIdCard /> },
    { name: 'Back Exam', path: '/student/exams/back-exam', icon: <FaHistory /> },
  ];

  const activeLinkStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderLeft: '4px solid #3b82f6',
    paddingLeft: 'calc(1rem - 4px)',
  };

  return (
    <div className="w-64 bg-slate-800 text-slate-200 h-full shadow-lg flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white text-center">Exam Section</h2>
      </div>
      <nav className="mt-4">
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ExamSidebar;
