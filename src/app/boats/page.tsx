/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  TextField,
  InputAdornment,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import SearchIcon from '@mui/icons-material/Search';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WavesIcon from '@mui/icons-material/Waves';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

import BookingModal from '@/components/BookingModal';
import DetailsModal from '@/components/DetailsModal';

const CARD_PALETTES = [
  {
    gradient: 'linear-gradient(135deg, #004d40 0%, #00796b 100%)', // Kerala Deep Teal
    lightBg: '#e0f2f1',
    accentColor: '#00796b',
    btnGradient: 'linear-gradient(135deg, #00796b, #4db6ac)',
    glow: 'rgba(0, 121, 107, 0.12)'
  },
  {
    gradient: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)', // Vembanad Lake Ocean Blue
    lightBg: '#e3f2fd',
    accentColor: '#1565c0',
    btnGradient: 'linear-gradient(135deg, #1565c0, #64b5f6)',
    glow: 'rgba(21, 101, 192, 0.12)'
  },
  {
    gradient: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)', // Premium Coir & Wood Earth
    lightBg: '#efebe9',
    accentColor: '#5d4037',
    btnGradient: 'linear-gradient(135deg, #5d4037, #8d6e63)',
    glow: 'rgba(93, 64, 55, 0.12)'
  },
  {
    gradient: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)', // Kuttanad Sunset Orange
    lightBg: '#fff3e0',
    accentColor: '#f57c00',
    btnGradient: 'linear-gradient(135deg, #f57c00, #ffb74d)',
    glow: 'rgba(245, 124, 0, 0.12)'
  }
];

function BoatListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialStart = searchParams.get('start') ? new Date(searchParams.get('start')!) : new Date();
  const initialEnd = searchParams.get('end') ? new Date(searchParams.get('end')!) : new Date();
  
  // Parse initial state, fallback to 'Luxury Houseboat'
  const initialCategory = searchParams.get('type') || searchParams.get('category') || 'Luxury Houseboat';

  const [boats, setBoats] = useState<any[]>([]);
  const [filteredBoats, setFilteredBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [dates, setDates] = useState({
    start: initialStart,
    end: initialEnd
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBoat, setSelectedBoat] = useState<any>(null);

  const fetchBoats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/customer/available-boats?start=${dates.start.toISOString()}&end=${dates.end.toISOString()}`
      );
      const data = await res.json();
      const cleanData = Array.isArray(data) ? data : [];
      
      setBoats(cleanData);
    } catch (error) {
      console.error("Failed to load listings data:", error);
    } finally {
      setLoading(false);
    }
  }, [dates]);

  useEffect(() => {
    fetchBoats();
  }, [fetchBoats]);

  // Combined Dynamic Filtering Engine
  useEffect(() => {
    let result = boats;

    // Filters against local dropdown state string selection
    if (selectedCategory) {
      result = result.filter(
        (b: any) => b.type === selectedCategory || b.category === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter((boat: any) => {
        const boatName = (boat.name || '').toLowerCase();
        const hostName = (boat.host || boat.ownerName || '').toLowerCase();
        return boatName.includes(lowSearch) || hostName.includes(lowSearch);
      });
    }

    setFilteredBoats(result);
  }, [searchTerm, boats, selectedCategory]);

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      
      {/* HEADER HERO STRIP */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          color: '#ffffff',
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <WavesIcon 
          sx={{ 
            position: 'absolute', 
            right: -40, 
            bottom: -40, 
            fontSize: '280px', 
            color: 'rgba(255,255,255,0.03)',
            transform: 'rotate(-15deg)' 
          }} 
        />

        <Container maxWidth="lg">
          <Stack spacing={1.5} sx={{ mb: 1.5 }}>
            <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: '#4db6ac' }}>
              LIVE AVAILABILITY ENGINE
            </Typography>
          </Stack>
          
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1, mb: 1.5, fontSize: { xs: '2.2rem', md: '3rem' } }}>
            Available {selectedCategory === 'Traditional' ? 'Traditional Shikkaras' : `${selectedCategory} Stays`}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: '600px', fontWeight: 400, fontSize: '1.05rem' }}>
            Book premium backwater cruises verified directly with state operators. No agent markups.
          </Typography>
        </Container>
      </Box>

      {/* SEARCH AND FILTER INTERFACE FLOATING PANEL */}
      <Container maxWidth="lg" sx={{ mt: '-50px', mb: 6, position: 'relative', zIndex: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            display: 'flex',
            gap: 2.5,
            flexDirection: 'column',
            alignItems: 'stretch',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px rgba(15, 32, 39, 0.08)'
          }}
        >
          {/* TOP BAR: SEARCH TEXT */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder={`Search ${selectedCategory.toLowerCase()}s, operators, locations...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#00796b' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '&:hover fieldset': { borderColor: '#00796b' },
                '&.Mui-focused fieldset': { borderColor: '#00796b', borderWidth: '2px' }
              }
            }}
          />

          {/* BOTTOM BAR: DATES + CATEGORY SELECT MENU + ACTIONS */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
            
            <DatePicker
              label="Check In"
              value={dates.start}
              onChange={(v: any) => setDates({ ...dates, start: v })}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  sx: { '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fcfdfe' } }
                } 
              }}
            />

            <DatePicker
              label="Check Out"
              value={dates.end}
              onChange={(v: any) => setDates({ ...dates, end: v })}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  sx: { '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fcfdfe' } }
                } 
              }}
            />

            {/* CATEGORY SELECTION FIELD DROPDOWN COMPONENT */}
            <FormControl fullWidth variant="outlined">
              <InputLabel id="boat-category-select-label" sx={{ '&.Mui-focused': { color: '#00796b' } }}>
                Vessel Category
              </InputLabel>
              <Select
                labelId="boat-category-select-label"
                id="boat-category-select"
                value={selectedCategory}
                label="Vessel Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <DirectionsBoatIcon sx={{ color: '#00796b', mr: 0.5 }} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: '10px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00796b',
                    borderWidth: '2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00796b'
                  }
                }}
              >
                <MenuItem value="Luxury Houseboat">Luxury Houseboat</MenuItem>
                {/* <MenuItem value="Premium Houseboat">Premium Houseboat</MenuItem> */}
                <MenuItem value="Traditional">Traditional Shikkara</MenuItem>
                {/* <MenuItem value="Speedboat">High-Speed Motorboat</MenuItem> */}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={fetchBoats}
              startIcon={<CalendarMonthIcon />}
              sx={{
                px: 4,
                height: '56px',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #00796b 0%, #004d40 100%)',
                boxShadow: '0 4px 14px rgba(0, 121, 107, 0.3)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #004d40 0%, #00332c 100%)',
                  boxShadow: '0 6px 20px rgba(0, 121, 107, 0.4)',
                },
                width: { xs: '100%', md: 'auto' }
              }}
            >
              Check Availability
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* CORE CARDS WRAPPER GRID */}
      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', gap: 2.5 }}>
            <CircularProgress size={50} thickness={4.5} sx={{ color: '#00796b' }} />
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>
              SCANNING LAKE REGISTRIES...
            </Typography>
          </Box>
        ) : filteredBoats.length === 0 ? (
          /* EMPTY VIEW STATES */
          <Paper 
            elevation={0} 
            sx={{ 
              p: 8, 
              textAlign: 'center', 
              borderRadius: '16px', 
              border: '2px dashed #cbd5e1', 
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#f1f5f9', borderRadius: '50%', mb: 2.5 }}>
              <WavesIcon sx={{ fontSize: 44, color: '#94a3b8' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#334155', mb: 1, letterSpacing: -0.5 }}>
              No {selectedCategory} Available
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '420px', mx: 'auto', mb: 3, lineHeight: 1.6 }}>
              There are no matching items for your specified parameters or active timeframe. Try changing the category selector or modifying travel dates.
            </Typography>
            <Button variant="outlined" onClick={() => { setSearchTerm(''); setSelectedCategory('Luxury Houseboat'); fetchBoats(); }} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: '#cbd5e1', color: '#475569' }}>
              Reset Filters
            </Button>
          </Paper>
        ) : (
          <Box sx={{ overflow: 'hidden', pr: 0.5, pb: 2.5 }}>
            <Grid container spacing={4}>
              {filteredBoats.map((item, index) => {
                const palette = CARD_PALETTES[index % CARD_PALETTES.length];

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id || index}>
                    <Card
                      sx={{
                        borderRadius: '14px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        position: 'relative',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: `0 10px 30px ${palette.glow}`,
                        '&:hover': {
                          transform: 'translateY(-10px)',
                          boxShadow: `0 22px 45px ${palette.glow}, 0 8px 20px rgba(15, 32, 39, 0.05)`,
                          '& .card-media-zoom': { transform: 'scale(1.06)' }
                        }
                      }}
                    >
                      {/* THUMBNAIL COVER ELEMENT */}
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          className="card-media-zoom"
                          image={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80'}
                          alt={item.name || 'Premium Backwater Vessel'}
                          sx={{
                            height: 220,
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                        />

                        {/* BOAT NAME OVERLAY */}
                        <Typography
                          variant="h6"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '1.25rem',
                            lineHeight: 1.2,
                            letterSpacing: -0.3,
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.96)',
                            zIndex: 2,
                            maxWidth: '70%'
                          }}
                        >
                          {item.name}
                        </Typography>

                        {/* HOST WATERMARK LABEL */}
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            bottom: 14,
                            left: 14,
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            bgcolor: alpha('#0b1315', 0.75), 
                            backdropFilter: 'blur(6px)',
                            color: '#ffffff',
                            px: 1.6,
                            py: 0.7,
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: 0.1,
                            border: '1px solid rgba(255, 255, 255, 0.12)'
                          }}
                        >
                          By: {item.host || item.ownerName || 'Verified Operator'}
                        </Box>

                        {/* EXCLUSIVE EMBLEM */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: palette.gradient,
                            color: '#ffffff',
                            px: 1.6,
                            py: 0.6,
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.6,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: 0.8
                          }}
                        >
                          <StarIcon sx={{ fontSize: 13, color: '#ffd700' }} />
                          PREMIUM
                        </Box>
                      </Box>

                      {/* CONTENT BODY AREA */}
                      <CardContent
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          p: 3,
                          flex: 1,
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            gap: 2,
                            mb: 3.5
                          }}
                        >
                          {/* ROOM & USER COUNT PILLS */}
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                              icon={<MeetingRoomIcon sx={{ '&&': { color: palette.accentColor, fontSize: 16 } }} />} 
                              label={`${item.rooms || 0} Rooms`} 
                              sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 700, fontSize: '0.78rem', borderRadius: '6px' }}
                            />
                            <Chip 
                              icon={<GroupIcon sx={{ '&&': { color: palette.accentColor, fontSize: 16 } }} />} 
                              label={`${item.guests || item.capacity || 2} Guests`} 
                              sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 700, fontSize: '0.78rem', borderRadius: '6px' }}
                            />
                          </Stack>

                          {/* BASE PRICE */}
                          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#64748b', 
                                fontWeight: 600, 
                                display: 'block', 
                                mb: 0.2, 
                                textTransform: 'uppercase', 
                                letterSpacing: 0.5,
                                fontSize: '0.68rem'
                              }}
                            >
                              Base Price
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 900, 
                                color: palette.accentColor, 
                                letterSpacing: -0.5,
                                lineHeight: 1
                              }}
                            >
                              ₹{(item.basePrice || item.price || 0).toLocaleString('en-IN')}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mt: 'auto', mb: 2.5 }} />

                        {/* ACTION BAR LAYOUT LINKAGE */}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                              setSelectedBoat(item);
                              setIsDetailsModalOpen(true);
                            }}
                            sx={{ 
                              textTransform: 'none', 
                              borderRadius: '10px', 
                              fontWeight: 700,
                              py: 1.2,
                              borderColor: palette.accentColor,
                              color: palette.accentColor,
                              '&:hover': {
                                borderColor: palette.accentColor,
                                bgcolor: alpha(palette.accentColor, 0.05)
                              }
                            }}
                          >
                            Info
                          </Button>

                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                              setSelectedBoat(item);
                              setIsBookingModalOpen(true);
                            }}
                            sx={{
                              textTransform: 'none',
                              borderRadius: '10px', 
                              fontWeight: 700,
                              py: 1.2,
                              background: palette.btnGradient,
                              boxShadow: `0 4px 12px ${palette.glow}`,
                              '&:hover': {
                                background: palette.btnGradient,
                                opacity: 0.95,
                                boxShadow: `0 6px 16px ${palette.glow}`,
                              }
                            }}
                          >
                            Book Cruise
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Container>

      {/* CORE MODALS CONTAINER */}
      {selectedBoat && (
        <>
          <BookingModal
            open={isBookingModalOpen}
            handleClose={() => {
              setIsBookingModalOpen(false);
              fetchBoats();
            }}
            boat={selectedBoat}
          />

          <DetailsModal
            open={isDetailsModalOpen}
            handleClose={() => setIsDetailsModalOpen(false)}
            boat={selectedBoat}
          />
        </>
      )}
    </Box>
  );
}

export default function BoatListingsPage() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      }>
        <BoatListingsContent />
      </Suspense>
    </LocalizationProvider>
  );
}