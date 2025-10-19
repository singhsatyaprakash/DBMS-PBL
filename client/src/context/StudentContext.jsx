import React, { createContext, useState } from 'react';

const StudentContext = createContext(null);
export { StudentContext };

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const value = {
    student,
    setStudent,
  };

  return(
    <StudentContext.Provider value={value}>
        {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
