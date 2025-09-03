import { useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { apiService } from '../services/api/apiService';

export const useWidgetData = () => {
  const { widgets, updateWidgetData } = useDashboardStore();
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const fetchWidgetData = useCallback(async (widgetId: string, apiUrl: string) => {
    try {
      const data = await apiService.fetchData(apiUrl);
      updateWidgetData(widgetId, data);
    } catch (error) {
      console.error(`Failed to fetch data for widget ${widgetId}:`, error);
    }
  }, [updateWidgetData]);

  useEffect(() => {
    // Clear existing intervals
    const currentIntervals = intervalsRef.current;
    currentIntervals.forEach((interval) => clearInterval(interval));
    currentIntervals.clear();

    // Set up new intervals for each widget
    widgets.forEach((widget) => {
      if (widget.apiUrl && widget.refreshInterval > 0) {
        // Initial fetch
        fetchWidgetData(widget.id, widget.apiUrl);

        // Set up interval
        const interval = setInterval(() => {
          fetchWidgetData(widget.id, widget.apiUrl);
        }, widget.refreshInterval * 1000);

        currentIntervals.set(widget.id, interval);
      }
    });

    // Cleanup function
    return () => {
      currentIntervals.forEach((interval) => clearInterval(interval));
      currentIntervals.clear();
    };
  }, [widgets, fetchWidgetData]);

  return null;
};
