import axios from 'axios';
import React, { useEffect, useState } from 'react';

// --- ENHANCED ICON COMPONENTS ---
const BullhornIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0 0"></path>
    <path d="M256 32C114.6 32 0 146.6 0 288v28.31C0 348.3 22.1 368 49.31 368H64v64c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-64h192v64c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-64h14.69c27.21 0 49.31-19.7 49.31-49.69V288C512 146.6 397.4 32 256 32zm160 304H96c-17.67 0-32-14.33-32-32 0-80.1 73.49-145.51 163.41-169.15C232.2 132.51 240 125.79 240 117.31v-13.82c-68.83 20.3-121.2 75.64-138.56 142.16C82.02 250.77 64 267.79 64 288c0 8.84 7.16 16 16 16h352c8.84 0 16-7.16 16-16 0-20.21-18.02-37.23-37.44-32.35-17.36-66.52-69.73-121.86-138.56-142.16v13.82c0 8.48 7.8 15.2 12.59 17.56C374.51 174.49 448 239.9 448 320c0 17.67-14.33 32-32 32z"></path>
  </svg>
);

const FileIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"></path>
  </svg>
);

const LinkIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M440.9 136.3c-13.9-13.9-36.1-13.9-50 0L307 220.2c-6.1 6.1-10.1 14-11.5 22.5l-3.2 19.3c-1.8 11.2-11.4 19.3-22.6 19.3s-20.8-8.1-22.6-19.3l-3.2-19.3c-1.4-8.5-5.4-16.4-11.5-22.5L158.1 136.3c-13.9-13.9-36.1-13.9-50 0s-13.9 36.1 0 50l83.9 83.9c-1.7 3.3-3.2 6.7-4.5 10.2l-37.2 96.9c-4.2 11-2.1 23.4 5.5 31.9s20.1 11.1 31.1 8.2l97.9-25.5c3.6-0.9 7-2.2 10.2-3.9l83.9-83.9c13.9-13.9 13.9-36.1 0-50L440.9 136.3zM256 392c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M148 288h-40c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm108-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 96v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm96-260v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48zm-48 346V160H48v298c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"></path>
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'academic':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'event':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'holiday':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'important':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'notice':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
        </div>
      </div>
    ))}
  </div>
);

const FacultyCirculars = () => {
  const [circularsData, setCircularsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`);
        if (response.status === 200) {
          setCircularsData(response.data.announcements);
        }
      } catch (error) {
        console.error("Failed to fetch circulars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCirculars = filter === 'all' 
    ? circularsData 
    : circularsData.filter(item => item.type?.toLowerCase() === filter);

  const typeCounts = circularsData.reduce((acc, item) => {
    const type = item.type?.toLowerCase() || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <BullhornIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Circulars & Announcements</h1>
            <p className="text-gray-600 mt-1">Stay updated with the latest news and updates</p>
          </div>
        </div>
        
        <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-full font-semibold">
          {circularsData.length} Announcement{circularsData.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({circularsData.length})
          </button>
          {Object.entries(typeCounts).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === type 
                  ? `${getTypeColor(type).replace('bg-', 'bg-').replace('text-', 'text-white bg-')} shadow-md` 
                  : `${getTypeColor(type)} hover:opacity-80`
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8">
            <LoadingSkeleton />
          </div>
        ) : filteredCirculars.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BullhornIcon className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Announcements Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filter === 'all' 
                ? "There are no announcements available at the moment." 
                : `No ${filter} announcements found.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredCirculars.map((item, index) => (
              <div 
                key={item.id} 
                className="p-6 hover:bg-gray-50 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Content Section */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {item.type && (
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    
                    {item.file_url && (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {item.file_url.toLowerCase().includes('.pdf') ? (
                          <FileIcon />
                        ) : (
                          <LinkIcon />
                        )}
                        View Attachment
                      </a>
                    )}
                  </div>
                  
                  {/* Date Section */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 lg:flex-col lg:items-end lg:gap-1 lg:min-w-32">
                    <CalendarIcon className="flex-shrink-0" />
                    <span className="font-medium text-gray-700">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyCirculars;