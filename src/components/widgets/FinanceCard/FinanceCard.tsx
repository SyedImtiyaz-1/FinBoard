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
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Widget } from '../../../stores/dashboardStore';
import { useDashboardStore } from '../../../stores/dashboardStore';
import { getValueFromPath, formatCurrency, formatNumber, formatPercentage, isNumeric, parseNumericValue } from '../../../utils/dataUtils';
import { apiService } from '../../../services/api/apiService';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface FinanceCardProps {
  widget: Widget;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ widget }) => {
  const { removeWidget, updateWidgetData, setSelectedWidget } = useDashboardStore();
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

  const abbreviateNumber = (value: number): string => {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return formatNumber(value);
  };

  const renderFieldValue = (field: string) => {
    if (!widget.data) return 'No data';
    
    const value = getValueFromPath(widget.data, field);
    if (value === undefined) return 'Field not found';
    
    const format = widget.fieldFormats?.[field] || 'string';
    const currencyCode = widget.currencyCode || 'USD';

    if (format === 'currency') {
      const numeric = parseNumericValue(value);
      return numeric === null ? String(value) : formatCurrency(numeric, currencyCode);
    }
    if (format === 'percentage') {
      const numeric = parseNumericValue(value);
      return numeric === null ? String(value) : formatPercentage(numeric > 1 ? numeric / 100 : numeric);
    }
    if (format === 'number') {
      const numeric = parseNumericValue(value);
      return numeric === null ? String(value) : abbreviateNumber(numeric);
    }
    // Heuristic: pretty-format numeric strings by default
    const numeric = parseNumericValue(value);
    if (numeric !== null) return abbreviateNumber(numeric);
    if (typeof value === 'object') return '[object]';
    return String(value);
  };

  // Compute a short badge value (e.g., BTC, AAPL) from data where possible
  const computeBadge = (): string | null => {
    try {
      if (!widget.data) return null;
      const preferenceOrder = ['currency', 'symbol', 'ticker', 'code', 'base', 'name'];
      const candidatePath =
        widget.fields.find((f) => preferenceOrder.some((p) => f.toLowerCase().includes(p))) ||
        widget.fields.find((f) => {
          const val = getValueFromPath(widget.data, f);
          return typeof val === 'string' && val.length <= 8;
        });
      if (!candidatePath) return null;
      const raw = getValueFromPath(widget.data, candidatePath);
      if (typeof raw === 'string') return raw.toUpperCase();
      return null;
    } catch {
      return null;
    }
  };

  const badgeText = computeBadge();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.0) 100%)',
        '&:hover .widget-actions': {
          opacity: 1,
        },
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" component="h3">
                {widget.name}
              </Typography>
              <Chip label={widget.fields.length} size="small" color="primary" />
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
            {badgeText && (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {badgeText}
              </Typography>
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 1 }}>
          {widget.fields.map((field, index) => {
            const label = field.split('.').pop() || field;
            const val = renderFieldValue(field);
            const isObject = val === '[object]';
            return (
              <React.Fragment key={field}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
                  {label}
                </Typography>
                <Tooltip title={typeof val === 'string' ? val : ''} disableHoverListener={isObject}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 600,
                    }}
                  >
                    {isObject ? '—' : String(val)}
                  </Typography>
                </Tooltip>
              </React.Fragment>
            );
          })}
        </Box>
        
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
