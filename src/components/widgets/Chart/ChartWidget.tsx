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
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Widget } from '../../../stores/dashboardStore';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { getValueFromPath } from '../../../utils/dataUtils';
import { apiService } from '../../../services/api/apiService';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ChartWidgetProps {
  widget: Widget;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ widget }) => {
  const { removeWidget, updateWidgetData, setSelectedWidget } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

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

  const prepareChartData = () => {
    if (!widget.data) return [];

    // Try to find array data in the response
    let dataArray: any[] = [];
    
    if (Array.isArray(widget.data)) {
      dataArray = widget.data;
    } else {
      // Look for arrays in the data structure
      const findArrays = (obj: any): any[] => {
        if (Array.isArray(obj)) return obj;
        if (typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            const result = findArrays(obj[key]);
            if (result.length > 0) return result;
          }
        }
        return [];
      };
      
      dataArray = findArrays(widget.data);
    }

    // Transform data for chart display
    return dataArray.slice(0, 20).map((item, index) => {
      const transformed: any = { index };
      
      widget.fields.forEach((field) => {
        const value = getValueFromPath(item, field);
        if (value !== undefined) {
          transformed[field.split('.').pop() || field] = value;
        }
      });
      
      return transformed;
    });
  };

  const chartData = prepareChartData();
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          No data available
        </Box>
      );
    }

    const dataKeys = Object.keys(chartData[0]).filter(key => key !== 'index');

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={dataKeys[0] || 'value'}
                nameKey="index"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
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
            <Chip label={chartType} size="small" color="primary" />
            <Chip label={`${widget.refreshInterval}s`} size="small" variant="outlined" />
            {widget.error && (
              <Chip
                icon={<ErrorOutlineIcon />}
                label="Error"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
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
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'pie')}
                sx={{ fontSize: '0.75rem' }}
              >
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
                <MenuItem value="pie">Pie</MenuItem>
              </Select>
            </FormControl>
            <IconButton size="small" onClick={handleRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
            <IconButton size="small" onClick={() => setSelectedWidget(widget.id)}>
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
        {widget.error && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="error">{widget.error}</Typography>
          </Box>
        )}
        {renderChart()}
        
        {widget.lastUpdated && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block', textAlign: 'center' }}
          >
            Last updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartWidget;

