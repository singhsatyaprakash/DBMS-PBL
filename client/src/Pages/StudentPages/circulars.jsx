import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- ICONS ---
// Added icons for the "View Attachment" button
const FileIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"></path></svg>
);

const LinkIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M440.9 136.3c-13.9-13.9-36.1-13.9-50 0L307 220.2c-6.1 6.1-10.1 14-11.5 22.5l-3.2 19.3c-1.8 11.2-11.4 19.3-22.6 19.3s-20.8-8.1-22.6-19.3l-3.2-19.3c-1.4-8.5-5.4-16.4-11.5-22.5L158.1 136.3c-13.9-13.9-36.1-13.9-50 0s-13.9 36.1 0 50l83.9 83.9c-1.7 3.3-3.2 6.7-4.5 10.2l-37.2 96.9c-4.2 11-2.1 23.4 5.5 31.9s20.1 11.1 31.1 8.2l97.9-25.5c3.6-0.9 7-2.2 10.2-3.9l83.9-83.9c13.9-13.9 13.9-36.1 0-50L440.9 136.3zM256 392c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z"></path></svg>
);

// Updated with new types from your API data
const getTagClasses = (type) => {
  switch (type?.toLowerCase()) {
    case 'academic':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'holiday':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'exam':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'event':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};

// Helper function to format the date
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Circulars = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetechData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`);
        if (response.status === 200) {
          console.log(response.data.announcements);
          setAnnouncements(response.data.announcements);
        }
      } catch (error) {
        console.error("Failed to fetch circulars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetechData();
  }, []);

  return (
    <>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Circulars & Announcements</h2>
        <div className="space-y-5">
          {/* --- LOADING AND EMPTY STATES --- */}
          {loading && (
            <div className="text-center p-10 text-slate-500">Loading...</div>
          )}
          {!loading && announcements.length === 0 && (
             <div className="text-center p-10 text-slate-500">No announcements found.</div>
          )}

          {/* --- ANNOUNCEMENTS LIST --- */}
          {announcements.map((item) => {
            const isLong = item.description.length > 200;
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="bg-white rounded-lg shadow p-5 border border-slate-200 transition-shadow hover:shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                  <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTagClasses(item.type)} flex-shrink-0`}>
                    {item.type}
                  </span>
                </div>
                
                {/* Use created_at field and format it */}
                <div className="text-sm text-slate-600 mb-3">{formatDate(item.created_at)}</div>
                
                {/* Description with "Read More" logic */}
                <div className="text-slate-700 text-sm leading-relaxed">
                  {isLong && !isExpanded
                    ? (
                      <>
                        {item.description.slice(0, 200)}...
                        <button
                          className="ml-2 text-blue-600 hover:underline text-xs font-medium"
                          onClick={() => setExpandedId(item.id)}
                        >
                          Read More
                        </button>
                      </>
                    )
                    : item.description
                  }
                </div>
                
                {/* "Show Less" button */}
                {isLong && isExpanded && (
                  <button
                    className="mt-2 text-blue-600 hover:underline text-xs font-medium"
                    onClick={() => setExpandedId(null)}
                  >
                    Show Less
                  </button>
                )}
                
                {/* --- ACTION BUTTON --- */}
                {/* Show "View Attachment" only if file_url exists */}
                {item.file_url && (
                  <div className="mt-4 text-left sm:text-right">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {item.file_url.toLowerCase().includes('.pdf') ? <FileIcon /> : <LinkIcon />}
                      View Attachment
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Circulars;