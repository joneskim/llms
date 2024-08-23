// src/components/StudentSelect/StudentSelect.js
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const StudentSelect = ({ students, selectedStudent, handleStudentSelect }) => {
  return (
    <Box mt={4}>
      {students.length > 0 ? (
        <FormControl fullWidth>
          <InputLabel id="student-select-label">Select Student</InputLabel>
          <Select
            labelId="student-select-label"
            value={selectedStudent ? selectedStudent.name : ''}
            label="Select Student"
            onChange={(e) => handleStudentSelect(e.target.value)}
          >
            {students.map((student) => (
              <MenuItem key={student.student_id} value={student.name}>
                {student.name}
              </MenuItem>
            ))}
          </Select>
          {selectedStudent && (
            <Box mt={2}>
              <Typography variant="h6">Student Details</Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={selectedStudent.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={selectedStudent.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Enrollment Date"
                    secondary={selectedStudent.enrollment_date}
                  />
                </ListItem>
                {/* Add more fields as needed */}
              </List>
            </Box>
          )}
        </FormControl>
      ) : (
        <Typography color="textSecondary">No students available.</Typography>
      )}
    </Box>
  );
};

export default StudentSelect;
