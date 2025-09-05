import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDashboardStore } from '../stores/dashboardStore';
import WidgetGrid from '../components/layout/WidgetGrid';
import AddWidgetModal from '../components/forms/AddWidgetModal';
import WidgetSettingsModal from '../components/forms/WidgetSettingsModal';
import DashboardHeader from '../components/layout/DashboardHeader';
import { useWidgetData } from '../hooks/useWidgetData';
import { DropResult } from 'react-beautiful-dnd';

const Dashboard: React.FC = () => {
  const { widgets, isAddingWidget, setAddingWidget, reorderWidgets } = useDashboardStore();
  
  // Initialize data fetching for all widgets
  useWidgetData();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;
    reorderWidgets(sourceIndex, destinationIndex);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader 
        widgetCount={widgets.length}
        onAddWidget={() => setAddingWidget(true)}
      />
      
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {widgets.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Build Your Finance Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Create custom widgets by connecting to any finance API. Track stocks, crypto, and more in real-time.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setAddingWidget(true)}
              sx={{ fontSize: '1.1rem', px: 4, py: 1.5 }}
            >
              + Add Your First Widget
            </Button>
          </Box>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="dashboard">
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ minHeight: '70vh' }}
                >
                  <WidgetGrid />
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Container>

      <AddWidgetModal 
        open={isAddingWidget}
        onClose={() => setAddingWidget(false)}
      />
      <WidgetSettingsModal />
    </Box>
  );
};

export default Dashboard;
