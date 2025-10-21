import React, { createContext,useState } from 'react';
const FacultyContext = createContext(null);
export { FacultyContext };

export const FacultyProvider = ({ children }) => {
  const [faculty, setFaculty] = useState(null);
  const value = {
    faculty,
    setFaculty,
  };

  return( 
    <FacultyContext.Provider value={value}>
      {children}
    </FacultyContext.Provider>
  );
};

export default FacultyProvider;
