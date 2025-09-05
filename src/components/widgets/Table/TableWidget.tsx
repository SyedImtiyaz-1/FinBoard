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
  FormControl,
  Select,
  MenuItem,
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
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface TableWidgetProps {
  widget: Widget;
}

const TableWidget: React.FC<TableWidgetProps> = ({ widget }) => {
  const { removeWidget, updateWidgetData, setSelectedWidget } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterKey, setFilterKey] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

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

    return dataArray;
  };

  const tableData = renderTableData();
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
  const filtered = !filterKey || !filterValue
    ? tableData
    : tableData.filter((row) => String(row[filterKey] ?? '').toLowerCase().includes(filterValue.toLowerCase()));
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search anywhere..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <FormControl size="small">
            <Select
              displayEmpty
              value={filterKey}
              onChange={(e) => setFilterKey(e.target.value as string)}
            >
              <MenuItem value=""><em>All Columns</em></MenuItem>
              {columns.map((col) => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Filter value"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
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
              {paginated.map((row, index) => (
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Page {page + 1} of {Math.max(1, Math.ceil(filtered.length / rowsPerPage))}
          </Typography>
          <Box>
            <IconButton size="small" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              {'<'}
            </IconButton>
            <IconButton size="small" disabled={(page + 1) * rowsPerPage >= filtered.length} onClick={() => setPage((p) => p + 1)}>
              {'>'}
            </IconButton>
          </Box>
        </Box>
        
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
