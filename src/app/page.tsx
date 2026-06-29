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
  CardMedia,
  Divider,
  Tabs,
  Tab
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, format, startOfDay } from 'date-fns';

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import HotelIcon from '@mui/icons-material/Hotel';

import BookingModal from '@/components/BookingModal';
import DetailsModal from '@/components/DetailsModal';
import RouteMenuPopup from '@/components/RouteMenuPopup'; 
import RefundPolicyPopup from '@/components/RefundPolicyPopup';

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
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Tab State: 0 = Rooms, 1 = Boats (Rooms prioritized first)
  const [activeTab, setActiveTab] = useState(0);

  // Boats Inventories (Populated from your live DB API)
  const [houseboats, setHouseboats] = useState<any[]>([]);
  const [shikkaras, setShikkaras] = useState<any[]>([]);
  const [totalHouseboats, setTotalHouseboats] = useState(0);
  const [totalShikkaras, setTotalShikkaras] = useState(0);

  // Rooms Inventories (Populated from the new available-rooms API)
  const [acRooms, setAcRooms] = useState<any[]>([]);
  const [normalRooms, setNormalRooms] = useState<any[]>([]);
  const [dormitories, setDormitories] = useState<any[]>([]);
  const [totalAcRooms, setTotalAcRooms] = useState(0);
  const [totalNormalRooms, setTotalNormalRooms] = useState(0);
  const [totalDormitories, setTotalDormitories] = useState(0);

  const [loading, setLoading] = useState(false);

  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
    start: startOfDay(new Date()),
    end: startOfDay(addDays(new Date(), 1))
  });

  const [startPickerOpen, setStartPickerOpen] = useState(false);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRouteMenuOpen, setIsRouteMenuOpen] = useState(false); 
  const [isRefundPopupOpen, setIsRefundPopupOpen] = useState(false);
  const [selectedBoat, setSelectedBoat] = useState<any>(null);

  const fetchVesselsAndRooms = useCallback(async () => {
    if (!dates.start || !dates.end) {
      setStartPickerOpen(true);
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    const startStr = format(dates.start, 'yyyy-MM-dd');
    const endStr = format(dates.end, 'yyyy-MM-dd');

    try {
      const [boatsRes, roomsRes] = await Promise.all([
        fetch(`/api/customer/available-boats?start=${startStr}&end=${endStr}`),
        fetch(`/api/customer/available-rooms?start=${startStr}&end=${endStr}`)
      ]);

      const boatsData = await boatsRes.json();
      const roomsData = await roomsRes.json();

      const cleanBoats = Array.isArray(boatsData) ? boatsData : [];
      const cleanRooms = Array.isArray(roomsData) ? roomsData : [];

      // 1. Process Live Boat Data Payload
      const filteredHouseboats = cleanBoats.filter((b: any) => b.type === 'Luxury Houseboat');
      const filteredShikkaras = cleanBoats.filter((b: any) => b.type === 'Traditional');

      setHouseboats(filteredHouseboats.slice(0, 3)); 
      setTotalHouseboats(filteredHouseboats.length);
      setShikkaras(filteredShikkaras.slice(0, 3));
      setTotalShikkaras(filteredShikkaras.length);

      // 2. Process Mock Rooms Data Payload
      const filteredAcRooms = cleanRooms.filter((r: any) => r.type === 'AC Room');
      const filteredNormalRooms = cleanRooms.filter((r: any) => r.type === 'Normal Room');
      const filteredDorms = cleanRooms.filter((r: any) => r.type === 'Dormitory');

      setAcRooms(filteredAcRooms.slice(0, 3));
      setTotalAcRooms(filteredAcRooms.length);
      setNormalRooms(filteredNormalRooms.slice(0, 3));
      setTotalNormalRooms(filteredNormalRooms.length);
      setDormitories(filteredDorms.slice(0, 3));
      setTotalDormitories(filteredDorms.length);

    } catch (err) {
      console.error("Error fetching available inventories:", err);
    } finally {
      setLoading(false);
    }
  }, [dates]);

  useEffect(() => {
    fetchVesselsAndRooms();
  }, [fetchVesselsAndRooms]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

  const executeWithDateValidation = (actionCallback: () => void) => {
    if (!dates.start || !dates.end) {
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      mixinsTimeoutPicker();
    } else {
      actionCallback();
    }
  };

  const mixinsTimeoutPicker = () => {
    setTimeout(() => {
      setStartPickerOpen(true);
    }, 400);
  };

  const handleViewAllNavigation = (itemType: string, tabIndex: number) => {
    if (!dates.start || !dates.end) {
      setStartPickerOpen(true);
      searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const params = new URLSearchParams({
      start: format(dates.start, 'yyyy-MM-dd'),
      end: format(dates.end, 'yyyy-MM-dd'),
      type: itemType
    });

    // targetRoute matches the index format: 0 for rooms, 1 for boats
    const targetRoute = tabIndex === 0 ? '/rooms' : '/boats';
    router.push(`${targetRoute}?${params.toString()}`);
  };

  const renderCardGrid = (itemsList: any[], currentType: string, tabIndex: number) => (
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
      {itemsList.map((item: any, index) => {
        const palette = CARD_PALETTES[index % CARD_PALETTES.length];
        const displayPrice = `₹${(item.basePrice || item.price || 0).toLocaleString('en-IN')}`;
        
        const localizedPackageData = {
          id: item._id,
          name: item.name,
          price: displayPrice,
          routes: item.routes || [
            { time: '11:30 AM', title: 'Boarding Point Arrival', details: 'Check-in with welcome drinks as your backwater getaway begins.' },
            { time: '01:30 PM', title: 'Traditional Lunch', details: 'Enjoy a freshly prepared traditional authentic Kerala feast.' },
            { time: '04:00 PM', title: 'Village Exploration', details: 'Exquisite scenery past water bound channels and historic heritage locations.' },
            { time: '05:30 PM', title: 'Check-out Stations', details: 'Return loop process concludes back safely at base station.' }
          ],
          menu: item.menu || [
            { meal: 'Welcome Sips', items: ['Fresh Tender Coconut Water', 'Spiced Lime Soda Drink'] },
            { meal: 'Kerala Delicacies', items: ['Kuttanadan Matta Rice', 'Authentic Karimeen Fish Fry', 'Kerala Chicken Masala', 'Vegetable Thoran'] },
            { meal: 'Evening Treats', items: ['Hot Pazham Pori (Banana Fritters)', 'Traditional Cardamom Tea'] }
          ]
        };

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
                <Box>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip icon={<MeetingRoomIcon sx={{ fontSize: '16px !important' }}/>} label={`${item.rooms || 1} Rooms`} size="small" />
                    <Chip icon={<GroupIcon sx={{ fontSize: '16px !important' }}/>} label={`${item.guests || item.capacity || 2} Guests`} size="small" />
                  </Stack>
                  
                  <Stack direction="column" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                    {/* Only show Route & Food Details if activeTab matches Boats (Index 1) */}
                    {activeTab === 1 && (
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<RestaurantMenuIcon />}
                        sx={{ color: '#00796b', fontWeight: 700, p: 0, '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                        onClick={() => executeWithDateValidation(() => { setSelectedBoat(localizedPackageData); setIsRouteMenuOpen(true); })}
                      >
                        Route & Food Details
                      </Button>
                    )}
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<AssignmentReturnIcon />}
                      sx={{ color: '#00796b', fontWeight: 700, p: 0, '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                      onClick={() => executeWithDateValidation(() => { setSelectedBoat(item); setIsRefundPopupOpen(true); })}
                    >
                      Refund Policy
                    </Button>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 4 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" >Base Price</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: palette.accentColor }}>{displayPrice}</Typography>
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
      {/* HERO BANNER SECTION */}
      <Box sx={{ position: 'relative', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', top: 0 }}>
        <Box component="img" src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1920"
          sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))' }} />

        <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', px: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>Kayal Vista</Typography>
          <Typography variant="h5" sx={{ mb: 4, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>Discover Kerala Backwaters</Typography>

          {/* DURATION SEARCH COMPONENT */}
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
              onClick={fetchVesselsAndRooms} 
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

      {/* CATEGORY SWITCHING TABS */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#00796b', height: '3px' },
            '& .MuiTab-root': { fontWeight: 700, fontSize: '1.1rem', px: 4 }
          }}
        >
          {/* Swapped order: Rooms first (Index 0), Boats second (Index 1) */}
          <Tab icon={<HotelIcon />} iconPosition="start" label="Rooms" />
          <Tab icon={<DirectionsBoatIcon />} iconPosition="start" label="Boats" />
        </Tabs>
      </Container>

      {/* DYNAMIC CARDS DISPLAY AREA */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8, px: { xs: 0, sm: 2 } }}>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
        ) : (
          <Stack spacing={8}>
            
            {/* TAB PANEL 0: ROOMS LAYOUT */}
            {activeTab === 0 && (
              <>
                {/* 1. AC ROOMS */}
                {acRooms.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 2, sm: 0 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                        Premium AC Rooms
                      </Typography>
                      {totalAcRooms > 3 && (
                        <Button 
                          onClick={() => handleViewAllNavigation('AC Room', 0)} 
                          endIcon={<ArrowForwardIcon />} 
                          sx={{ fontWeight: 700, color: '#00796b', whiteSpace: 'nowrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        >
                          View All ({totalAcRooms})
                        </Button>
                      )}
                    </Box>
                    {renderCardGrid(acRooms, 'AC Room', 0)}
                  </Box>
                )}

                {/* 2. NORMAL ROOMS */}
                {normalRooms.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 2, sm: 0 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                        Standard Normal Rooms
                      </Typography>
                      {totalNormalRooms > 3 && (
                        <Button 
                          onClick={() => handleViewAllNavigation('Normal Room', 0)} 
                          endIcon={<ArrowForwardIcon />} 
                          sx={{ fontWeight: 700, color: '#00796b', whiteSpace: 'nowrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        >
                          View All ({totalNormalRooms})
                        </Button>
                      )}
                    </Box>
                    {renderCardGrid(normalRooms, 'Normal Room', 0)}
                  </Box>
                )}

                {/* 3. DORMITORIES */}
                {dormitories.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 2, sm: 0 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                        Shared Dormitories & Bunks
                      </Typography>
                      {totalDormitories > 3 && (
                        <Button 
                          onClick={() => handleViewAllNavigation('Dormitory', 0)} 
                          endIcon={<ArrowForwardIcon />} 
                          sx={{ fontWeight: 700, color: '#00796b', whiteSpace: 'nowrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        >
                          View All ({totalDormitories})
                        </Button>
                      )}
                    </Box>
                    {renderCardGrid(dormitories, 'Dormitory', 0)}
                  </Box>
                )}
              </>
            )}

            {/* TAB PANEL 1: BOATS LAYOUT */}
            {activeTab === 1 && (
              <>
                {/* 1. LUXURY HOUSEBOATS */}
                {houseboats.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 2, sm: 0 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                        Featured Luxury Houseboats
                      </Typography>
                      {totalHouseboats > 3 && (
                        <Button 
                          onClick={() => handleViewAllNavigation('Luxury Houseboat', 1)} 
                          endIcon={<ArrowForwardIcon />} 
                          sx={{ fontWeight: 700, color: '#00796b', whiteSpace: 'nowrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        >
                          View All ({totalHouseboats})
                        </Button>
                      )}
                    </Box>
                    {renderCardGrid(houseboats, 'Luxury Houseboat', 1)}
                  </Box>
                )}

                {/* 2. TRADITIONAL SHIKKARAS */}
                {shikkaras.length > 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: { xs: 2, sm: 0 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
                        Traditional Shikkaras
                      </Typography>
                      {totalShikkaras > 3 && (
                        <Button 
                          onClick={() => handleViewAllNavigation('Traditional', 1)} 
                          endIcon={<ArrowForwardIcon />} 
                          sx={{ fontWeight: 700, color: '#00796b', whiteSpace: 'nowrap', fontSize: { xs: '0.85rem', sm: '1rem' } }}
                        >
                          View All ({totalShikkaras})
                        </Button>
                      )}
                    </Box>
                    {renderCardGrid(shikkaras, 'Traditional', 1)}
                  </Box>
                )}
              </>
            )}

          </Stack>
        )}
      </Container>

      {/* REUSABLE OVERLAY MODALS */}
      {selectedBoat && (
        <>
          <BookingModal open={isBookingModalOpen} handleClose={() => { setIsBookingModalOpen(false); fetchVesselsAndRooms(); }} boat={selectedBoat} />
          <DetailsModal open={isDetailsModalOpen} handleClose={() => setIsDetailsModalOpen(false)} boat={selectedBoat} />
          <RouteMenuPopup open={isRouteMenuOpen} onClose={() => setIsRouteMenuOpen(false)} packageData={selectedBoat} />
          <RefundPolicyPopup open={isRefundPopupOpen} onClose={() => setIsRefundPopupOpen(false)} boatName={selectedBoat?.name} />
        </>
      )}
    </LocalizationProvider>
  );
}