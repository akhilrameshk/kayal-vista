/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  CardMedia,
  alpha
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format, startOfDay } from 'date-fns';

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

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
  const [boats, setBoats] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. STATE MANAGEMENT (Local native Dates for logic)
  const [dates, setDates] = useState({
    start: startOfDay(new Date()),
    end: startOfDay(addDays(new Date(), 1))
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBoat, setSelectedBoat] = useState<any>(null);

  // 2. API SYNC (Sends clean yyyy-MM-dd strings)
  const fetchBoats = useCallback(async () => {
    setLoading(true);
    const startStr = format(dates.start, 'yyyy-MM-dd');
    const endStr = format(dates.end, 'yyyy-MM-dd');

    const res = await fetch(`/api/customer/available-boats?start=${startStr}&end=${endStr}`);
    const data = await res.json();
    const cleanData = Array.isArray(data) ? data : [];

    setBoats(cleanData.slice(0, 3)); 
    setTotalCount(cleanData.length);
    setLoading(false);
  }, [dates]);

  useEffect(() => {
    fetchBoats();
  }, [fetchBoats]);

  // 3. TS FIX: Explicitly cast the value to avoid PickerValue/Dayjs errors
  const handleStartDateChange = (val: Date | null) => {
    if (!val) return;
    const normalizedStart = startOfDay(val);
    setDates({
      start: normalizedStart,
      // Force end date to be start + 1 if it's currently earlier or equal
      end: dates.end <= normalizedStart ? addDays(normalizedStart, 1) : dates.end
    });
  };

  const handleEndDateChange = (val: Date | null) => {
    if (!val) return;
    setDates(prev => ({ ...prev, end: startOfDay(val) }));
  };

  const handleViewAllNavigation = () => {
    const params = new URLSearchParams({
      start: format(dates.start, 'yyyy-MM-dd'),
      end: format(dates.end, 'yyyy-MM-dd')
    });
    router.push(`/boats?${params.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* HERO SECTION */}
      <Box sx={{ position: 'relative', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box component="img" src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1920"
          sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))' }} />

        <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>Kayal Vista</Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>Discover Kerala Backwaters</Typography>

          {/* SEARCH BOX */}
          <Paper sx={{ p: 2.5, display: 'flex', gap: 2, flexWrap: 'wrap', borderRadius: "14px", mx: 'auto', maxWidth: '1000px' }}>
           <DatePicker
              label="Start"
              value={dates.start}
             
              onChange={(v: any) => handleStartDateChange(v )}
              sx={{ minWidth: "450px" }}
            />

            <DatePicker
              label="End"
              value={dates.end}
               minDate={addDays(dates.start, 1)}
               
              onChange={(v: any) => handleEndDateChange(v)}
              sx={{ minWidth: "450px" }}
            />

            <Button variant="contained" size="large" onClick={fetchBoats} sx={{ px: 4, fontWeight: 700, borderRadius: '10px' }}>
              Search
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* FEATURED LIST */}
      <Container sx={{ pt: 8, pb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Featured Houseboats</Typography>
          {totalCount > 3 && (
            <Button onClick={handleViewAllNavigation} endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700, color: '#00796b' }}>
              View All ({totalCount})
            </Button>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            {boats.map((item, index) => {
              const palette = CARD_PALETTES[index % CARD_PALETTES.length];
              return (
                <Grid size={{ xs: 12, md: 4 }} key={item._id}>
                  <Card sx={{ borderRadius: '16px', boxShadow: `0 10px 30px ${palette.glow}`, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" image={item.image || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600'} sx={{ height: 220 }} />
                      <Typography variant="h6" sx={{ position: 'absolute', top: 16, left: 16, color: 'white', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {item.name}
                      </Typography>
                    </Box>
                    <CardContent sx={{ flex: 1, p: 3 }}>
                       <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <Chip icon={<MeetingRoomIcon sx={{ fontSize: '16px !important' }}/>} label={`${item.rooms} Rooms`} size="small" />
                          <Chip icon={<GroupIcon sx={{ fontSize: '16px !important' }}/>} label={`${item.guests || 2} Guests`} size="small" />
                       </Stack>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Base Price</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: palette.accentColor }}>₹{item.basePrice || item.price}</Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Button variant="outlined" size="small" onClick={() => { setSelectedBoat(item); setIsDetailsModalOpen(true); }}>Info</Button>
                            <Button variant="contained" size="small" sx={{ bgcolor: palette.accentColor }} onClick={() => { setSelectedBoat(item); setIsBookingModalOpen(true); }}>Book Cruise</Button>
                          </Stack>
                       </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* MODALS */}
      {selectedBoat && (
        <>
          <BookingModal open={isBookingModalOpen} handleClose={() => { setIsBookingModalOpen(false); fetchBoats(); }} boat={selectedBoat} />
          <DetailsModal open={isDetailsModalOpen} handleClose={() => setIsDetailsModalOpen(false)} boat={selectedBoat} />
        </>
      )}
    </LocalizationProvider>
  );
}