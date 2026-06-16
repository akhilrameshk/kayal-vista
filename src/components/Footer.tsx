/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Link as MuiLink, Grid, useTheme, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

// Material-UI Icon Matrix
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function Footer() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const isLight = theme.palette.mode === 'light';

  // Detect user role to show context-relevant footer links safely on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('kayal_vista_user_role');
      setUserRole(role);
    }
  }, []);

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        pt: 8, 
        pb: { xs: 12, sm: 5 }, // Adaptive padding padding on mobile to clear the sticky menu bar
        mt: 'auto', 
        borderTop: '1px solid', 
        borderColor: 'divider' 
      }}
    >
      <Container maxWidth="lg" sx={{  display: { xs: 'none', sm: 'none',md:"block" },}}>
        <Stack spacing={1}>
        
          {/* ROW 1: MAIN SITE NAVIGATION DIRECTORY (4-COLUMN BALANCED ALIGNMENT) */}
          <Grid container spacing={4} sx={{ pb: 4, borderBottom: '1px solid', borderColor: 'rgba(0, 0, 0, 0.04)' }}>
            
            {/* COLUMN 1: DYNAMIC NAVIGATION LINKS */}
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
                {userRole === 'BOAT_OWNER' ? 'Owner Portal' : userRole === 'SUPER_ADMIN' ? 'Management' : 'Features'}
              </Typography>
              <Stack direction="column" spacing={1.5}>
                {userRole === 'BOAT_OWNER' ? (
                  <>
                    <MuiLink component={Link} href="/owner" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Dashboard</MuiLink>
                    <MuiLink component={Link} href="/owner/boats" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>My Fleet</MuiLink>
                  </>
                ) : userRole === 'SUPER_ADMIN' ? (
                  <MuiLink component={Link} href="/admin/dashboard" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Admin Console</MuiLink>
                ) : (
                  <>
                    <MuiLink component={Link} href="/explore-vista" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Explore Vistas</MuiLink>
                    <MuiLink component={Link} href="/operator-portal" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Operator Portal</MuiLink>
                  </>
                )}
              </Stack>
            </Grid>

            {/* COLUMN 2: LEGAL & SAFETY */}
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
                Legal & Safety
              </Typography>
              <Stack direction="column" spacing={1.5}>
                <MuiLink component={Link} href="/privacy" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Privacy Policy</MuiLink>
                <MuiLink component={Link} href="/terms" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Terms of Service</MuiLink>
              </Stack>
            </Grid>

            {/* COLUMN 3: VINTAGE / HERITAGE METRICS */}
            <Grid size={{ xs: 12, sm: 4, md: 4 }}>
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700, mb: 2 }}>
                Our Heritage
              </Typography>
              <Stack direction="column" spacing={1.5}>
                <MuiLink component={Link} href="/our-story" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Our Story</MuiLink>
                <MuiLink component={Link} href="/contact" color="text.secondary" underline="hover" sx={{ fontSize: '0.875rem' }}>Contact Us</MuiLink>
              </Stack>
            </Grid>

          </Grid>

          {/* ROW 2: BOTTOM METADATA BAR (CENTERED COPYRIGHT MESSAGE) */}
          <Box 
            sx={{ 
              borderTop: '1px solid', 
              borderColor: 'rgba(0, 0, 0, 0.06)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              pt: 2
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textAlign: 'center' }}>
              © {new Date().getFullYear()} KayalVista Operations. All rights reserved. Handcrafted Backwater Experiences.
            </Typography>
          </Box>

        </Stack>
      </Container>

      {/* MOBILE PERSISTENT STICKY BOTTOM NAVIGATION BAR */}
      <Paper 
        elevation={4} 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: theme.zIndex.appBar,
          display: { xs: 'block', sm: 'none' }, // Constrained exclusively to mobile screens
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundImage: 'none'
        }}
      >
        <BottomNavigation
          showLabels
          value={pathname}
          onChange={(event, newValue) => {
            router.push(newValue);
          }}
          sx={{ bgcolor: 'background.paper' }}
        >
          {/* Action 1: Persistent Platform Home Base */}
          <BottomNavigationAction 
            label="Home" 
            value="/" 
            icon={<HomeIcon />} 
          />

          {/* Action 2: Core Context Link / Discover Module */}
          {userRole === 'BOAT_OWNER' ? (
            <BottomNavigationAction 
              label="Dashboard" 
              value="/owner" 
              icon={<DashboardIcon />} 
            />
          ) : userRole === 'SUPER_ADMIN' ? (
            <BottomNavigationAction 
              label="Admin" 
              value="/admin/dashboard" 
              icon={<AdminPanelSettingsIcon />} 
            />
          ) : (
            <BottomNavigationAction 
              label="Explore" 
              value="/explore-vista" 
              icon={<ExploreIcon />} 
            />
          )}

          {/* Action 3: Secondary Context Link / Fleet Management */}
          {userRole === 'BOAT_OWNER' ? (
            <BottomNavigationAction 
              label="My Fleet" 
              value="/owner/boats" 
              icon={<DirectionsBoatIcon />} 
            />
          ) : (
            <BottomNavigationAction 
              label="Our Story" 
              value="/our-story" 
              icon={<HistoryEduIcon />} 
            />
          )}

          {/* Action 4: Persistent Customer Support Hub */}
          <BottomNavigationAction 
            label="Contact Us" 
            value="/contact" 
            icon={<SupportAgentIcon />} 
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}