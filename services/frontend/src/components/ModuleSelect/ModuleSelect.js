// src/components/ModuleSelect/ModuleSelect.js
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';

const ModuleSelect = ({
  modules,
  selectedModule,
  handleModuleSelect,
  loadingModules,
}) => {
  return (
    <Box mt={4}>
      {loadingModules ? (
        <Box textAlign="center" mt={2}>
          <CircularProgress size={24} />
          <Typography mt={1}>Loading modules...</Typography>
        </Box>
      ) : modules.length > 0 ? (
        <FormControl fullWidth>
          <InputLabel id="module-select-label">Select Module</InputLabel>
          <Select
            labelId="module-select-label"
            value={selectedModule ? selectedModule.module_name : ''}
            label="Select Module"
            onChange={(e) => handleModuleSelect(e.target.value)}
          >
            {modules.map((module) => (
              <MenuItem key={module.module_id} value={module.module_name}>
                {module.module_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography color="textSecondary">
          No modules available for this course.
        </Typography>
      )}
    </Box>
  );
};

export default ModuleSelect;
