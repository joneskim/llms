// src/components/TeacherDashboardContent.js
import React, { useState } from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue, Flex, Heading, Select } from '@chakra-ui/react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiBook, FiFileText, FiUsers } from 'react-icons/fi';

// Mock data structure with classes and students
const mockCourses = [
    {
        course_name: 'Math 101',
        students: [
            {
                student_name: 'Alice',
                course_progress: {
                    completed_modules: 5,
                    total_modules: 5,
                    score: 90,
                    grade_trend: [
                        { date: '2024-01-01', grade: 85 },
                        { date: '2024-02-01', grade: 88 },
                        { date: '2024-03-01', grade: 90 },
                    ],
                },
            },
            {
                student_name: 'Bob',
                course_progress: {
                    completed_modules: 4,
                    total_modules: 5,
                    score: 70,
                    grade_trend: [
                        { date: '2024-01-01', grade: 65 },
                        { date: '2024-02-01', grade: 68 },
                        { date: '2024-03-01', grade: 70 },
                    ],
                },
            },
        ],
    },
    {
        course_name: 'Physics 201',
        students: [
            {
                student_name: 'Alice',
                course_progress: {
                    completed_modules: 3,
                    total_modules: 6,
                    score: 85,
                    grade_trend: [
                        { date: '2024-01-01', grade: 80 },
                        { date: '2024-02-01', grade: 83 },
                        { date: '2024-03-01', grade: 85 },
                    ],
                },
            },
            {
                student_name: 'Bob',
                course_progress: {
                    completed_modules: 6,
                    total_modules: 6,
                    score: 95,
                    grade_trend: [
                        { date: '2024-01-01', grade: 90 },
                        { date: '2024-02-01', grade: 92 },
                        { date: '2024-03-01', grade: 95 },
                    ],
                },
            },
        ],
    },
    // Add more courses and students as needed
];

const StatsCard = ({ title, stat, icon }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const iconColor = useColorModeValue('blue.500', 'blue.300');

    return (
        <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            bg={bgColor}
            shadow={'md'}
            borderRadius={'lg'}
            border="1px"
            borderColor={borderColor}
        >
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                    <StatLabel fontWeight={'medium'} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box my={'auto'} color={iconColor}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
};

const TeacherDashboardContent = () => {
    const [selectedCourse, setSelectedCourse] = useState(mockCourses[0]);
    const [selectedStudent, setSelectedStudent] = useState(mockCourses[0].students[0]);

    const handleCourseChange = (e) => {
        const course = mockCourses.find((c) => c.course_name === e.target.value);
        setSelectedCourse(course);
        setSelectedStudent(course.students[0]); // Reset the student selection when the course changes
    };

    const handleStudentChange = (e) => {
        const student = selectedCourse.students.find((s) => s.student_name === e.target.value);
        setSelectedStudent(student);
    };

    const cardBgColor = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box p={6} bg={useColorModeValue('gray.100', 'gray.900')}>
            <Heading as="h2" size="lg" mb={6}>
                Teacher Dashboard
            </Heading>

            {/* General Overview Section */}
            <Heading as="h3" size="md" mb={4}>
                General Overview
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                <StatsCard title={'Total Courses'} stat={mockCourses.length} icon={<FiBook size={'3em'} />} />
                <StatsCard title={'Total Students'} stat={mockCourses.reduce((acc, course) => acc + course.students.length, 0)} icon={<FiUsers size={'3em'} />} />
            </SimpleGrid>

            {/* Course and Student Selection */}
            <Box mt={10}>
                <Heading as="h3" size="md" mb={4}>
                    Select Course and Student
                </Heading>
                <Select placeholder="Select course" onChange={handleCourseChange} mb={4} value={selectedCourse.course_name}>
                    {mockCourses.map((course, index) => (
                        <option key={index} value={course.course_name}>
                            {course.course_name}
                        </option>
                    ))}
                </Select>
                <Select placeholder="Select student" onChange={handleStudentChange} mb={6} value={selectedStudent.student_name}>
                    {selectedCourse.students.map((student, index) => (
                        <option key={index} value={student.student_name}>
                            {student.student_name}
                        </option>
                    ))}
                </Select>

                {selectedStudent && (
                    <Box>
                        <Heading as="h4" size="md" mb={4}>
                            {selectedStudent.student_name}'s Progress in {selectedCourse.course_name}
                        </Heading>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={[selectedStudent.course_progress]}
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

                        <Box mt={10}>
                            <Heading as="h4" size="md" mb={4}>
                                {selectedStudent.student_name}'s Grade Trend in {selectedCourse.course_name}
                            </Heading>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={selectedStudent.course_progress.grade_trend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="grade" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default TeacherDashboardContent;
