import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Add as AddIcon, BarChart as BarChartIcon } from '@mui/icons-material';

interface DashboardHeaderProps {
  widgetCount: number;
  onAddWidget: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ widgetCount, onAddWidget }) => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <BarChartIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Box>
            <Typography variant="h6" component="h1" sx={{ color: 'text.primary' }}>
              Finance Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {widgetCount} active widget{widgetCount !== 1 ? 's' : ''} • Real-time data
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddWidget}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Add Widget
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;

