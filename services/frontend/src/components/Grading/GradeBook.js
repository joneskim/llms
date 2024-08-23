import React from 'react';
import { Box, Button, Heading } from '@chakra-ui/react';
import { MdGrade } from 'react-icons/md';
import { FiClipboard } from 'react-icons/fi';

const GradeBook = ({ onGradeBookOpen, onViewReports }) => {
    return (
        <Box bg="white" p={6} borderRadius="md" boxShadow="md">
            <Heading as="h2" size="md" mb={4} color="gray.800">
                Grading
            </Heading>
            <Button
                leftIcon={<MdGrade />}
                colorScheme="blue"
                variant="solid"
                mb={4}
                onClick={onGradeBookOpen}
            >
                Grade Book
            </Button>
            <Button
                leftIcon={<FiClipboard />}
                colorScheme="green"
                variant="solid"
                onClick={onViewReports}
            >
                View Reports
            </Button>
        </Box>
    );
};

export default GradeBook;
