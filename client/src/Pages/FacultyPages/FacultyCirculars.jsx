import axios from 'axios';
import React, { useEffect, useState } from 'react';

// --- ICON COMPONENTS ---
const BullhornIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm0 0"></path><path d="M256 32C114.6 32 0 146.6 0 288v28.31C0 348.3 22.1 368 49.31 368H64v64c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-64h192v64c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-64h14.69c27.21 0 49.31-19.7 49.31-49.69V288C512 146.6 397.4 32 256 32zm160 304H96c-17.67 0-32-14.33-32-32 0-80.1 73.49-145.51 163.41-169.15C232.2 132.51 240 125.79 240 117.31v-13.82c-68.83 20.3-121.2 75.64-138.56 142.16C82.02 250.77 64 267.79 64 288c0 8.84 7.16 16 16 16h352c8.84 0 16-7.16 16-16 0-20.21-18.02-37.23-37.44-32.35-17.36-66.52-69.73-121.86-138.56-142.16v13.82c0 8.48 7.8 15.2 12.59 17.56C374.51 174.49 448 239.9 448 320c0 17.67-14.33 32-32 32z"></path>
  </svg>
);

const FileIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"></path></svg>
);

const LinkIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M440.9 136.3c-13.9-13.9-36.1-13.9-50 0L307 220.2c-6.1 6.1-10.1 14-11.5 22.5l-3.2 19.3c-1.8 11.2-11.4 19.3-22.6 19.3s-20.8-8.1-22.6-19.3l-3.2-19.3c-1.4-8.5-5.4-16.4-11.5-22.5L158.1 136.3c-13.9-13.9-36.1-13.9-50 0s-13.9 36.1 0 50l83.9 83.9c-1.7 3.3-3.2 6.7-4.5 10.2l-37.2 96.9c-4.2 11-2.1 23.4 5.5 31.9s20.1 11.1 31.1 8.2l97.9-25.5c3.6-0.9 7-2.2 10.2-3.9l83.9-83.9c13.9-13.9 13.9-36.1 0-50L440.9 136.3zM256 392c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z"></path></svg>
);


// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper to get a color for the badge
const getTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'academic':
      return 'bg-blue-100 text-blue-800';
    case 'event':
      return 'bg-purple-100 text-purple-800';
    case 'holiday':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const FacultyCirculars = () => {
  const [circularsData, setCircularsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetechData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/get-announcements`);
        if (response.status === 200) {
          // console.log(response.data.announcements);
          setCircularsData(response.data.announcements);
        }
      } catch (error) {
        console.error("Failed to fetch circulars:", error);
        // Optionally set an error state here to show in UI
      } finally {
        setLoading(false);
      }
    };
    fetechData();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl text-blue-600"><BullhornIcon /></div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Circulars & Announcements</h2>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border">
        
        {loading ? (
          <p className="text-center text-slate-500">Loading announcements...</p>
        ) : circularsData.length === 0 ? (
          <p className="text-center text-slate-500">No announcements found.</p>
        ) : (
          <div className="space-y-5">
            {circularsData.map((item) => (
              <div key={item.id} className="p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Type Badge */}
                    {item.type && (
                       <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTypeColor(item.type)}`}>
                         {item.type}
                       </span>
                    )}
                    {/* Date */}
                    <span className="text-sm text-slate-500 font-medium">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-slate-600 mt-2 mb-4">
                  {item.description}
                </p>
                
                {/* Action Button */}
                {item.file_url && (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {/* Check if file is a PDF */}
                    {item.file_url.toLowerCase().includes('.pdf') ? (
                      <FileIcon />
                    ) : (
                      <LinkIcon />
                    )}
                    View Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default FacultyCirculars;