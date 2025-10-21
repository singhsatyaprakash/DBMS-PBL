import { useContext } from 'react';
import { FacultyContext } from './FacultyContext';

export const useFaculty = () => {
  const ctx = useContext(FacultyContext);
  if (ctx === undefined) {
    throw new Error('useFaculty must be used within an FacultyProvider');
  }
  return ctx;
};

export default useFaculty;
