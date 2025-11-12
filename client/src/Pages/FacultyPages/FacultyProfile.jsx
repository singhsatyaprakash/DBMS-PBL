import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useFaculty from '../../context/useFaculty';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaVenusMars, 
  FaGraduationCap, 
  FaIdBadge, 
  FaCalendarAlt,
  FaUser,
  FaSpinner,
  FaEdit
} from 'react-icons/fa';

const FacultyProfile = () => {
  const { faculty } = useFaculty();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!faculty) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = faculty.faculty_id || faculty.id || faculty._id || faculty.userId;
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/faculty/get-faculty/${id}`);
        console.log(res);
        setDetails(res.data.faculty);
      } catch (err) {
        console.error('Failed to fetch faculty details', err);
        setError('Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [faculty]);

  if (!faculty) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const f = details || faculty;

  const InfoCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
        {title}
      </h3>
      {children}
    </div>
  );

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-gray-800 font-semibold truncate">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Faculty Profile</h1>
            <p className="text-gray-600 mt-2">View and manage your professional information</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-blue-200 hover:bg-blue-50">
            <FaEdit className="text-sm" />
            Edit Profile
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-white">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  {f.profile_image_url ? (
                    <img 
                      src={f.profile_image_url} 
                      alt="profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-4xl font-bold text-white">
                      {(f.name || 'F').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-2">{f.name}</h2>
                <p className="text-xl text-blue-100 mb-3">{f.designation || 'Faculty Member'}</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-blue-100">
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <FaGraduationCap className="text-sm" />
                    <span className="font-medium">{f.department_id || f.department || 'Department'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <FaIdBadge className="text-sm" />
                    <span className="font-medium">{f.faculty_id || f.id || 'ID'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Contact Information */}
          <InfoCard title="Contact Information">
            <div className="space-y-3">
              <InfoItem 
                icon={<FaEnvelope />}
                label="Email Address"
                value={f.email}
              />
              <InfoItem 
                icon={<FaPhone />}
                label="Contact Number"
                value={f.contact_number}
              />
              <InfoItem 
                icon={<FaMapMarkerAlt />}
                label="Address"
                value={f.address}
              />
            </div>
          </InfoCard>

          {/* Academic & Personal */}
          <InfoCard title="Academic & Personal">
            <div className="space-y-3">
              <InfoItem 
                icon={<FaGraduationCap />}
                label="Highest Degree"
                value={f.degree}
              />
              <InfoItem 
                icon={<FaVenusMars />}
                label="Gender"
                value={f.gender}
              />
              <InfoItem 
                icon={<FaCalendarAlt />}
                label="Date of Birth"
                value={f.dob ? new Date(f.dob).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : null}
              />
              <InfoItem 
                icon={<FaIdBadge />}
                label="Faculty ID"
                value={f.faculty_id || f.id}
              />
            </div>
          </InfoCard>
        </div>

        {/* About Section */}
        <InfoCard title="About Me" className="lg:col-span-2">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              {f.bio || f.profile_summary || 'No additional information provided. This section can be updated with your professional background, teaching philosophy, or other relevant information.'}
            </p>
          </div>
        </InfoCard>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaGraduationCap className="text-blue-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">5+</div>
            <div className="text-gray-600 text-sm">Years Experience</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaUser className="text-green-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">120+</div>
            <div className="text-gray-600 text-sm">Students</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FaIdBadge className="text-purple-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-gray-600 text-sm">Subjects</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;