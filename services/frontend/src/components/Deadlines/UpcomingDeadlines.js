import React from 'react';
import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react';

const UpcomingDeadlines = ({ deadlines }) => {
    return (
        <Box bg="white" p={6} borderRadius="md" boxShadow="md" mt={8}>
            <Heading as="h2" size="md" mb={4} color="gray.800">
                Upcoming Deadlines
            </Heading>
            <List spacing={3}>
                {deadlines.map((deadline, index) => (
                    <ListItem key={index}>
                        <Text>
                            <strong>{deadline.title}:</strong> {deadline.date}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default UpcomingDeadlines;
