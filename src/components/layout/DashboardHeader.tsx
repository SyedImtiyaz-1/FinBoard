import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Add as AddIcon, BarChart as BarChartIcon, Download as DownloadIcon, Upload as UploadIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import { useThemeStore } from '../../stores/themeStore';
import { useDashboardStore } from '../../stores/dashboardStore';

interface DashboardHeaderProps {
  widgetCount: number;
  onAddWidget: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ widgetCount, onAddWidget }) => {
  const { mode, toggleMode } = useThemeStore();
  const { widgets, replaceAllWidgets } = useDashboardStore();

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(widgets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-widgets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) throw new Error('Invalid config');
        // Basic sanitize: ensure ids are unique strings
        parsed.forEach((w: any) => {
          if (!w.id) w.id = String(Date.now() + Math.random());
        });
        replaceAllWidgets(parsed);
      } catch (e) {
        alert('Failed to import configuration');
      }
    };
    input.click();
  };

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
        
        <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton onClick={handleExport} sx={{ mr: 1 }}>
          <DownloadIcon />
        </IconButton>
        <IconButton onClick={handleImport} sx={{ mr: 1 }}>
          <UploadIcon />
        </IconButton>
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

