import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import TopBar from '../components/Layout/TopBar';
import { BorderBottom } from '@mui/icons-material';

const CoursePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <TopBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        style={{
          flexGrow: 1,
          marginTop: '64px',
          marginLeft: isSidebarOpen ? '250px' : '70px', // Adjust based on sidebar state
          padding: '16px',
          transition: 'margin-left 0.3s',
          overflowY: 'auto',
        }}
      >
        <Outlet /> {/* Render the selected route's component here */}
      </main>
    </div>
  );
};

export default CoursePage;
