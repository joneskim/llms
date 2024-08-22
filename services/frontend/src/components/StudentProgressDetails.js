// src/components/StudentProgressDetail.js
import React, { useState } from 'react';
import { Box, Select, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue, Flex, Heading } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentProgressDetail = ({ students }) => {
    const [selectedStudent, setSelectedStudent] = useState(students[0]);

    const handleStudentChange = (e) => {
        const student = students.find((s) => s.student_name === e.target.value);
        setSelectedStudent(student);
    };

    return (
        <Box p={6} bg={useColorModeValue('gray.100', 'gray.900')}>
            <Heading as="h3" size="lg" mb={4}>
                Select a Student
            </Heading>
            <Select placeholder="Select student" onChange={handleStudentChange} mb={6} value={selectedStudent.student_name}>
                {students.map((student, index) => (
                    <option key={index} value={student.student_name}>
                        {student.student_name}
                    </option>
                ))}
            </Select>

            {selectedStudent && (
                <Box mt={10}>
                    <Heading as="h4" size="md" mb={4}>
                        {selectedStudent.student_name}'s Progress
                    </Heading>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={selectedStudent.course_progress}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="course_name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="completed_modules" fill="#3182ce" name="Completed Modules" />
                            <Bar dataKey="total_modules" fill="#82ca9d" name="Total Modules" />
                        </BarChart>
                    </ResponsiveContainer>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={10}>
                        {selectedStudent.course_progress.map((course, index) => (
                            <Stat
                                key={index}
                                px={{ base: 2, md: 4 }}
                                py={'5'}
                                bg={useColorModeValue('white', 'gray.800')}
                                shadow={'md'}
                                borderRadius={'lg'}
                                border="1px"
                                borderColor={useColorModeValue('gray.200', 'gray.700')}
                            >
                                <Flex justifyContent={'space-between'} alignItems={'center'}>
                                    <Box>
                                        <StatLabel fontWeight={'medium'} isTruncated>
                                            {course.course_name}
                                        </StatLabel>
                                        <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                                            Score: {course.score}%
                                        </StatNumber>
                                    </Box>
                                </Flex>
                            </Stat>
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </Box>
    );
};

export default StudentProgressDetail;
