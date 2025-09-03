import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Widget } from '../../../stores/dashboardStore';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { apiService } from '../../../services/api/apiService';

interface TableWidgetProps {
  widget: Widget;
}

const TableWidget: React.FC<TableWidgetProps> = ({ widget }) => {
  const { removeWidget, updateWidgetData } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const renderTableData = () => {
    if (!widget.data) return [];

    // Try to find array data in the response
    let dataArray: any[] = [];
    
    // Check if the data itself is an array
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

    // Filter based on search term
    if (searchTerm) {
      dataArray = dataArray.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return dataArray.slice(0, 10); // Limit to 10 rows
  };

  const tableData = renderTableData();
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

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
            <Chip label={`${tableData.length} items`} size="small" color="primary" />
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
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>
        
        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {typeof row[column] === 'object'
                        ? JSON.stringify(row[column])
                        : String(row[column] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
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

export default TableWidget;
