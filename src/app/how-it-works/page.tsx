
"use client";
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Divider, 
  useTheme 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';
export default function HowItWorks() {
  const router = useRouter();
  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      
      {/* 1. HERO SECTION */}
      <Box 
        sx={{ 
          bgcolor: '#0f1e1c', // Deep dark teal/charcoal matching premium dark headers
          color: '#ffffff', 
          py: { xs: 8, md: 12 }, 
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="overline" 
            sx={{ color: '#14b8a6', fontWeight: 'bold', letterSpacing: 2 }}
          >
            Kayal Vista Marketplace
          </Typography>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ fontWeight: 800, mt: 1, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}
          >
            How It Works
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ color: '#94a3b8', fontWeight: 400, lineHeight: 1.6, maxWwidth: '700px', mx: 'auto' }}
          >
            We’ve reimagined the way you plan a water getaway. We bring the region&apos;s 
            finest independent boat operators together on a single platform, giving you 
            marketplace variety backed by platform-level reliability.
          </Typography>
        </Container>
      </Box>

      {/* 2. THE 3-STEP JOURNEY FOR TRAVELERS */}
      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} >
          
          {/* Step 1 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)', borderRadius: 4, p: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 60, height: 60, bgcolor: '#e0f2f1', color: '#004d40', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <SearchIcon fontSize="large" />
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2,  }}>
                  1. Search & Filter
                </Typography>
                <Typography variant="body2"  sx={{ lineHeight: 1.7 }}>
                  Input your travel dates, guest count, and specific preferences. Whether you need an ultra-premium luxury cruiser with a private chef or a budget-friendly traditional family getaway, find it in seconds.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Step 2 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)', borderRadius: 4, p: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 60, height: 60, bgcolor: '#e0f2f1', color: '#004d40', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <CompareArrowsIcon fontSize="large" />
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, }}>
                  2. Compare Operators
                </Typography>
                <Typography variant="body2"  sx={{ lineHeight: 1.7 }}>
                  Browse unedited, high-resolution galleries of every boat. Compare real-time pricing side-by-side without hidden agent markups, and read verified reviews from travelers who have actually stepped on board.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Step 3 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)', borderRadius: 4, p: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 60, height: 60, bgcolor: '#004d40', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                  <DirectionsBoatIcon fontSize="large" />
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  3. Sail Securely
                </Typography>
                <Typography variant="body2"  sx={{ lineHeight: 1.7 }}>
                  Lock in your booking instantly via our secure gateway. Receive a digital boarding pass featuring your precise dock coordinates and captain&apos;s details, backed by standard safety protocols all the way.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>

      {/* 3. THE TRUST & QUALITY PROMISE */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 800,  mb: 1 }}>
            The Kayal Vista Promise
          </Typography>
          <Typography variant="body1"  sx={{ lineHeight: 1.7 }}>
            Why travelers prefer booking cruises through our unified network.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={2} sx={{ p: 1 , boxShadow: '30px rgba(0,0,0,0.05)', borderRadius: 2,borderColor: 'divider', borderWidth: 1, borderStyle: 'solid'  }}>
              <VerifiedUserIcon sx={{ color: '#14b8a6', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Verified Fleet Partners
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Every operator undergoes a strict 20-point quality checklist covering navigation equipment, safety gear, engine health, and crew licensing.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={2} sx={{ p: 1 , boxShadow: '30px rgba(0,0,0,0.05)', borderRadius: 2,borderColor: 'divider', borderWidth: 1, borderStyle: 'solid'  }}>
              <LocalOfferIcon sx={{ color: '#14b8a6', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Best Price Guarantee
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  We work directly with captains to remove middlemen commissions. The price you see is the lowest available—no sudden docking or fuel surcharges.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={2} sx={{ p: 1 , boxShadow: '30px rgba(0,0,0,0.05)', borderRadius: 2,borderColor: 'divider', borderWidth: 1, borderStyle: 'solid'  }}>
              <AccountBalanceWalletIcon sx={{ color: '#14b8a6', mt: 0.5 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Secure Escrow Payments
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Your deposit is securely held by our platform and only released to the operator after your cruise begins safely, protecting you against last-minute cancellations.
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* 4. OPERATOR DUAL CALL-TO-ACTION BANNER */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box 
          sx={{ 
            bgcolor: '#e0f2f1', 
            borderRadius: 6, 
            p: { xs: 4, md: 6 }, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center', 
            justifyContent: 'between',
            gap: 4,
            boxShadow: '0px 10px 20px rgba(0, 77, 64, 0.03)'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 800, color: '#004d40', mb: 1 }}>
              Are you a Houseboat Owner or Fleet Operator?
            </Typography>
            <Typography variant="body2" sx={{ color: '#00796b', lineHeight: 1.6 }}>
              Digitize your calendar, automate your billing routes, and effortlessly fill empty mid-week slots by listing your assets on the region’s premier integrated cruise network.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Button 
              variant="contained" 
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                bgcolor: '#004d40', 
                color: '#ffffff', 
                fontWeight: 600, 
                px: 4, 
                py: 1.5,
                borderRadius: 3,
                '&:hover': { bgcolor: '#0f1e1c' },
                whiteSpace: 'nowrap'
              }}
              onClick={() => router.push('/login')}
            >
              Join as a Partner
            </Button>
          </Stack>
        </Box>
      </Container>

    </Box>
  );
}