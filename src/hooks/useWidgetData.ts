import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { apiService } from '../services/api/apiService';

export const useWidgetData = () => {
  const { widgets, updateWidgetData, setWidgetError } = useDashboardStore();
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const fetchWidgetData = useCallback(async (widgetId: string, apiUrl: string, refreshInterval: number) => {
    try {
      const data = await apiService.fetchData(apiUrl, Math.max(5000, refreshInterval * 1000));
      updateWidgetData(widgetId, data);
      setWidgetError(widgetId, null);
    } catch (error) {
      console.error(`Failed to fetch data for widget ${widgetId}:`, error);
      setWidgetError(widgetId, error instanceof Error ? error.message : 'Unknown error');
    }
  }, [updateWidgetData, setWidgetError]);

  const scheduleKey = useMemo(
    () =>
      widgets
        .map((w) => `${w.id}:${w.apiUrl}:${w.refreshInterval}`)
        .join('|'),
    [widgets]
  );

  useEffect(() => {
    // Clear existing intervals
    const currentIntervals = intervalsRef.current;
    currentIntervals.forEach((interval) => clearInterval(interval));
    currentIntervals.clear();

    // Set up new intervals for each widget
    widgets.forEach((widget) => {
      if (widget.apiUrl && widget.refreshInterval > 0) {
        // Initial fetch
        fetchWidgetData(widget.id, widget.apiUrl, widget.refreshInterval);

        // Set up interval
        const interval = setInterval(() => {
          fetchWidgetData(widget.id, widget.apiUrl, widget.refreshInterval);
        }, widget.refreshInterval * 1000);

        currentIntervals.set(widget.id, interval);
      }
    });

    // Cleanup function
    return () => {
      currentIntervals.forEach((interval) => clearInterval(interval));
      currentIntervals.clear();
    };
  }, [scheduleKey, fetchWidgetData]);

  return null;
};
