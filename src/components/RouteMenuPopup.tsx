'use client';

import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RouteIcon from '@mui/icons-material/Route';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// Structured Types for clean data handling
export interface CruiseStop {
  time: string;
  title: string;
  details: string;
}

export interface MenuSection {
  meal: string; // e.g., "Welcome Drink", "Traditional Lunch"
  items: string[];
}

export interface CruisePackageDetails {
  id: string;
  name: string;
  price: string;
  routes: CruiseStop[];
  menu: MenuSection[];
}

interface RouteMenuPopupProps {
  open: boolean;
  onClose: () => void;
  packageData: CruisePackageDetails | null;
}

export default function RouteMenuPopup({ open, onClose, packageData }: RouteMenuPopupProps) {
  if (!packageData) return null;

  const handleWhatsAppInquiry = () => {
    const text = `Hi Kayal Vista, I am checking availability for the *${packageData.name}* package (${packageData.price}). Could you share open dates?`;
    window.open(`https://wa.me/919633134324?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* 1. TOP TITLE BANNER */}
      <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#008080', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {packageData.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
            Itinerary Schedule & Traditional On-board Menu Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* 2. CORE SPECIFICATIONS GRID */}
      <DialogContent dividers sx={{ p: 3, bgcolor: 'background.default' }}>
        <Grid container spacing={4}>
          
          {/* CRUISE ROUTE STEPPER COLUMN */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <RouteIcon sx={{ color: '#008080' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Cruise Route & Timing
              </Typography>
            </Box>

            <Box sx={{ borderLeft: '2px dashed #008080', ml: 1.5, pl: 3, position: 'relative' }}>
              {packageData?.routes?.map((stop, idx) => (
                <Box key={idx} sx={{ mb: 3, position: 'relative' }}>
                  {/* Styled Glowing Anchor Ring */}
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: '#008080', 
                    position: 'absolute', 
                    left: -31, 
                    top: 4,
                    boxShadow: '0 0 8px rgba(0,128,128,0.6)',
                    border: '2px solid #fff'
                  }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#008080', display: 'block', textTransform: 'uppercase', tracking: 1 }}>
                    {stop.time}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.2 }}>
                    {stop.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                    {stop.details}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* CATERING MENU COLUMN */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <RestaurantMenuIcon sx={{ color: '#008080' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Food & Beverage Spread
              </Typography>
            </Box>

            {packageData?.menu?.map((menuSection, idx) => (
              <Box key={idx} sx={{ 
                mb: 2, 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'background.paper', 
                border: '1px solid', 
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#008080', textTransform: 'uppercase', mb: 1 }}>
                  {menuSection.meal}
                </Typography>
                <Divider sx={{ mb: 1 }} />
               <List dense sx={{ p: 0 }}>
  {menuSection.items.map((foodItem, fIdx) => (
    <ListItem key={fIdx} sx={{ p: 0, py: 0.25 }}>
      <ListItemIcon sx={{ minWidth: 20 }}>
        <FiberManualRecordIcon sx={{ fontSize: 6, color: 'text.secondary' }} />
      </ListItemIcon>
      
      {/* Passing a styled Typography component directly fixes the TS declaration error */}
      <ListItemText 
        primary={
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
            {foodItem}
          </Typography>
        } 
      />
    </ListItem>
  ))}
</List>
              </Box>
            ))}
          </Grid>

        </Grid>
      </DialogContent>

      {/* 3. MODAL ACTION BASES */}
      <DialogActions sx={{ p: 2.5, bgcolor: 'background.paper', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Base Price Estimation
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#008080' }}>
            {packageData.price}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ fontWeight: 600, borderRadius: 2 }}>
            Go Back
          </Button>
          <Button 
            variant="contained" 
            onClick={handleWhatsAppInquiry}
            startIcon={<WhatsAppIcon />}
            sx={{ 
              bgcolor: '#25D366', 
              color: '#fff',
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
              '&:hover': { bgcolor: '#128C7E' }
            }}
          >
            Confirm via WhatsApp
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}