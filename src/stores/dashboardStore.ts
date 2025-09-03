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
  position: { x: number; y: number };
  size: { width: number; height: number };
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
              ? { ...w, data, lastUpdated: new Date().toISOString() }
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
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
