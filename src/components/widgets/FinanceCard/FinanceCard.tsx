import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Widget } from '../../../stores/dashboardStore';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { getValueFromPath } from '../../../utils/dataUtils';
import { apiService } from '../../../services/api/apiService';

interface FinanceCardProps {
  widget: Widget;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ widget }) => {
  const { removeWidget, updateWidgetData } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.fetchData(widget.apiUrl);
      updateWidgetData(widget.id, data);
    } catch (error) {
      console.error('Failed to refresh widget data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    removeWidget(widget.id);
  };

  const renderFieldValue = (field: string) => {
    if (!widget.data) return 'No data';
    
    const value = getValueFromPath(widget.data, field);
    if (value === undefined) return 'Field not found';
    
    // Format the value based on its type
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover .widget-actions': {
          opacity: 1,
        },
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" component="h3">
              {widget.name}
            </Typography>
            <Chip label={widget.fields.length} size="small" color="primary" />
          </Box>
        }
        action={
          <Box
            className="widget-actions"
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s ease',
              display: 'flex',
              gap: 0.5,
            }}
          >
            <IconButton size="small" onClick={handleRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
            <IconButton size="small" onClick={handleDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      {isLoading && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      )}
      
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        {widget.fields.map((field, index) => (
          <Box key={field} sx={{ mb: index < widget.fields.length - 1 ? 2 : 0 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {field.split('.').pop() || field}
            </Typography>
            <Typography variant="h6" component="div">
              {renderFieldValue(field)}
            </Typography>
          </Box>
        ))}
        
        {widget.lastUpdated && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ position: 'absolute', bottom: 8, left: 16 }}
          >
            Last updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default FinanceCard;
