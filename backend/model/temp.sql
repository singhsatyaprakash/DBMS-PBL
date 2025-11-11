SELECT
                subj.subject_name,
                subj.subject_code,
                sf.sf_id,
                
                (SELECT COUNT(DISTINCT date) 
                 FROM Attendance 
                 WHERE sf_id = sf.sf_id
                ) AS totalLectures,
        
                (SELECT COUNT(*) 
                 FROM Attendance 
                 WHERE sf_id = sf.sf_id 
                   AND student_id = 1155 
                   AND status = 'present'
                ) AS attendedLectures
                
            FROM Subjects subj
            JOIN SubjectFaculty sf ON subj.subject_id = sf.subject_id
            WHERE 
                subj.course_id = 1
                AND subj.semester = 1
                AND (subj.branch_id <=> null)
                AND sf.session_year = '2025-26'
            ORDER BY
                subj.subject_name;