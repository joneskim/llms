// src/components/CourseManagement/CourseSelect.js

import React from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const CourseSelect = ({ courses, selectedCourse, handleCourseSelect }) => {
  return (
    <Grid container spacing={2}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course.course_id}>
          <Card
            variant="outlined"
            sx={{
              cursor: 'pointer',
              backgroundColor:
                selectedCourse && selectedCourse.course_id === course.course_id
                  ? 'lightblue'
                  : 'white',
              '&:hover': {
                backgroundColor: 'lightgray',
              },
            }}
            onClick={() => handleCourseSelect(course)}
          >
            <CardContent>
              <Typography variant="h6">{course.course_name}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleCourseSelect(course)}>
                Select Course
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseSelect;
