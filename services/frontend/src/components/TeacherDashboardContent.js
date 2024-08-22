import React, { useState } from 'react';
import {
    Box,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Flex,
    Heading,
    Select,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { FiUsers, FiBarChart2, FiPieChart } from 'react-icons/fi';

// Utility functions to generate random dates and scores
const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomScores = (numScores) => {
    return Array.from({ length: numScores }, (_, index) => ({
        quiz: `Quiz ${index + 1}`,
        date: generateRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
        score: Math.floor(Math.random() * 51) + 50, // random score between 50 and 100
    }));
};

// Generate mock data for courses and students
const mockCourses = [
    {
        course_name: 'Math 101',
        active: true,
        modules: [
            {
                module_name: 'Algebra',
                quizzes: Array.from({ length: 20 }, (_, index) => `Quiz ${index + 1}`),
            },
        ],
        students: Array.from({ length: 120 }, (_, index) => ({
            student_name: `Student ${index + 1}`,
            course_progress: {
                attendance_rate: Math.floor(Math.random() * 10) + 90,
                quiz_scores: generateRandomScores(20),
            },
        })),
    },
    // Additional courses and students can be added here
];

// Helper functions to calculate statistics
const calculateMean = (scores) => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, score) => acc + score, 0);
    return (total / scores.length).toFixed(2);
};

const calculateMedian = (scores) => {
    if (scores.length === 0) return 0;
    const sortedScores = scores.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedScores.length / 2);
    return sortedScores.length % 2 !== 0
        ? sortedScores[mid]
        : ((sortedScores[mid - 1] + sortedScores[mid]) / 2).toFixed(2);
};

const binScores = (scores, binSize) => {
    const bins = {};
    scores.forEach((score) => {
        const bin = Math.floor(score / binSize) * binSize;
        if (!bins[bin]) bins[bin] = 0;
        bins[bin]++;
    });
    return Object.keys(bins).map((bin) => ({ bin: `${bin}-${+bin + binSize - 1}`, count: bins[bin] }));
};

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
    const bgColor = useColorModeValue('gray.100', 'gray.900');
    const barChartFill = useColorModeValue('#8884d8', '#82ca9d');
    const lineChartStroke = useColorModeValue('#8884d8', '#82ca9d');

    const activeCourses = mockCourses.filter((course) => course.active);
    const [selectedCourse, setSelectedCourse] = useState(activeCourses[0]);
    const [selectedModule, setSelectedModule] = useState(selectedCourse.modules[0]);
    const [selectedQuiz, setSelectedQuiz] = useState(selectedCourse.modules[0].quizzes[0]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleCourseChange = (courseName) => {
        const course = activeCourses.find((c) => c.course_name === courseName);
        setSelectedCourse(course);
        setSelectedModule(course.modules[0]);
        setSelectedQuiz(course.modules[0].quizzes[0]);
        setSelectedStudent(null); // Reset the student selection when the course changes
    };

    const handleModuleChange = (moduleName) => {
        const module = selectedCourse.modules.find((m) => m.module_name === moduleName);
        setSelectedModule(module);
        setSelectedQuiz(module.quizzes[0]);
    };

    const handleQuizChange = (quizName) => {
        setSelectedQuiz(quizName);
    };

    const handleStudentChange = (studentName) => {
        const student = selectedCourse.students.find((s) => s.student_name === studentName);
        setSelectedStudent(student || null);
    };

    const quizScores = selectedCourse.students
        .map((student) => student.course_progress.quiz_scores.find((q) => q.quiz === selectedQuiz)?.score)
        .filter((score) => score !== undefined);

    const binnedScores = binScores(quizScores, 5);

    // Detailed stats for the selected student
    const studentQuizScores = selectedStudent?.course_progress.quiz_scores || [];
    const studentScoreTrends = studentQuizScores.map(score => ({
        quiz: score.quiz,
        score: score.score,
    }));

    const studentQuizScoreData = studentQuizScores.map(q => q.score);
    const meanScore = calculateMean(studentQuizScoreData);
    const medianScore = calculateMedian(studentQuizScoreData);

    return (
        <Box p={6} bg={bgColor}>
            {/* Header Section */}
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Heading as="h1" size="xl" color={useColorModeValue('gray.800', 'white')}>
                    {selectedCourse.course_name} <Badge colorScheme={selectedCourse.active ? 'green' : 'red'}>{selectedCourse.active ? 'Active' : 'Inactive'}</Badge>
                </Heading>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="#">{selectedCourse.course_name}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Flex>

            {/* Course, Module, Quiz, and Student Selectors */}
            <Box mb={6}>
                <Select mb={3} value={selectedCourse.course_name} onChange={(e) => handleCourseChange(e.target.value)}>
                    {activeCourses.map((course) => (
                        <option key={course.course_name} value={course.course_name}>
                            {course.course_name}
                        </option>
                    ))}
                </Select>

                <Select mb={3} value={selectedModule.module_name} onChange={(e) => handleModuleChange(e.target.value)}>
                    {selectedCourse.modules.map((module) => (
                        <option key={module.module_name} value={module.module_name}>
                            {module.module_name}
                        </option>
                    ))}
                </Select>

                <Select mb={3} value={selectedQuiz} onChange={(e) => handleQuizChange(e.target.value)}>
                    {selectedModule.quizzes.map((quiz) => (
                        <option key={quiz} value={quiz}>
                            {quiz}
                        </option>
                    ))}
                </Select>

                <Select mb={3} placeholder="Select Student" onChange={(e) => handleStudentChange(e.target.value)}>
                    {selectedCourse.students.map((student) => (
                        <option key={student.student_name} value={student.student_name}>
                            {student.student_name}
                        </option>
                    ))}
                </Select>
            </Box>

            {/* Course Stats */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                <StatsCard title={'Total Students'} stat={selectedCourse.students.length} icon={<FiUsers size={'3em'} />} />
                <StatsCard title={'Average Score'} stat={`${meanScore}%`} icon={<FiBarChart2 size={'3em'} />} />
                <StatsCard title={'Median Score'} stat={`${medianScore}%`} icon={<FiPieChart size={'3em'} />} />
                <StatsCard title={'Pass Rate'} stat={`${(selectedCourse.students.filter((s) => s.course_progress.quiz_scores.some((q) => q.score >= 60)).length / selectedCourse.students.length * 100).toFixed(2)}%`} icon={<FiPieChart size={'3em'} />} />
            </SimpleGrid>

            {/* Quiz Score Distribution */}
            <Box mb={6}>
                <Heading as="h3" size="lg" mb={4}>
                    Quiz Score Distribution
                </Heading>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={binnedScores}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bin" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill={barChartFill} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* Detailed Statistics for Selected Student */}
            {selectedStudent && (
                <Box mt={6}>
                    <Heading as="h4" size="md" mb={4}>
                        Detailed Statistics for {selectedStudent.student_name}
                    </Heading>
                    <Tabs variant="enclosed">
                        <TabList>
                            <Tab>Overview</Tab>
                            <Tab>Quiz Trends</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                    <Stat>
                                        <StatLabel>Average Score</StatLabel>
                                        <StatNumber>{meanScore}%</StatNumber>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Median Score</StatLabel>
                                        <StatNumber>{medianScore}%</StatNumber>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Attendance Rate</StatLabel>
                                        <StatNumber>{selectedStudent.course_progress.attendance_rate}%</StatNumber>
                                    </Stat>
                                </SimpleGrid>
                            </TabPanel>
                            <TabPanel>
                                <Heading as="h5" size="sm" mb={4}>
                                    Score Trends Across Quizzes
                                </Heading>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={studentScoreTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="quiz" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="score" stroke={lineChartStroke} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            )}
        </Box>
    );
};

export default TeacherDashboardContent;
