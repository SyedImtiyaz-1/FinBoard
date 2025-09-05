import React, { useEffect, useMemo, useState } from 'react';
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
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDashboardStore, Widget } from '../../stores/dashboardStore';
import { apiService } from '../../services/api/apiService';

const WidgetSettingsModal: React.FC = () => {
  const {
    widgets,
    selectedWidget,
    setSelectedWidget,
    updateWidget,
  } = useDashboardStore();

  const widget = useMemo(() => widgets.find((w) => w.id === selectedWidget) || null, [widgets, selectedWidget]);

  const [formData, setFormData] = useState<{
    name: string;
    apiUrl: string;
    refreshInterval: number;
    displayMode: 'card' | 'table' | 'chart';
    currencyCode?: string;
  }>({ name: '', apiUrl: '', refreshInterval: 30, displayMode: 'card', currencyCode: 'USD' });
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [fieldFormats, setFieldFormats] = useState<Record<string, 'currency' | 'percentage' | 'number' | 'string'>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (widget) {
      setFormData({
        name: widget.name,
        apiUrl: widget.apiUrl,
        refreshInterval: widget.refreshInterval,
        displayMode: widget.displayMode,
        currencyCode: widget.currencyCode || 'USD',
      });
      setSelectedFields(widget.fields || []);
      setFieldFormats(widget.fieldFormats || {});
      setTestResult(null);
    }
  }, [widget]);

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
    setSelectedFields(selectedFields.filter((f) => f !== field));
    const updated = { ...fieldFormats };
    delete updated[field];
    setFieldFormats(updated);
  };

  const handleFormatChange = (field: string, format: 'currency' | 'percentage' | 'number' | 'string') => {
    setFieldFormats((prev) => ({ ...prev, [field]: format }));
  };

  const handleSave = () => {
    if (!widget) return;
    const updates: Partial<Widget> = {
      name: formData.name,
      apiUrl: formData.apiUrl,
      refreshInterval: formData.refreshInterval,
      displayMode: formData.displayMode,
      fields: selectedFields,
      fieldFormats,
      currencyCode: formData.currencyCode,
    };
    updateWidget(widget.id, updates);
    setSelectedWidget(null);
  };

  const open = Boolean(widget);
  const onClose = () => setSelectedWidget(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Edit Widget
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {!widget ? null : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <TextField
              fullWidth
              label="Widget Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="API URL"
              value={formData.apiUrl}
              onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
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
              <TextField
                fullWidth
                label="Currency Code"
                value={formData.currencyCode}
                onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value.toUpperCase() })}
                placeholder="USD"
              />
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <Button variant="outlined" onClick={handleTestApi} disabled={isTesting || !formData.apiUrl}>
                {isTesting ? 'Testing...' : 'Test API'}
              </Button>
              {testResult && (
                <Alert severity={testResult.success ? 'success' : 'error'} sx={{ flex: 1 }}>
                  {testResult.message}
                </Alert>
              )}
            </Box>
            {availableFields.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Available Fields
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {availableFields.map((field) => (
                    <Chip key={field} label={field} onClick={() => handleAddField(field)} variant="outlined" clickable />
                  ))}
                </Box>
              </Box>
            )}
            <Divider />
            <Box>
              <Typography variant="h6" gutterBottom>
                Selected Fields & Formats
              </Typography>
              {selectedFields.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No fields selected.
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 200px 60px', gap: 1, alignItems: 'center' }}>
                  {selectedFields.map((field) => (
                    <React.Fragment key={field}>
                      <Typography>{field}</Typography>
                      <FormControl size="small">
                        <Select
                          value={fieldFormats[field] || 'string'}
                          onChange={(e) => handleFormatChange(field, e.target.value as any)}
                        >
                          <MenuItem value="string">String</MenuItem>
                          <MenuItem value="number">Number</MenuItem>
                          <MenuItem value="currency">Currency</MenuItem>
                          <MenuItem value="percentage">Percentage</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton size="small" onClick={() => handleRemoveField(field)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!widget}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WidgetSettingsModal;




