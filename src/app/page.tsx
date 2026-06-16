/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Chip,
  Grid,
  Paper,
  CardMedia
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format, startOfDay } from 'date-fns';

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import BookingModal from '@/components/BookingModal';
import DetailsModal from '@/components/DetailsModal';

const CARD_PALETTES = [
  {
    gradient: 'linear-gradient(135deg, #004d40 0%, #00796b 100%)',
    accentColor: '#00796b !important',
    btnGradient: 'linear-gradient(135deg, #00796b, #4db6ac)',
    glow: 'rgba(0, 121, 107, 0.15)'
  },
  {
    gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
    accentColor: '#1565c0 !important',
    btnGradient: 'linear-gradient(135deg, #1565c0, #64b5f6)',
    glow: 'rgba(21, 101, 192, 0.15)'
  },
  {
    gradient: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)',
    accentColor: '#5d4037 !important',
    btnGradient: 'linear-gradient(135deg, #5d4037, #8d6e63)',
    glow: 'rgba(93, 64, 55, 0.15)'
  }
];

export default function LandingPage() {
  const router = useRouter();
  
  // Section layout references for scrolling focus window triggers
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const [houseboats, setHouseboats] = useState<any[]>([]);
  const [shikkaras, setShikkaras] = useState<any[]>([]);
  const [totalHouseboats, setTotalHouseboats] = useState(0);
  const [totalShikkaras, setTotalShikkaras] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. STATE MANAGEMENT (Clean local native Date states)
  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
    start: startOfDay(new Date()),
    end: startOfDay(addDays(new Date(), 1))
  });

  // Programmatic control state variables to control picker popping open
  const [startPickerOpen, setStartPickerOpen] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBoat, setSelectedBoat] = useState<any>(null);

  // 2. API SYNC (Now partitions explicitly by exact data string matches)
  const fetchVessels = useCallback(async () => {
    if (!dates.start || !dates.end) {
      // If dates aren't selected when trying to search, prompt selection
      setStartPickerOpen(true);
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    const startStr = format(dates.start, 'yyyy-MM-dd');
    const endStr = format(dates.end, 'yyyy-MM-dd');

    try {
      const res = await fetch(`/api/customer/available-boats?start=${startStr}&end=${endStr}`);
      const data = await res.json();
      const cleanData = Array.isArray(data) ? data : [];
console.log("Fetched Vessels Data:", cleanData);
      // Strict String Category Filtering Logic
      const filteredHouseboats = cleanData.filter((b: any) => b.type === 'Luxury Houseboat');
      const filteredShikkaras = cleanData.filter((b: any) => b.type === 'Traditional');

      setHouseboats(filteredHouseboats.slice(0, 3)); 
      setTotalHouseboats(filteredHouseboats.length);

      setShikkaras(filteredShikkaras.slice(0, 3));
      setTotalShikkaras(filteredShikkaras.length);
    } catch (err) {
      console.error("Error loading available vessels:", err);
    } finally {
      setLoading(false);
    }
  }, [dates]);

  useEffect(() => {
    fetchVessels();
  }, [fetchVessels]);

  // 3. NORMALIZATION HANDLERS
  const handleStartDateChange = (val: Date | null) => {
    if (!val) {
      setDates({ start: null, end: null });
      return;
    }
    const normalizedStart = startOfDay(val);
    setDates(prev => ({
      start: normalizedStart,
      end: prev.end && prev.end > normalizedStart ? prev.end : startOfDay(addDays(normalizedStart, 1))
    }));
  };

  const handleEndDateChange = (val: Date | null) => {
    if (!val) {
      setDates(prev => ({ ...prev, end: null }));
      return;
    }
    setDates(prev => ({ ...prev, end: startOfDay(val) }));
  };

  // Reusable Interceptor to verify timelines before loading modal overlays
  const executeWithDateValidation = (actionCallback: () => void) => {
    if (!dates.start || !dates.end) {
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setStartPickerOpen(true);
      }, 400);
    } else {
      actionCallback();
    }
  };

  const handleViewAllNavigation = (vesselType: string) => {
    if (!dates.start || !dates.end) {
      setStartPickerOpen(true);
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const params = new URLSearchParams({
      start: format(dates.start, 'yyyy-MM-dd'),
      end: format(dates.end, 'yyyy-MM-dd'),
      type: vesselType
    });
    router.push(`/boats?${params.toString()}`);
  };

  // Dry layout generator function for mapping card elements out uniformly
  const renderVesselGrid = (vesselsList: any[]) => (
    <Grid 
      container 
      spacing={3}
      sx={{
        display: 'flex',
        flexWrap: { xs: 'nowrap', sm: 'wrap' },
        overflowX: { xs: 'auto', sm: 'visible' },
        scrollSnapType: { xs: 'x mandatory', sm: 'none' },
        pb: { xs: 3, sm: 0 },
        px: { xs: 2, sm: 0 },
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {vesselsList.map((item: any, index) => {
        const palette = CARD_PALETTES[index % CARD_PALETTES.length];
        return (
          <Grid 
          size={{ xs: 10.5, sm: 6, md: 4 }}
           
            key={item?._id}
            sx={{
              flexShrink: { xs: 0, sm: 1 },
              scrollSnapAlign: { xs: 'start', sm: 'none' }
            }}
          >
            <Card sx={{ borderRadius: '16px', boxShadow: `0 10px 30px ${palette.glow}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia component="img" image={item.images?.[0] || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600'} sx={{ height: 220 }} />
                <Typography variant="h6" sx={{ position: 'absolute', bottom: 16, left: 16, color: 'white', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                  {item.name}
                </Typography>
              </Box>
              <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <Chip icon={<MeetingRoomIcon sx={{ fontSize: '16px !important' }}/>} label={`${item.rooms || 0} Rooms`} size="small" />
                  <Chip icon={<GroupIcon sx={{ fontSize: '16px !important' }}/>} label={`${item.guests || item.capacity || 2} Guests`} size="small" />
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" >Base Price</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: palette.accentColor }}>₹{(item.basePrice || item.price || 0).toLocaleString('en-IN')}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ borderRadius: '6px' }} 
                      onClick={() => executeWithDateValidation(() => { setSelectedBoat(item); setIsDetailsModalOpen(true); })}
                    >
                      Info
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ bgcolor: palette.accentColor, borderRadius: '6px', '&:hover': { bgcolor: palette.accentColor, filter: 'brightness(0.9)' } }} 
                      onClick={() => executeWithDateValidation(() => { setSelectedBoat(item); setIsBookingModalOpen(true); })}
                    >
                      Book
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* HERO SECTION */}
      <Box sx={{ position: 'relative', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', top: 0 }}>
        <Box component="img" src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1920"
          sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))' }} />

        <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', px: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>Kayal Vista</Typography>
          <Typography variant="h5" sx={{ mb: 4, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>Discover Kerala Backwaters</Typography>

          {/* SEARCH BOX BOX SECTION CONTAINER */}
          <Paper 
            ref={searchSectionRef}
            sx={{ 
              p: 2.5, 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap', 
              borderRadius: "14px", 
              mx: 'auto', 
              maxWidth: '1000px',
              width: '100%',
              alignItems: 'center'
            }}
          >
            <DatePicker
              label="Start Journey"
              value={dates.start}
              open={startPickerOpen}
              onOpen={() => setStartPickerOpen(true)}
              onClose={() => setStartPickerOpen(false)}
              onChange={(v: any) => handleStartDateChange(v)}
              sx={{ flex: '1 1 280px', minWidth: { xs: '100%', sm: '280px' } }}
            />

            <DatePicker
              label="End Journey"
              value={dates.end}
              onChange={(v: any) => handleEndDateChange(v)}
              minDate={dates.start ? addDays(dates.start, 1) : addDays(new Date(), 1)}
              sx={{ flex: '1 1 280px', minWidth: { xs: '100%', sm: '280px' } }}
            />

            <Button 
              variant="contained" 
              size="large" 
              onClick={fetchVessels} 
              sx={{ 
                px: 4, 
                height: '56px', 
                fontWeight: 700, 
                borderRadius: '10px',
                flex: { xs: '1 1 100%', md: '0 0 auto' }
              }}
            >
              Search
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* RENDER GRID INTERFACES */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 8, px: { xs: 0, sm: 2 } }}>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
        ) : (
          <Stack spacing={8}>
            
            {/* 1. HOUSEBOATS ZONE (Filters: 'Luxury Houseboat') */}
            {houseboats.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 2, sm: 0 } }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                    Featured Luxury Houseboats
                  </Typography>
                  {totalHouseboats > 3 && (
                    <Button 
                      onClick={() => handleViewAllNavigation('Luxury Houseboat')} 
                      endIcon={<ArrowForwardIcon />} 
                      sx={{ fontWeight: 700, color: '#00796b', whiteSpace: 'nowrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                    >
                      View All ({totalHouseboats})
                    </Button>
                  )}
                </Box>
                {renderVesselGrid(houseboats)}
              </Box>
            )}

            {/* 2. SHIKKARAS ZONE (Filters: 'Traditional') */}
            {shikkaras.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 2, sm: 0 } }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                    Traditional Shikkaras
                  </Typography>
                  {totalShikkaras > 3 && (
                    <Button 
                      onClick={() => handleViewAllNavigation('Traditional')} 
                      endIcon={<ArrowForwardIcon />} 
                      sx={{ fontWeight: 700, color: '#00796b', whiteSpace: 'nowrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                    >
                      View All ({totalShikkaras})
                    </Button>
                  )}
                </Box>
                {renderVesselGrid(shikkaras)}
              </Box>
            )}

          </Stack>
        )}
      </Container>

      {/* MODALS */}
      {selectedBoat && (
        <>
          <BookingModal open={isBookingModalOpen} handleClose={() => { setIsBookingModalOpen(false); fetchVessels(); }} boat={selectedBoat} />
          <DetailsModal open={isDetailsModalOpen} handleClose={() => setIsDetailsModalOpen(false)} boat={selectedBoat} />
        </>
      )}
    </LocalizationProvider>
  );
}