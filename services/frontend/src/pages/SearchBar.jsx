import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <Box mb={3}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search quizzes..."
        value={searchTerm}
        onChange={onSearchChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ backgroundColor: 'white', borderRadius: '8px' }}
        aria-label="Search Quizzes"
      />
    </Box>
  );
};

export default SearchBar;
