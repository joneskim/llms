import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, LinearProgress } from '@mui/material';

const PerformanceOverview = ({ performance }) => {
  return (
    <Box mt={5}>
      <Typography variant="h5" color="#2a2a3b" fontWeight="bold" mb={2}>
        Performance Overview
      </Typography>

      <Paper elevation={0} sx={{ padding: '1.5rem', backgroundColor: '#fff' }}>
        {performance ? (
          <List>
            <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemText primary={`Overall Average: ${performance.overallAverage}%`} />
              <Box sx={{ width: '100%', ml: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={performance.overallAverage}
                  sx={{ height: '10px', borderRadius: '5px' }}
                  aria-label="Overall Average Progress"
                />
              </Box>
            </ListItem>
            <ListItem>
              <ListItemText primary={`Highest Score: ${performance.highestScore}%`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Lowest Score: ${performance.lowestScore}%`} />
            </ListItem>
          </List>
        ) : (
          <Typography variant="body1" color="#2a2a3b">
            No performance data available.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PerformanceOverview;
