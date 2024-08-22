// src/components/AdminDashboardContent.js
import React from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue, Flex, Heading } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiBook, FiFileText, FiUsers, FiCheckSquare } from 'react-icons/fi';

const StatsCard = ({ title, stat, icon }) => {
    return (
        <Stat
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
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box my={'auto'} color={useColorModeValue('blue.500', 'blue.300')}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    );
};

const AdminDashboardContent = () => {
    // Sample data for the charts
    const courseData = [
        { name: 'Week 1', courses: 5, assignments: 10 },
        { name: 'Week 2', courses: 6, assignments: 12 },
        { name: 'Week 3', courses: 8, assignments: 15 },
        { name: 'Week 4', courses: 4, assignments: 8 },
    ];

    return (
        <Box p={6} bg={useColorModeValue('gray.100', 'gray.900')}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                <StatsCard title={'Courses'} stat={'24'} icon={<FiBook size={'3em'} />} />
                <StatsCard title={'Assignments'} stat={'50'} icon={<FiFileText size={'3em'} />} />
                <StatsCard title={'Quizzes'} stat={'10'} icon={<FiCheckSquare size={'3em'} />} />
                <StatsCard title={'Users'} stat={'120'} icon={<FiUsers size={'3em'} />} />
            </SimpleGrid>

            <Box mt={10}>
                <Heading as="h3" size="lg" mb={4}>
                    Courses and Assignments Overview
                </Heading>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={courseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="courses" fill="#3182ce" />
                        <Bar dataKey="assignments" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default AdminDashboardContent;
