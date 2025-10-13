import React, { useState, useEffect } from 'react';
// REMOVED: import StudentLayout from './StudentLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaFileAlt, FaBullhorn } from 'react-icons/fa';

// Dummy data for announcements
const getDummyAnnouncements = () => [
  {
    id: 1,
    title: 'Midterm Exam Schedule Released',
    date: '2025-10-10',
    type: 'Exam',
    description: 'The schedule for the upcoming midterm examinations has been published. All students are advised to check the university portal for the detailed timetable. Exams will commence from the first week of November.',
  },
  {
    id: 2,
    title: 'Annual Sports Fest "Velocity 2025"',
    date: '2025-10-08',
    type: 'Sports',
    description: 'Get ready for the most awaited event of the year! Velocity 2025 is here. Registrations for all sports including Cricket, Football, Basketball, and Athletics are now open. The event will take place from October 20th to October 25th. All students are encouraged to participate and show their sportsmanship.',
  },
  {
    id: 3,
    title: 'Important Notice Regarding Fee Payment Deadline',
    date: '2025-10-05',
    type: 'Fees',
    description: 'This is a long description to demonstrate the "Read More" functionality. The deadline for the payment of semester fees has been extended to October 30th, 2025. Students who fail to pay the fees by the due date will be charged a late fee of Rs. 500. It is mandatory for all students to clear their dues to be eligible for the end-semester examinations. Please ignore this notice if you have already paid the fees. You can pay the fees online through the ERP portal using Net Banking, Debit Card, Credit Card, or UPI. For any fee-related queries, please contact the accounts office during working hours (9 AM to 4 PM). It is crucial to save the receipt after a successful transaction for future reference. The university will not be responsible for any failed transactions if the receipt is not generated.',
  },
];

const Circulars = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    setAnnouncements(getDummyAnnouncements());
  }, []);

  const getTagClasses = (type) => {
    switch (type) {
      case 'Exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'Sports': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Fees': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    // The <StudentLayout> wrapper is now removed from here
    <>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Circulars & Announcements</h2>

        <div className="space-y-5">
          {announcements.map((item) => {
            const isLong = item.description.length > 200;
            return (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${getTagClasses(item.type)}`}>
                      {item.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">{item.title}</h3>
                  </div>
                  <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{item.date}</span>
                </div>
                <p className="text-slate-600 mt-2 text-sm">
                  {isLong ? `${item.description.substring(0, 200)}...` : item.description}
                  {isLong && (
                    <button onClick={() => setSelectedAnnouncement(item)} className="text-blue-600 font-semibold ml-2 hover:underline">
                      Read More
                    </button>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Announcement Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl"
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{selectedAnnouncement.title}</h3>
                <button onClick={() => setSelectedAnnouncement(null)} className="text-gray-500 hover:text-gray-800"><FaTimes size={20} /></button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedAnnouncement.description}</p>
              </div>
              <div className="p-4 bg-slate-50 text-right rounded-b-lg">
                <button onClick={() => setSelectedAnnouncement(null)} className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Circulars;

