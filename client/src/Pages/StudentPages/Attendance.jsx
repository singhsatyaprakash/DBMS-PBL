import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from '../../context/StudentContext';
import axios from 'axios';
import { 
  FaSpinner, 
  FaChartLine, 
  FaCalendarCheck, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaBook,
  FaUserGraduate
} from 'react-icons/fa';

// --- Enhanced AttendanceBar Component ---
const AttendanceBar = ({ percentage, showLabel = false }) => {
  const getProgressColor = (percent) => {
    if (percent >= 85) return 'bg-gradient-to-r from-emerald-500 to-green-500';
    if (percent >= 75) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-rose-500 to-red-500';
  };

  const getStatusIcon = (percent) => {
    if (percent >= 85) return <FaCheckCircle className="text-emerald-500" />;
    if (percent >= 75) return <FaExclamationTriangle className="text-amber-500" />;
    return <FaExclamationTriangle className="text-rose-500" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        {showLabel && (
          <span className="text-sm font-medium text-gray-600">
            Attendance
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">
            {percentage.toFixed(1)}%
          </span>
          {getStatusIcon(percentage)}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full ${getProgressColor(percentage)} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// --- Enhanced Hero Attendance Bar ---
const HeroAttendanceBar = ({ percentage }) => {
  const getHeroColor = (percent) => {
    if (percent >= 85) return 'from-emerald-500 to-green-500';
    if (percent >= 75) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-white/90">
        <span className="font-medium">Overall Progress</span>
        <span className="font-bold">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${getHeroColor(percentage)} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// --- Stat Card Component ---
const StatCard = ({ icon, label, value, change, className = "" }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change > 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-gray-400 text-2xl">
        {icon}
      </div>
    </div>
  </div>
);

// --- Subject Card Component ---
const SubjectCard = ({ subject, index }) => {
  const getStatusColor = (percentage) => {
    if (percentage >= 85) return 'hover:border-emerald-300 border-emerald-100';
    if (percentage >= 75) return 'hover:border-amber-300 border-amber-100';
    return 'hover:border-rose-300 border-rose-100';
  };

  const getStatusBackground = (percentage) => {
    if (percentage >= 85) return 'bg-emerald-50';
    if (percentage >= 75) return 'bg-amber-50';
    return 'bg-rose-50';
  };

  const getBorderColor = (percentage) => {
    if (percentage >= 85) return '#10B981';
    if (percentage >= 75) return '#F59E0B';
    return '#F43F5E';
  };

  return (
    <div
      className={`bg-white rounded-2xl p-6 border-l-4 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer ${getStatusColor(subject.percentage)} ${getStatusBackground(subject.percentage)}`}
      style={{ 
        borderLeftColor: getBorderColor(subject.percentage),
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {subject.subject}
          </h3>
          <p className="text-sm text-gray-500 font-mono mt-1">
            {subject.code}
          </p>
        </div>
        <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition-transform shadow-sm">
          <FaBook className="text-gray-600 text-sm" />
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {subject.percentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Current</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700">
            {subject.attended}
          </div>
          <div className="text-xs text-gray-500">Attended</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700">
            {subject.total}
          </div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>

      {/* Progress Bar */}
      <AttendanceBar percentage={subject.percentage} />

      {/* Status Message */}
      <div className="mt-3 text-xs font-medium text-gray-600">
        {subject.percentage >= 85 ? 'Excellent attendance! 🎉' :
         subject.percentage >= 75 ? 'Good, keep it up! 💪' :
         'Needs improvement ⚠️'}
      </div>
    </div>
  );
};

// --- Loading Skeleton ---
const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Hero Skeleton */}
    <div className="bg-gray-200 rounded-2xl p-8 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="h-16 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-gray-200">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

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

  const overallPercentage = overall.total === 0 ? 100 : (overall.attended / overall.total) * 100;

  // Calculate additional stats
  const goodSubjects = attendanceStats.filter(s => s.percentage >= 85).length;
  const warningSubjects = attendanceStats.filter(s => s.percentage >= 75 && s.percentage < 85).length;
  const dangerSubjects = attendanceStats.filter(s => s.percentage < 75).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gray-100 rounded-2xl shadow-sm">
              <FaChartLine className="text-2xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Overview</h1>
              <p className="text-gray-600">Loading your attendance data...</p>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-red-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-3xl text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (attendanceStats.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarCheck className="text-3xl text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Attendance Data</h2>
            <p className="text-gray-600 mb-6">
              No attendance records found for your account. This might be because classes haven't started yet or data is being updated.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gray-100 rounded-2xl shadow-sm">
            <FaChartLine className="text-3xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Attendance Overview</h1>
            <p className="text-gray-600 mt-2">
              Track your attendance performance across all subjects
            </p>
          </div>
        </div>

        {/* Hero Overall Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Left Side - Main Stats */}
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 mb-4">
                <FaUserGraduate className="text-2xl text-white/90" />
                <span className="text-lg font-medium text-white/90">Overall Attendance</span>
              </div>
              <div className="text-6xl font-black mb-2">
                {overallPercentage.toFixed(1)}%
              </div>
              <p className="text-white/80 text-lg">
                {overall.attended} of {overall.total} classes attended
              </p>
            </div>
            
            {/* Right Side - Progress */}
            <div className="w-full lg:w-2/5">
              <HeroAttendanceBar percentage={overallPercentage} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<FaCheckCircle className="text-emerald-500" />}
            label="Good Attendance"
            value={goodSubjects}
            change={null}
          />
          <StatCard
            icon={<FaExclamationTriangle className="text-amber-500" />}
            label="Need Attention"
            value={warningSubjects}
            change={null}
          />
          <StatCard
            icon={<FaExclamationTriangle className="text-rose-500" />}
            label="Critical"
            value={dangerSubjects}
            change={null}
          />
        </div>

        {/* Subject-wise Details */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <FaBook className="text-2xl text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Subject-wise Details
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {attendanceStats.length} subjects
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendanceStats.map((subject, index) => (
              <SubjectCard 
                key={subject.sf_id} 
                subject={subject} 
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()} • Contact your department for discrepancies</p>
        </div>
      </div>
    </div>
  );
};

export default Attendance;