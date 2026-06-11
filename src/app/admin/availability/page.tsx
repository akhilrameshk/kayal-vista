/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  CircularProgress,
   Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider
} from '@mui/material';

import { LocalizationProvider, StaticDatePicker, PickerDay as PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import EventBusyIcon from '@mui/icons-material/EventBusy';

import { CheckCircle } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format, isSameDay } from 'date-fns';

export default function AdminBulkAvailabilityPage() {
  const [boats, setBoats] = useState<any[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  
  const [loadingBoats, setLoadingBoats] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Custom Dialog state management
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogConfig, setDialogConfig] = useState<{ type: 'success' | 'alert'; title: string; message: string }>({
    type: 'success',
    title: '',
    message: ''
  });

  const fetchFleet = async () => {
    setLoadingBoats(true);
    const token = localStorage.getItem('kayal_vista_auth_token');
    try {
      const res = await fetch('/api/admin/boats', { 
        headers: { 'Authorization': token || '' } 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setBoats(data.boats || []);
    } catch (err: any) { 
      console.error(err); 
      triggerDialog('alert', 'Connection Failed', err.message || 'Failed to populate houseboats fleet records.');
    } finally { 
      setLoadingBoats(false); 
    }
  };

  useEffect(() => { 
    fetchFleet(); 
  }, []);

  const triggerDialog = (type: 'success' | 'alert', title: string, message: string) => {
    setDialogConfig({ type, title, message });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (dialogConfig.type === 'success') {
      window.location.reload();
    }
  };

  const handleDateChange = (date: any) => {
    if (!date) return;
    const nativeDate = date.toDate ? date.toDate() : new Date(date);

    setSelectedDates((prevDates) => {
      const exists = prevDates.some((d) => isSameDay(d, nativeDate));
      if (exists) {
        return prevDates.filter((d) => !isSameDay(d, nativeDate));
      } else {
        return [...prevDates, nativeDate];
      }
    });
  };

  const renderCustomDay = (props: any) => {
    const { day, ...otherProps } = props;
    if (!day) return null;

    const nativeDate = day.toDate ? day.toDate() : new Date(day);
    const isSelected = selectedDates.some((d) => isSameDay(d, nativeDate));

    return (
      <PickersDay
        {...otherProps}
        day={day}
        sx={{
          transition: 'all 0.2s ease',
          ...(isSelected && {
            backgroundColor: '#d32f2f !important',
            color: '#ffffff !important',
            fontWeight: 700,
            borderRadius: '12px', // Modern squircle indicator geometry
            boxShadow: '0 4px 10px rgba(211, 47, 47, 0.3)',
            '&:hover': {
              backgroundColor: '#b71c1c !important',
              transform: 'scale(1.05)'
            },
          }),
        }}
      />
    );
  };

  const handleSaveBlockDates = async () => {
    if (!selectedBoat) {
      triggerDialog('alert', 'Selection Missing', 'Please select a houseboat option from the fleet dropdown menu before proceeding.');
      return;
    }
    if (selectedDates.length === 0) {
      triggerDialog('alert', 'No Dates Chosen', 'Please toggle at least one calendar asset block segment cell targets on the interactive panel.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('kayal_vista_auth_token');

    try {
      const formattedDates = selectedDates.map((d) => format(d, 'yyyy-MM-dd'));

      const response = await fetch('/api/admin/availability/bulk-block', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify({
          boatId: selectedBoat,
          dates: formattedDates,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to post availability override settings.');

      setSelectedDates([]); 
      triggerDialog('success', 'Update Successful', 'Bulk availability records synchronized smoothly. Clicking OK will refresh the current workspace viewport layouts.');

    } catch (err: any) {
      console.error(err);
      triggerDialog('alert', 'Transaction Error', err.message || 'An unexpected error occurred writing bulk calendar block mutations.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 8 }}>
        
        {/* VIEW HEADER TITLE BAR BANNER SECTION */}
        <Box sx={{ mb: 5, p: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 2, color: '#0f172a', letterSpacing: '-0.025em' }}>
            <Box sx={{ display: 'flex', p: 1.5, bgcolor: '#fef2f2', borderRadius: '14px', color: '#dc2626' }}>
              <EventBusyIcon fontSize="medium" />
            </Box>
            Bulk Availability Controller
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: '600px', fontWeight: 500, lineHeight: 1.6 }}>
            Select a target fleet unit to apply localized structural exceptions. Instantly drop dates below onto the calendar grid to block direct public discovery booking access pipelines.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* CONTROL SETTINGS CONTROLLER VIEW CARD */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: '20px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.03), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                1. Asset Setup
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel id="admin-select-boat-label" sx={{ fontWeight: 500 }}>Select Houseboat Fleet Unit</InputLabel>
                <Select
                  labelId="admin-select-boat-label"
                  value={selectedBoat}
                  label="Select Houseboat Fleet Unit"
                  onChange={(e) => {
                    setSelectedBoat(e.target.value);
                    setSelectedDates([]); 
                  }}
                  disabled={loadingBoats}
                  sx={{ 
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' }
                  }}
                >
                  {loadingBoats ? (
                    <MenuItem disabled><CircularProgress size={20} sx={{ mr: 2 }} /> Loading active assets...</MenuItem>
                  ) : (
                    boats.map((boat) => (
                      <MenuItem key={boat._id} value={boat._id} sx={{ py: 1.5, fontWeight: 500 }}>
                        {boat.name} {boat.rooms ? `— (${boat.rooms} Rooms)` : ''}
                      </MenuItem>
                    ))
                  )}
                </Select>
                <FormHelperText sx={{ mx: 0.5, mt: 1 }}>Target configuration index tracking overrides.</FormHelperText>
              </FormControl>

              <Divider sx={{ borderStyle: 'dashed' }} />

              {/* DYNAMIC CALENDAR COUNTER SELECTION VISUAL TRAY */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  2. Selected Queues
                </Typography>
                {selectedDates.length > 0 ? (
                  <Paper variant="outlined" sx={{ p: 2.5, bgcolor: '#fafafa', borderRadius: '14px', borderColor: '#e2e8f0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#64748b', tracking: '0.05em', display: 'block', mb: 1.5 }}>
                      Pending Block Injections ({selectedDates.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '140px', overflowY: 'auto', pr: 0.5 }}>
                      {selectedDates.map((d, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            bgcolor: '#fef2f2', 
                            color: '#b91c1c', 
                            px: 1.5, 
                            py: 0.75, 
                            borderRadius: '8px', 
                            fontSize: '0.75rem', 
                            fontWeight: 700,
                            border: '1px solid #fee2e2'
                          }}
                        >
                          {format(d, 'dd MMM yyyy')}
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                ) : (
                  <Box sx={{ p: 4, border: '2px dashed #e2e8f0', borderRadius: '14px', textAlign: 'center', color: '#94a3b8' }}>
                    <CalendarMonthIcon sx={{ fontSize: 32, mb: 1, opacity: 0.6 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>No dates flagged yet. Tap calendar cells to populate.</Typography>
                  </Box>
                )}
              </Box>

              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleSaveBlockDates}
                disabled={submitting || !selectedBoat || selectedDates.length === 0}
                sx={{
                  mt: 'auto',
                  textTransform: 'none',
                  fontWeight: 800,
                  borderRadius: '12px',
                  py: 1.8,
                  fontSize: '0.95rem',
                  bgcolor: '#dc2626',
                  boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.25)',
                  '&:hover': { bgcolor: '#b91c1c', boxShadow: 'none' },
                  '&.Mui-disabled': { bgcolor: '#f1f5f9', color: '#94a3b8' }
                }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Commit Calendar Modifications'}
              </Button>
            </Paper>
          </Grid>

          {/* INTERACTIVE COMPONENT GRID ELEMENT VIEW CARD */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Paper
              elevation={0}
              sx={{ 
                border: '1px solid #e2e8f0', 
                borderRadius: '24px', 
                overflow: 'hidden', 
                width: '100%',
                maxWidth: '460px',
                p: 2,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.02), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
                '& .MuiPickersLayout-root': {  },
                '& .MuiPickersCalendarHeader-root': { px: 1, pt: 1 },
                '& .MuiPickersCalendarHeader-label': { fontWeight: 800, color: '#0f172a' },
                '& .MuiDayCalendar-weekDayLabel': { fontWeight: 700, color: '#64748b' },
                '& .MuiPickersArrowSwitcher-button': { color: '#475569' }
              }}
            >
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={null} 
                onChange={handleDateChange}
                slots={{ day: renderCustomDay }}
                disabled={!selectedBoat || loadingBoats}
                slotProps={{
                  actionBar: { actions: [] } 
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* CUSTOM MODERN CONFIRMATION & ALERT MODAL VIEW DIALOG */}
        <Dialog 
  open={dialogOpen} 
  onClose={handleDialogClose}
  // The modern v5/v6 type-safe way to style the inner Paper container
  slotProps={{
    paper: {
      sx: { 
        borderRadius: '16px', 
        p: 1.5, 
        maxWidth: '400px', 
        width: '100%' 
      }
    }
  }}
>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, px: 2, textAlign: 'center' }}>
            {dialogConfig.type === 'success' ? (
              <Box sx={{ color: '#16a34a', bgcolor: '#f0fdf4', p: 2, borderRadius: '50%', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40 }} />
              </Box>
            ) : (
              <Box sx={{ color: '#dc2626', bgcolor: '#fef2f2', p: 2, borderRadius: '50%', mb: 2 }}>
                <EventBusyIcon sx={{ fontSize: 40 }} />
              </Box>
            )}
            
            <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', p: 0, mb: 1 }}>
              {dialogConfig.title}
            </DialogTitle>
            
            <DialogContent sx={{ p: 0, mb: 3 }}>
              <DialogContentText sx={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.5 }}>
                {dialogConfig.message}
              </DialogContentText>
            </DialogContent>
          </Box>
          
          <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 2 }}>
            <Button 
              onClick={handleDialogClose} 
              variant="contained" 
              fullWidth
              color={dialogConfig.type === 'success' ? 'success' : 'inherit'}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 700, 
                borderRadius: '10px', 
                py: 1.2,
                boxShadow: 'none',
                bgcolor: dialogConfig.type === 'success' ? '#16a34a' : '#475569',
                '&:hover': { bgcolor: dialogConfig.type === 'success' ? '#15803d' : '#334155', boxShadow: 'none' }
              }}
            >
              Dismiss Notification
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </LocalizationProvider>
  );
}