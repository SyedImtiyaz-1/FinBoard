import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Widget {
  id: string;
  name: string;
  type: 'table' | 'card' | 'chart';
  apiUrl: string;
  refreshInterval: number;
  fields: string[];
  displayMode: 'card' | 'table' | 'chart';
  data?: any;
  lastUpdated?: string;
  error?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  fieldFormats?: Record<string, 'currency' | 'percentage' | 'number' | 'string'>;
  currencyCode?: string;
}

interface DashboardState {
  widgets: Widget[];
  isAddingWidget: boolean;
  selectedWidget: string | null;
  addWidget: (widget: Omit<Widget, 'id' | 'data' | 'lastUpdated'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  setAddingWidget: (isAdding: boolean) => void;
  setSelectedWidget: (id: string | null) => void;
  updateWidgetData: (id: string, data: any) => void;
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
  updateWidgetSize: (id: string, size: { width: number; height: number }) => void;
  setWidgetError: (id: string, error: string | null) => void;
  reorderWidgets: (sourceIndex: number, destinationIndex: number) => void;
  replaceAllWidgets: (widgets: Widget[]) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: [],
      isAddingWidget: false,
      selectedWidget: null,

      addWidget: (widget) => {
        const newWidget: Widget = {
          ...widget,
          id: Date.now().toString(),
          data: null,
          lastUpdated: new Date().toISOString(),
          error: undefined,
        };
        set((state) => ({
          widgets: [...state.widgets, newWidget],
        }));
      },

      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          selectedWidget: state.selectedWidget === id ? null : state.selectedWidget,
        }));
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      setAddingWidget: (isAdding) => {
        set({ isAddingWidget: isAdding });
      },

      setSelectedWidget: (id) => {
        set({ selectedWidget: id });
      },

      updateWidgetData: (id, data) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id
              ? { ...w, data, lastUpdated: new Date().toISOString(), error: undefined }
              : w
          ),
        }));
      },

      updateWidgetPosition: (id, position) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        }));
      },

      updateWidgetSize: (id, size) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, size } : w
          ),
        }));
      },

      setWidgetError: (id, error) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, error: error ?? undefined } : w
          ),
        }));
      },

      reorderWidgets: (sourceIndex, destinationIndex) => {
        set((state) => {
          const updated = [...state.widgets];
          const [removed] = updated.splice(sourceIndex, 1);
          updated.splice(destinationIndex, 0, removed);
          return { widgets: updated };
        });
      },

      replaceAllWidgets: (widgets) => {
        set(() => ({ widgets }));
      },
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
