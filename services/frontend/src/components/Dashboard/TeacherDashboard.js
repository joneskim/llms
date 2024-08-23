import React from 'react';
import { Flex, Divider } from '@chakra-ui/react';
import CourseManagement from '../CourseManagement/CourseManagement';
import AssignmentQuizManagement from '../AssignmentQuizManagement/AssignmentQuizManagement';
import GradeBook from '../Grading/GradeBook';
import UpcomingDeadlines from '../Deadlines/UpcomingDeadlines';

const TeacherDashboard = ({ courses, deadlines }) => {
    const handleCourseChange = (course) => {
        console.log('Selected Course:', course);
    };

    const handleModuleChange = (module) => {
        console.log('Selected Module:', module);
    };

    const handleAssignmentChange = (assignment) => {
        console.log('Selected Assignment:', assignment);
    };

    const handleQuizChange = (quiz) => {
        console.log('Selected Quiz:', quiz);
    };

    const handleGradeBookOpen = () => {
        console.log('Open Grade Book');
    };

    const handleViewReports = () => {
        console.log('View Reports');
    };

    return (
        <Flex flexDirection="column" p={8} bg="gray.50" minHeight="100vh">
            <CourseManagement
                courses={courses}
                onCourseChange={handleCourseChange}
                onModuleChange={handleModuleChange}
            />
            <Divider my={8} borderColor="gray.200" />
            <AssignmentQuizManagement
                selectedCourse={courses[0]}
                selectedModule={courses[0].modules[0]}
                onAssignmentChange={handleAssignmentChange}
                onQuizChange={handleQuizChange}
            />
            <Divider my={8} borderColor="gray.200" />
            <GradeBook
                onGradeBookOpen={handleGradeBookOpen}
                onViewReports={handleViewReports}
            />
            <UpcomingDeadlines deadlines={deadlines} />
        </Flex>
    );
};

export default TeacherDashboard;
