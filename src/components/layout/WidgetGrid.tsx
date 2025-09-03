import React from 'react';
import { Box } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import { useDashboardStore } from '../../stores/dashboardStore';
import WidgetRenderer from '../widgets/WidgetRenderer';
import AddWidgetCard from '../ui/AddWidgetCard';

const WidgetGrid: React.FC = () => {
  const { widgets, setAddingWidget } = useDashboardStore();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 3,
      }}
    >
      {widgets.map((widget, index) => (
        <Draggable key={widget.id} draggableId={widget.id} index={index}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              sx={{
                transition: 'transform 0.2s ease',
                transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
              }}
            >
              <WidgetRenderer widget={widget} />
            </Box>
          )}
        </Draggable>
      ))}
      
      {/* Add Widget Card */}
      <Box>
        <AddWidgetCard onAddWidget={() => setAddingWidget(true)} />
      </Box>
    </Box>
  );
};

export default WidgetGrid;
