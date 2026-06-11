'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Avatar,
  Stack,
  Button,
  IconButton
} from '@mui/material';
import { 
  DirectionsBoat as BoatIcon, 
  AutoGraph as AnalyticsIcon, 
  Speed as PerformanceIcon,
  SupportAgent as OperationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Payments as RevenueIcon,
  Star as PremiumIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

export default function OperatorPortalShowcase() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // General Theme Sync Configurations
  const themeBg = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const mainText = darkMode ? '#f8fafc' : '#0f172a';
  const subText = darkMode ? '#94a3b8' : '#475569';
  const borderStroke = darkMode ? '#334155' : '#e2e8f0';

  // 1. Upper Matrix - Card Specific Dynamic Gradients
  const yieldGradient = darkMode
    ? 'linear-gradient(to bottom right, #1e293b, #0f172a, #0369a1)'
    : 'linear-gradient(to bottom right, #0ea5e9, #0284c7, #0369a1)';

  const routeGradient = darkMode
    ? 'linear-gradient(to bottom right, #1e293b, #0f172a, #15803d)'
    : 'linear-gradient(to bottom right, #22c55e, #16a34a, #15803d)';

  const linkGradient = darkMode
    ? 'linear-gradient(to bottom right, #1e293b, #0f172a, #b45309)'
    : 'linear-gradient(to bottom right, #f97316, #ea580c, #c2410c)';

  // 2. Lower Infrastructure - Section Parent Gradient
  const infraParentGradient = darkMode
    ? 'linear-gradient(to bottom right, #1e293b, #0f172a, #3b0764)'
    : 'linear-gradient(to bottom right, #faf5ff, #f3e8ff, #e9d5ff)';

  // 3. Lower Infrastructure - Feature Check Cards Gradients
  const terminalCheckGradient = darkMode
    ? 'linear-gradient(to bottom right, #1e293b, rgba(15, 23, 42, 0.8))'
    : 'linear-gradient(to bottom right, #ffffff, rgba(255, 255, 255, 0.7))';

  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 4 },
        width: { xs: '100%', md: '85%', lg: '75%' }, 
        mx: 'auto',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Header Layout Component */}
      <Box 
        sx={{ 
          mb: 5, 
          borderBottom: `1px solid ${borderStroke}`, 
          pb: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <Box>
          <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>
              Kayal Vista
            </Typography>
            <Chip 
              label="OPERATOR HUB" 
              size="small" 
              sx={{ bgcolor: '#0284c7', color: '#ffffff', fontWeight: 800, borderRadius: '6px', fontSize: '0.7rem' }} 
            />
          </Stack>
          <Typography variant="body1" sx={{ color: subText }}>
            Next-generation fleet automation and backwater logistics synchronization network.
          </Typography>
        </Box>
        
       
      </Box>

      {/* Hero Value Banner Panel */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 5, 
          border: `1px solid ${borderStroke}`, 
          backgroundImage: darkMode 
            ? 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f766e)' 
            : 'linear-gradient(to bottom right, #0d9488, #0f766e, #115e59)',
          color: '#ffffff',
          overflow: 'hidden',
          mb: 5,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
        }}
      >
        <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
            <Chip 
              icon={<PremiumIcon sx={{ '&&': { color: '#f59e0b' } }} />} 
              label="PARTNER ENGINE PRO" 
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 700, mb: 2 }} 
            />
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-1.5px', fontSize: { xs: '2rem', md: '3rem' } }}>
              Maximize Fleet Yield. Simplify Bookings.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
              Connect traditional premium houseboats, shikaras, and luxury vessels directly to global travelers through an immersive, lightning-fast coordination dashboard.
            </Typography>
            <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={() => router.push('/login')}
                sx={{ bgcolor: '#ffffff', color: '#0f766e', fontWeight: 700, px: 4, py: 1.5, borderRadius: '12px', '&:hover': { bgcolor: '#f8fafc' }, textTransform: 'none' }}
              >
                Register Your Vessel
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => router.push('/our-story')}
                sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)', fontWeight: 600, px: 4, py: 1.5, borderRadius: '12px', '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)' }, textTransform: 'none' }}
              >
                Our Story
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Feature Architecture Matrix */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        
        {/* Yield Index Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', borderRadius: 4, border: `1px solid ${borderStroke}`, 
              backgroundImage: yieldGradient,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
              transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent sx={{ p: 3, color: '#ffffff' }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', mb: 2, width: 48, height: 48 }}>
                <AnalyticsIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                Real-Time Yield Index
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Automated seasonal price balancing variables adjust dynamically across demand spikes, local regional festivals, and holiday windows.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Route Dispatch Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', borderRadius: 4, border: `1px solid ${borderStroke}`, 
              backgroundImage: routeGradient,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
              transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent sx={{ p: 3, color: '#ffffff' }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', mb: 2, width: 48, height: 48 }}>
                <PerformanceIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                Smart Route Dispatch
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Pre-calculate custom water corridors, harbor clearing windows, and optimal staging configurations near popular beach cruise terminals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Crew Link Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', borderRadius: 4, border: `1px solid ${borderStroke}`, 
              backgroundImage: linkGradient,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
              transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardContent sx={{ p: 3, color: '#ffffff' }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', mb: 2, width: 48, height: 48 }}>
                <OperationsIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', mb: 1 }}>
                Crew Communication Link
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Maintain immediate direct contact capabilities with captains and catering coordinators instantly inside coordinated system channels.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* NEW: Fully Stylized Premium Infrastructure Parent Container */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          borderRadius: 4, 
          border: `1px solid ${borderStroke}`, 
          backgroundImage: infraParentGradient,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
          transition: 'background-image 0.3s ease'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 900, color: mainText, mb: 4, letterSpacing: '-0.5px' }}>
          Platform Infrastructure Core Capabilities
        </Typography>
        
        <Grid container spacing={4}>
          {/* Left Sub-Column: Dynamic Interactive Checklist Layout Cards */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              <Card 
                elevation={0} 
                sx={{ 
                  p: 2.5, borderRadius: 3, 
                  border: `1px solid ${borderStroke}`,
                  backgroundImage: terminalCheckGradient,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)'
                }}
              >
                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
                  <CheckIcon sx={{ color: '#0284c7', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: mainText }}>
                      Instant Verification Terminals
                    </Typography>
                    <Typography variant="body2" sx={{ color: subText, mt: 0.5, lineHeight: 1.5 }}>
                      Parse secure client routing details and digital confirmations instantly at terminal staging platforms.
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              <Card 
                elevation={0} 
                sx={{ 
                  p: 2.5, borderRadius: 3, 
                  border: `1px solid ${borderStroke}`,
                  backgroundImage: terminalCheckGradient,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.02)'
                }}
              >
                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
                  <CheckIcon sx={{ color: '#0284c7', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: mainText }}>
                      Automated Escrow Settlements
                    </Typography>
                    <Typography variant="body2" sx={{ color: subText, mt: 0.5, lineHeight: 1.5 }}>
                      Transparent financial ledger processing records individual vessel metrics and payouts directly to registered banking lines.
                    </Typography>
                  </Box>
                </Stack>
              </Card>

            </Stack>
          </Grid>

          {/* Right Sub-Column: High Contrast Glassmorphism Simulation Block */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box 
              sx={{ 
                p: 3, borderRadius: 3, 
                border: `1px dashed ${borderStroke}`,
                backdropFilter: 'blur(8px)',
                backgroundImage: darkMode 
                  ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8))' 
                  : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6))'
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: mainText, mb: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Simulated Operational Metas
              </Typography>
              
              <Grid container spacing={2}>
                {/* Active Vessels Card - Deep Teal Base Gradient */}
                <Grid size={{ xs: 6 }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      p: 2.5, textAlign: 'center', borderRadius: 2.5, border: `1px solid ${borderStroke}`,
                      backgroundImage: darkMode 
                        ? 'linear-gradient(to bottom right, #0f172a, #0f766e)' 
                        : 'linear-gradient(to bottom right, #0d9488, #0f766e)',
                      boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.2)'
                    }}
                  >
                    <BoatIcon sx={{ color: '#ffffff', mb: 0.5, fontSize: '1.8rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>450+</Typography>
                    <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.85, fontWeight: 700 }}>Active Vessels</Typography>
                  </Card>
                </Grid>
                
                {/* Payout Accuracy Card - Deep Royal Blue Base Gradient */}
                <Grid size={{ xs: 6 }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      p: 2.5, textAlign: 'center', borderRadius: 2.5, border: `1px solid ${borderStroke}`,
                      backgroundImage: darkMode 
                        ? 'linear-gradient(to bottom right, #0f172a, #1d4ed8)' 
                        : 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
                      boxShadow: '0 10px 15px -3px rgba(29, 78, 216, 0.2)'
                    }}
                  >
                    <RevenueIcon sx={{ color: '#ffffff', mb: 0.5, fontSize: '1.8rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>99.4%</Typography>
                    <Typography variant="caption" sx={{ color: '#ffffff', opacity: 0.85, fontWeight: 700 }}>Payout Accuracy</Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
}