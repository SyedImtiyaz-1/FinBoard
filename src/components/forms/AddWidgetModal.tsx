import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDashboardStore } from '../../stores/dashboardStore';
import { apiService } from '../../services/api/apiService';

interface AddWidgetModalProps {
  open: boolean;
  onClose: () => void;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ open, onClose }) => {
  const { addWidget } = useDashboardStore();
  const [formData, setFormData] = useState({
    name: '',
    apiUrl: '',
    refreshInterval: 30,
    displayMode: 'card' as 'card' | 'table' | 'chart',
  });
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterOnlyArrays, setFilterOnlyArrays] = useState(false);
  const [search, setSearch] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestApi = async () => {
    if (!formData.apiUrl) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await apiService.testApiConnection(formData.apiUrl);
      if (result.success) {
        setTestResult({ success: true, message: `API connection successful! ${result.fields?.length || 0} fields found.` });
        setAvailableFields(result.fields || []);
      } else {
        setTestResult({ success: false, message: result.error || 'Failed to connect to API' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to test API connection' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleAddField = (field: string) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleRemoveField = (field: string) => {
    setSelectedFields(selectedFields.filter(f => f !== field));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.apiUrl || selectedFields.length === 0) return;
    
    addWidget({
      name: formData.name,
      type: formData.displayMode,
      apiUrl: formData.apiUrl,
      refreshInterval: formData.refreshInterval,
      fields: selectedFields,
      displayMode: formData.displayMode,
      position: { x: 0, y: 0 },
      size: { width: 300, height: 200 },
    });
    
    // Reset form
    setFormData({
      name: '',
      apiUrl: '',
      refreshInterval: 30,
      displayMode: 'card',
    });
    setSelectedFields([]);
    setAvailableFields([]);
    setTestResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Add New Widget
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
          <TextField
            fullWidth
            label="Widget Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Bitcoin Price Tracker"
          />
          
          <TextField
            fullWidth
            label="API URL"
            value={formData.apiUrl}
            onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
            placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Refresh Interval (seconds)"
              value={formData.refreshInterval}
              onChange={(e) => setFormData({ ...formData, refreshInterval: parseInt(e.target.value) || 30 })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Display Mode</InputLabel>
              <Select
                value={formData.displayMode}
                onChange={(e) => setFormData({ ...formData, displayMode: e.target.value as 'card' | 'table' | 'chart' })}
                label="Display Mode"
              >
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="table">Table</MenuItem>
                <MenuItem value="chart">Chart</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={handleTestApi}
              disabled={isTesting || !formData.apiUrl}
            >
              {isTesting ? 'Testing...' : 'Test API'}
            </Button>
            {testResult && (
              <Alert severity={testResult.success ? 'success' : 'error'} sx={{ flex: 1 }}>
                {testResult.message}
              </Alert>
            )}
          </Box>
          
          {availableFields.length > 0 && (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search fields..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Box display="flex" alignItems="center" gap={1}>
                  <input
                    id="arrays-only"
                    type="checkbox"
                    checked={filterOnlyArrays}
                    onChange={(e) => setFilterOnlyArrays(e.target.checked)}
                  />
                  <Typography variant="body2">Show arrays only (for table)</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Available Fields
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {availableFields
                    .filter((f) => f.toLowerCase().includes(search.toLowerCase()))
                    .map((field) => (
                    <Chip
                      key={field}
                      label={field}
                      onClick={() => handleAddField(field)}
                      variant="outlined"
                      clickable
                    />
                  ))}
                </Box>
              </Box>
              
              {selectedFields.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Selected Fields
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedFields.map((field) => (
                      <Chip
                        key={field}
                        label={field}
                        onDelete={() => handleRemoveField(field)}
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.apiUrl || selectedFields.length === 0}
        >
          Add Widget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWidgetModal;
