import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useFaculty from '../../context/useFaculty';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaGraduationCap, FaIdBadge } from 'react-icons/fa';

const FacultyProfile = () => {
  const { faculty } = useFaculty();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!faculty) return; // guard, the ProtectWrapper should set this

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

  if (!faculty) return null; // still validating token

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const f = details || faculty;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex items-center gap-6 p-6 text-white">
          <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {f.profile_image_url ? (
              <img src={f.profile_image_url} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl">{(f.name || 'F').charAt(0)}</div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{f.name}</h2>
            <p className="text-sm opacity-90">{f.designation || 'Faculty'}</p>
            <p className="mt-2 text-sm opacity-90">Dept: {f.department_id || f.department || '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Contact</h3>
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <FaEnvelope />
            <div>{f.email || '—'}</div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <FaPhone />
            <div>{f.contact_number || '—'}</div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <FaMapMarkerAlt />
            <div className="break-words">{f.address || '—'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-3">Academic & Personal</h3>
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <FaIdBadge />
            <div>ID: {f.faculty_id || f.id || '—'}</div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <FaGraduationCap />
            <div>{f.degree || '—'}</div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <FaVenusMars />
            <div>{f.gender || '—'}</div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <div className="font-medium">DOB:</div>
            <div>{f.dob ? new Date(f.dob).toLocaleDateString() : '—'}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold mb-3">About</h3>
        <p className="text-slate-700">{f.bio || f.profile_summary || 'No additional information provided.'}</p>
      </div>
    </div>
  );
};

export default FacultyProfile;
