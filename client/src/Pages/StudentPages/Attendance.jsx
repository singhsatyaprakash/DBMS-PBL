import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

// --- Updated AttendanceBar Component ---
const AttendanceBar = ({ percentage }) => {
  // Using Emerald (good), Amber (warning), and Rose (danger)
  let progressBg = 'bg-emerald-500'; // Good (>= 85%)
  if (percentage < 85) progressBg = 'bg-amber-500'; // Warning
  if (percentage < 75) progressBg = 'bg-rose-500';   // Danger

  return (
    // Added dark mode background for the bar track
    <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`${progressBg} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// --- Custom Bar for Hero Card ---
const HeroAttendanceBar = ({ percentage }) => {
    return (
      <div className="w-full bg-white/30 rounded-full h-2.5">
        <div
          className="bg-white h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
};


// --- Main Attendance Component ---
const Attendance = () => {
  const { student } = useContext(StudentContext);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const studentId = student?.id || student?._id; 

    if (!student || !studentId) {
      setLoading(false);
      setError("Student not logged in.");
      return;
    }

    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/student/my-attendance/${studentId}`
        );
        
        const mappedData = response.data.map(stat => ({
          attended: stat.attendedLectures,
          total: stat.totalLectures,
          percentage: stat.percentage,
          subject: stat.subject_name,
          code: stat.subject_code,
          sf_id: stat.sf_id 
        }));
        setAttendanceStats(mappedData);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError("Could not fetch attendance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [student]);

  // Calculate Overall Statistics
  const overall = attendanceStats.reduce(
    (acc, subject) => {
      acc.total += subject.total;
      acc.attended += subject.attended;
      return acc;
    },
    { total: 0, attended: 0 }
  );

  const overallPercentage =
    overall.total === 0 ? 100 : (overall.attended / overall.total) * 100;

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      // Added dark mode text color
      <div className="flex flex-col items-center justify-center p-10 min-h-[60vh] text-slate-500 dark:text-slate-400">
         <FaSpinner className="animate-spin text-4xl mb-4" />
         <span className="text-xl">Loading attendance data...</span>
      </div>
    );
  }

  if (error) {
    return (
        // Added dark mode text color
        <div className="flex items-center justify-center p-10 min-h-[60vh] text-2xl text-red-600 dark:text-red-500">
            {error}
        </div>
    );
  }

  if (attendanceStats.length === 0) {
    return (
        // Added dark mode text color
        <div className="flex items-center justify-center p-10 min-h-[60vh] text-2xl text-slate-500 dark:text-slate-400">
            No attendance data found.
        </div>
    );
  }

  return (
    // === FIX HERE ===
    // Added dark:bg-slate-900 to set a dark background in dark mode
    <main className="p-6 lg:p-10 bg-gray-50 dark:bg-slate-900 min-h-screen">
      
      {/* This h1 already had dark:text-white, so it will be visible now */}
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
        My Attendance
      </h1>

      {/* --- New Overall Attendance Card (Indigo Gradient) --- */}
      {/* This card is a gradient, so it doesn't need dark mode classes */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xl rounded-2xl p-8 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left Side: Percentage */}
            <div className="text-center md:text-left">
                <div className="text-lg font-medium text-indigo-100 mb-1">Overall Percentage</div>
                <div className="text-6xl font-extrabold tracking-tight">
                    {overallPercentage.toFixed(1)}%
                </div>
                <div className="text-indigo-200">Total Classes Attended</div>
            </div>
            
            {/* Right Side: Numbers & Bar */}
            <div className="w-full md:w-1f_id-2 lg:w-2/5">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-medium text-indigo-100">Progress</span>
                    <span className="text-lg font-bold">
                        {overall.attended}
                        <span className="text-indigo-200 font-medium"> / {overall.total} Classes</span>
                    </span>
                </div>
                <HeroAttendanceBar percentage={overallPercentage} />
            </div>
        </div>
      </div>

      {/* This h2 also had dark:text-white and will now be visible */}
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-white">
        Subject-wise Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendanceStats.map((subject) => {
          
          const percentage = subject.percentage; 
          
          let borderColor = '#10B981'; // emerald-500
          if (percentage < 85) borderColor = '#F59E0B'; // amber-500
          if (percentage < 75) borderColor = '#F43F5E'; // rose-500
          
          return (
            // This card already had dark:bg-gray-800, so it was correct
            <div
              key={subject.sf_id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border-l-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ borderColor: borderColor }}
            >
              {/* All text inside the card already had dark mode classes */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate pr-4" title={subject.subject}>
                  {subject.subject} 
                </h3>
                <span className="text-sm font-mono text-slate-500 dark:text-gray-400 flex-shrink-0">
                  {subject.code}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-gray-100">
                  {percentage.toFixed(1)}%
                </span>
                <span className="font-semibold text-slate-600 dark:text-gray-300">
                  {subject.attended} / {subject.total}
                </span>
              </div>
              <AttendanceBar percentage={percentage} />
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Attendance;