import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  EventAvailable,
  KingBed,
  Add,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material';

const MattressLifecycleTimeline = ({ mattress, formatDate, getLifecyclePercentage, getDaysRemaining }) => {
  const [timelineOpen, setTimelineOpen] = useState(false);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        bgcolor: 'white',
        border: '1px solid #e2e8f0',
        mb: 3
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: timelineOpen ? '1px solid #e2e8f0' : 'none',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(0,128,128,0.04)'
          }
        }}
        onClick={() => setTimelineOpen(!timelineOpen)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventAvailable sx={{ color: '#008080', mr: 1.5 }} />
          <Typography variant="h6" fontWeight="bold" color="#1e293b">
            Lifecycle Timeline
          </Typography>
        </Box>
        <IconButton size="small">
          {timelineOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      
      {timelineOpen && (
        <Box sx={{ p: 3 }}>
          <Box sx={{ position: 'relative', mt: 2, mb: 4, mx: 4 }}>
            {/* Timeline Track */}
            <Box sx={{ 
              height: 6, 
              bgcolor: '#e2e8f0', 
              borderRadius: 3,
              position: 'relative',
              zIndex: 1
            }} />
            
            {/* Timeline Markers */}
            <Box sx={{ 
              position: 'absolute', 
              left: '0%', 
              top: -18, 
              transform: 'translateX(-50%)',
              zIndex: 2
            }}>
              <Box sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                bgcolor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                border: '2px solid white'
              }}>
                <Add sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="caption" sx={{ 
                display: 'block', 
                mt: 1, 
                fontWeight: 'medium', 
                textAlign: 'center', 
                whiteSpace: 'nowrap',
                position: 'absolute',
                left: 0,
                width: 60,
                transform: 'translateX(-50%)'
              }}>
                Created
              </Typography>
            </Box>
            
            {/* Current Status Marker */}
            <Box sx={{ 
              position: 'absolute', 
              left: `${Math.min(Math.max(getLifecyclePercentage(mattress.lifeCyclesEnd), 10), 90)}%`, 
              top: -18, 
              transform: 'translateX(-50%)',
              zIndex: 3
            }}>
              <Box sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                bgcolor: '#008080',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                border: '2px solid white'
              }}>
                <KingBed sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="caption" sx={{ 
                display: 'block', 
                mt: 1, 
                fontWeight: 'medium', 
                textAlign: 'center', 
                whiteSpace: 'nowrap',
                position: 'absolute',
                left: 0,
                width: 60,
                transform: 'translateX(-50%)'
              }}>
                Current
              </Typography>
            </Box>
            
            {/* End of Life Marker */}
            <Box sx={{ 
              position: 'absolute', 
              left: '100%', 
              top: -18, 
              transform: 'translateX(-50%)',
              zIndex: 2
            }}>
              <Box sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                bgcolor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                border: '2px solid white'
              }}>
                <EventAvailable sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="caption" sx={{ 
                display: 'block', 
                mt: 1, 
                fontWeight: 'medium', 
                textAlign: 'center', 
                whiteSpace: 'nowrap',
                position: 'absolute',
                right: 0,
                width: 60,
                transform: 'translateX(50%)'
              }}>
                End of Life
              </Typography>
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              height: 6,
              width: `${Math.min(getLifecyclePercentage(mattress.lifeCyclesEnd), 100)}%`,
              bgcolor: '#008080',
              borderRadius: 3,
              zIndex: 1,
              backgroundImage: 'linear-gradient(90deg, #10b981, #008080, #ef4444)'
            }} />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 5,
            px: 2,
            py: 2,
            bgcolor: '#f8fafc',
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Production Date</Typography>
              <Typography variant="body1" fontWeight="medium">
                {mattress.productionDate ? formatDate(mattress.productionDate) : 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Current Status</Typography>
              <Chip 
                label={getStatusString(mattress.status)} 
                size="small" 
                color={getStatusColor(mattress.status)}
                sx={{ fontWeight: 600, mt: 0.5 }}
              />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>End of Life Date</Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(mattress.lifeCyclesEnd)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 12, 
                height: 12, 
                borderRadius: '50%', 
                bgcolor: getLifecyclePercentage(mattress.lifeCyclesEnd) > 75 ? '#ef4444' : 
                        getLifecyclePercentage(mattress.lifeCyclesEnd) > 50 ? '#f59e0b' : '#10b981',
                mr: 1
              }} />
              <Typography variant="body2" color="text.secondary">
                {getDaysRemaining(mattress.lifeCyclesEnd)} days remaining
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight="bold" color={
              getLifecyclePercentage(mattress.lifeCyclesEnd) > 75 ? '#ef4444' : 
              getLifecyclePercentage(mattress.lifeCyclesEnd) > 50 ? '#f59e0b' : '#10b981'
            }>
              {Math.round(getLifecyclePercentage(mattress.lifeCyclesEnd))}% used
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

// Helper functions
const getStatusString = (statusCode) => {
  // Updated to match Backend.Common.Enums.MattressStatus
  const statusMap = {
    0: 'In Production',
    1: 'In Inventory',
    2: 'Assigned',
    3: 'In Use',
    4: 'Needs Cleaning',
    5: 'Decommissioned',
    6: 'In Transit',
    7: 'Rotation Needed'
  };
  
  return statusMap[statusCode] || 'Unknown';
};

const getStatusColor = (statusCode) => {
  // Updated to match Backend.Common.Enums.MattressStatus
  const colorMap = {
    0: 'info',     // In Production - blue
    1: 'default',  // In Inventory - gray
    2: 'primary',  // Assigned - blue
    3: 'success',  // In Use - green
    4: 'warning',  // Needs Cleaning - yellow/orange
    5: 'error',    // Decommissioned - red
    6: 'info',     // In Transit - blue
    7: 'warning'   // Rotation Needed - yellow/orange
  };
  
  return colorMap[statusCode] || 'default';
};

export default MattressLifecycleTimeline; 