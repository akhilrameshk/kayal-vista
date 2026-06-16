// 'use client';
// import React, { useState, useMemo } from 'react';
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   MenuItem,
//   Card,
//   CardContent,
//   Stack,
//   Chip,
//   Button,
//   InputAdornment,
//   useTheme
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
// import InfoIcon from '@mui/icons-material/Info';

// interface FleetItem {
//   id: string;
//   title: string;
//   operator: string;
//   type: 'Luxury Houseboat' | 'Day Cruiser' | 'Premium Room';
//   vantagePoint: string;
//   capacity: string;
//   pricePerDay: number;
//   rating: number;
//   featuredView: string;
// }

// const SCENIC_FLEETS: FleetItem[] = [
//   {
//     id: 'fl-1',
//     title: 'Vembanad Glass-Roof Majesty',
//     operator: 'Alleppey Cruise Co.',
//     type: 'Luxury Houseboat',
//     vantagePoint: 'Full Glass Upper Deck Lounge (360° View)',
//     capacity: '2-12 Guests',
//     pricePerDay: 18500,
//     rating: 4.9,
//     featuredView: 'Perfect Sunrise Point'
//   },
//   {
//     id: 'fl-2',
//     title: 'Punnamada Breeze Panoramic Suite',
//     operator: 'Lake Vista Hospitality',
//     type: 'Premium Room',
//     vantagePoint: 'Wall-to-wall Glass Balcony overlooking racing tracks',
//     capacity: '2 Guests',
//     pricePerDay: 6500,
//     rating: 4.8,
//     featuredView: 'Lake Horizon Front'
//   },
//   {
//     id: 'fl-3',
//     title: 'Kuttanad Heritage Day Drifter',
//     operator: 'Kerala Ripples Ltd.',
//     type: 'Day Cruiser',
//     vantagePoint: 'Open-Air Elevated Observation Roof',
//     capacity: '5-25 Guests',
//     pricePerDay: 9000,
//     rating: 4.7,
//     featuredView: 'Narrow Canal Scenic Route'
//   },
//   {
//     id: 'fl-4',
//     title: 'Golden Hour Luxury Double Decker',
//     operator: 'Royal Kaayal Fleets',
//     type: 'Luxury Houseboat',
//     vantagePoint: 'Premium Sunset Viewing Deck with recliners',
//     capacity: '4-15 Guests',
//     pricePerDay: 22000,
//     rating: 5.0,
//     featuredView: 'Unobstructed Sunset Lane'
//   }
// ];

// export default function BrowsePage() {
//   const theme = useTheme();
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedType, setSelectedType] = useState('All');

//   const filteredFleets = useMemo(() => {
//     return SCENIC_FLEETS.filter((item) => {
//       const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             item.vantagePoint.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesType = selectedType === 'All' || item.type === selectedType;
//       return matchesSearch && matchesType;
//     });
//   }, [searchQuery, selectedType]);

//   return (
//     <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
//       <Container maxWidth="lg">
        
//         {/* ================= HEADER SECTION ================= */}
//         <Box sx={{ mb: 5, textAlign: { xs: 'center', sm: 'left' } }}>
//           <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
//             Explore the Vista
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             Verified options optimized specifically for panoramic views, open breezes, and golden hour sights.
//           </Typography>
//         </Box>

//         {/* ================= FILTER TOOLBAR ================= */}
//         <Box 
//           sx={{ 
//             bgcolor: 'background.paper', 
//             p: 3, 
//             borderRadius: 4, 
//             boxShadow: theme.palette.mode === 'light' ? '0px 4px 24px rgba(0,77,64,0.04)' : 'none',
//             border: '1px solid',
//             borderColor: theme.palette.mode === 'light' ? 'rgba(0,77,64,0.06)' : '#2d2d2d',
//             mb: 5
//           }}
//         >
//           {/* Responsive Layout Row with Native CSS Grid */}
//           <Box 
//             sx={{ 
//               display: 'grid', 
//               gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, 
//               gap: 3, 
//               alignItems: 'center' 
//             }}
//           >
//             {/* Live String Filtering */}
//             <TextField
//               fullWidth
//               placeholder="Search views (e.g., Upper deck, Glass-roof, Sunset)..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon color="primary" />
//                     </InputAdornment>
//                   ),
//                   sx: { borderRadius: 3 }
//                 }
//               }}
//             />
//             <TextField
//               fullWidth
//               select
//               label="Experience Category"
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <FilterListIcon color="primary" sx={{ mr: 0.5, fontSize: 20 }} />
//                     </InputAdornment>
//                   ),
//                   sx: { borderRadius: 3 }
//                 }
//               }}
//             >
             
//               <MenuItem value="All">All Vistas</MenuItem>
//               <MenuItem value="Luxury Houseboat">Luxury Houseboats</MenuItem>
//               <MenuItem value="Day Cruiser">Day Cruisers (No Stay)</MenuItem>
//               <MenuItem value="Premium Room">Lakeside Premium Rooms</MenuItem>
//             </TextField>
//           </Box>
//         </Box>

//         {/* ================= FLEET LISTINGS GRID ================= */}
//         {filteredFleets.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed', borderColor: 'text.secondary' }}>
//             <Typography variant="h6" color="text.secondary">No scenic viewpoints match your search constraints.</Typography>
//           </Box>
//         ) : (
//           /* Pure Box Layout using CSS Grid handles multi-column scaling natively */
//           <Box 
//             sx={{ 
//               display: 'grid', 
//               gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
//               gap: 4 
//             }}
//           >
//             {filteredFleets.map((item) => (
//               <Card 
//                 key={item.id}
//                 sx={{ 
//                   height: '100%', 
//                   borderRadius: 4, 
//                   display: 'flex', 
//                   flexDirection: 'column',
//                   boxShadow: '0px 6px 20px rgba(0,0,0,0.02)',
//                   transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//                   '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: '0px 12px 30px rgba(0,77,64,0.08)'
//                   }
//                 }}
//               >
//                 {/* Visual Accent Frame standing in for picture payloads */}
//                 <Box sx={{ height: 180, bgcolor: 'primary.main', opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', p: 3, position: 'relative' }}>
//                   <Stack sx={{ alignItems: 'center' }} spacing={1}>
//                     <DirectionsBoatIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
//                     <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'secondary.main' }}>
//                       {item.type}
//                     </Typography>
//                   </Stack>
//                   <Chip 
//                     label={item.featuredView} 
//                     size="small" 
//                     color="secondary" 
//                     sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 700, fontSize: '0.75rem' }} 
//                   />
//                 </Box>

//                 <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//                   <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
//                     <Box>
//                       <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
//                         {item.title}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         Hosted by {item.operator}
//                       </Typography>
//                     </Box>
//                     <Typography variant="subtitle2" sx={{ bgcolor: 'rgba(214,175,55,0.1)', color: 'secondary.dark', px: 1, py: 0.5, borderRadius: 1, fontWeight: 700, height: 'fit-content' }}>
//                       ★ {item.rating}
//                     </Typography>
//                   </Stack>

//                   {/* Custom Premium Value Proposition Block */}
//                   <Box sx={{ display: 'flex', gap: 1, bgcolor: theme.palette.mode === 'light' ? 'rgba(0,77,64,0.03)' : '#252525', p: 1.5, borderRadius: 2, my: 2 }}>
//                     <InfoIcon color="primary" sx={{ fontSize: 18, mt: 0.2, flexShrink: 0 }} />
//                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
//                       <strong>Vantage Asset:</strong> {item.vantagePoint}
//                     </Typography>
//                   </Box>

//                   <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2 }}>
//                     <Box>
//                       <Typography variant="h5" component="span" sx={{ fontWeight: 900, color: 'primary.main' }}>
//                         ₹{item.pricePerDay.toLocaleString('en-IN')}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary"> / cruise</Typography>
//                     </Box>
//                     <Button 
//                       variant="contained" 
//                       color="primary" 
//                       sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
//                       onClick={() => alert(`Direct Booking Request: Opening communication line for ${item.title}`)}
//                     >
//                       Request Vista
//                     </Button>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>
//         )}

//       </Container>
//     </Box>
//   );
// }

import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  Avatar,
  Stack,
  Button
} from '@mui/material';
import { 
  Waves as WavesIcon,
  ArrowForward as ArrowForwardIcon,
  DirectionsBoat as BoatIcon,
  SetMeal as FoodIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

// Distinct color palettes configured for each highlighted amenity feature card
const HIGHLIGHT_PALETTES = [
  {
    bgColor: '#e0f2fe',      // Soft Water Blue
    accentColor: '#0369a1',
    borderColor: 'rgba(3, 105, 161, 0.12)',
    glow: 'rgba(3, 105, 161, 0.06)'
  },
  {
    bgColor: '#f0fdf4',      // Palm Leaf Green
    accentColor: '#16a34a',
    borderColor: 'rgba(22, 163, 74, 0.12)',
    glow: 'rgba(22, 163, 74, 0.06)'
  },
  {
    bgColor: '#fefce8',      // Golden Warm Amber
    accentColor: '#ca8a04',
    borderColor: 'rgba(202, 138, 4, 0.12)',
    glow: 'rgba(202, 138, 4, 0.06)'
  }
];

export default function ExploreAlappuzhaBackwaters() {
  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 4 },
        width: { xs: '100%' }, 
        mx: 'auto',
        minHeight: '100vh'
      }}
    >
      {/* Elegant Header */}
      <Box sx={{ mb: 5, pb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
       <Avatar 
  sx={{ 
    bgcolor: '#0284c7', 
    width: 56, 
    height: 56,
    // Hide on mobile (xs) and tablet (sm), display on desktop layouts (md and up)
    display: { xs: 'none', md: 'flex' } 
  }}
>
  <WavesIcon sx={{ fontSize: 32 }} />
</Avatar>
        <Box>
          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800, letterSpacing: '-0.75px', mb: 0.5 }}>
            Explore Alappuzha Backwaters
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Immersive heritage cruises through Venice of the East&apos;s premium waterways.
          </Typography>
        </Box>
      </Box>

      {/* Main Widescreen Hero Showcase */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 5, 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
          overflow: 'hidden',
          mb: 4
        }}
      >
        {/* Banner with Premium Blue Gradient representing the serene waters */}
        <Box 
          sx={{ 
            height: { xs: 200, md: 320 }, 
            backgroundColor: '#0284c7', 
            backgroundImage: 'linear-gradient(to bottom right, #0369a1, #0284c7, #38bdf8)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#ffffff',
            flexDirection: 'column',
            p: 5,
            textAlign: 'center'
          }}
        >
          <Chip 
            label="FEATURED VISTA EXPERIENCE" 
            size="small" 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', fontWeight: 700,mt:2, mb: 2, letterSpacing: '1px' }} 
          />
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1px', mb: 1, fontSize: { xs: '1.75rem', md: '2.75rem' } }}>
            Vembanad Luxury Cruise Experience
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '600px', fontSize: { xs: '0.875rem', md: '1.1rem' } }}>
            Tranquil backwater pathways, traditional wood-crafted houseboats, and unparalleled golden hour landscapes right from the Alappuzha Beach Jetties.
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          
          {/* Dynamic Colorful Highlights Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: 'Premium Fleet',
                subtitle: 'Traditional wood-carved luxury',
                icon: <BoatIcon />,
                palette: HIGHLIGHT_PALETTES[0]
              },
              {
                title: 'Authentic Cuisines',
                subtitle: 'Freshly prepared local feasts',
                icon: <FoodIcon />,
                palette: HIGHLIGHT_PALETTES[1]
              },
              {
                title: 'Flexible Timelines',
                subtitle: 'Day cruises & overnight stays',
                icon: <TimeIcon />,
                palette: HIGHLIGHT_PALETTES[2]
              }
            ].map((card, idx) => (
              <Grid size={{ xs: 12, md: 3 }} key={idx}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    p: 1,
                    borderRadius: 4, 
                    bgcolor: card.palette.bgColor,
                    border: `1px solid ${card.palette.borderColor}`,
                    boxShadow: `0 8px 20px ${card.palette.glow}`,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 24px ${card.palette.glow}, 0 4px 10px rgba(0,0,0,0.02)`,
                    }
                  }}
                >
                  <CardContent sx={{ '&:last-child': { pb: 2 }, p: 1.5 }}>
                    <Stack 
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: '#ffffff', 
                          color: card.palette.accentColor, 
                          width: 44, 
                          height: 44,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          border: `1px solid ${card.palette.borderColor}`
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2, mb: 0.25 }}>
                          {card.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
                          {card.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Description Block */}
          <Typography variant="h5"color="text.primary" sx={{ fontWeight: 800, mb: 1.5 }}>
            The Ultimate Backwater Journey
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7, mb: 4 }}>
            Unwind as you drift down peaceful palm-fringed canals, vast open lakes, and quiet rural water-alleys. Our cruise offers a private retreat featuring full-service onboard crew teams, exquisite local traditional dining pairings, and spacious open-air sky decks carefully optimized to view Alappuzha&apos;s timeless aquatic culture in absolute comfort.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Action Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, letterSpacing: '0.5px' }}>
                EXPERIENCE RATE STARTS AT
              </Typography>
              <Stack 
                direction="row"
                sx={{ alignItems: 'baseline', gap: 0.5 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  ₹8,000
                </Typography>
                <Typography variant="body2" color="text.secondary">/ base price</Typography>
              </Stack>
            </Box>
            
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  bgcolor: '#0f172a', 
                  color: '#ffffff', 
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  '&:hover': { bgcolor: '#1e293b' },
                  textTransform: 'none',
                  boxShadow: '0 4px 6px -1px rgb(15 23 42 / 0.2)'
                }}
              >
                Back to Home
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}