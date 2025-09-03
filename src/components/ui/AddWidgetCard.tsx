import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AddWidgetCardProps {
  onAddWidget: () => void;
}

const AddWidgetCard: React.FC<AddWidgetCardProps> = ({ onAddWidget }) => {
  return (
    <Card
      onClick={onAddWidget}
      sx={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '2px dashed',
        borderColor: 'primary.main',
        bgcolor: 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.dark',
          bgcolor: 'action.hover',
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <AddIcon sx={{ color: 'white', fontSize: 30 }} />
        </Box>
        <Typography variant="h6" component="h3" gutterBottom>
          Add Widget
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Connect to a finance API and create a custom widget
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AddWidgetCard;

