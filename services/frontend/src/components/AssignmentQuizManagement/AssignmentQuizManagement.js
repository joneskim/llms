import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel } from '@chakra-ui/react';
import { AssignmentSelect, QuizSelect } from './SelectComponents';

const AssignmentQuizManagement = ({ selectedCourse, selectedModule, onAssignmentChange, onQuizChange }) => {
    const [selectedAssignment, setSelectedAssignment] = useState(selectedCourse.assignments[0]);
    const [selectedQuiz, setSelectedQuiz] = useState(selectedModule.quizzes[0]);

    useEffect(() => {
        onAssignmentChange(selectedAssignment);
    }, [selectedAssignment]);

    useEffect(() => {
        onQuizChange(selectedQuiz);
    }, [selectedQuiz]);

    return (
        <Box bg="white" p={6} borderRadius="md" boxShadow="md">
            <FormControl mb={4}>
                <FormLabel>Select Assignment</FormLabel>
                <AssignmentSelect
                    selectedAssignment={selectedAssignment}
                    selectedCourse={selectedCourse}
                    handleAssignmentChange={(assignment) => setSelectedAssignment(assignment)}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Select Quiz</FormLabel>
                <QuizSelect
                    selectedQuiz={selectedQuiz}
                    selectedModule={selectedModule}
                    handleQuizChange={(quiz) => setSelectedQuiz(quiz)}
                />
            </FormControl>
        </Box>
    );
};

export default AssignmentQuizManagement;
