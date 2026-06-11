/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, Link as MuiLink, Grid, useTheme } from '@mui/material';
import Link from 'next/link';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function Footer() {
  const theme = useTheme();
  const [userRole, setUserRole] = useState<string | null>(null);
  const isLight = theme.palette.mode === 'light';

  // Detect user role to show context-relevant footer links
  useEffect(() => {
    const role = localStorage.getItem('kayal_vista_user_role');
    setUserRole(role);
  }, []);

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        pt: 8, 
        pb: 5,
        mt: 'auto', 
        borderTop: '1px solid', 
        borderColor: 'divider' 
      }}
    >
      <Container maxWidth="lg">
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
              alignItems: 'center'
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textAlign: 'center' }}>
              © {new Date().getFullYear()} KayalVista Operations. All rights reserved. Handcrafted Backwater Experiences.
            </Typography>
          </Box>

        </Stack>
      </Container>
    </Box>
  );
}