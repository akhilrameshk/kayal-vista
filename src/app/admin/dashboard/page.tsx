/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

export default function AdminDashboard() {
  const theme = useTheme();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Structural path access guard verification
  useEffect(() => {
    const token = localStorage.getItem('kayal_vista_auth_token');
    const role = localStorage.getItem('kayal_vista_user_role');

    if (!token || role !== 'SUPER_ADMIN') {
      // Force non-admin signatures out of backend paths immediately
      router.push('/login');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Quick statistics cards layout configuration mockup
  const STATS_CARDS = [
    { title: 'Total Registered Users', count: '142', icon: <PeopleAltIcon fontSize="large" color="primary" /> },
    { title: 'Active Fleet Boats', count: '38', icon: <DirectionsBoatIcon fontSize="large" color="primary" /> },
    { title: 'Pending Cruise Bookings', count: '12', icon: <BookOnlineIcon fontSize="large" color="primary" /> },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '85vh', py: 6 }}>
      <Container maxWidth="lg">
        
        {/* DASHBOARD HEADER IDENTIFIER */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 5 }}>
          <Box sx={{ bgcolor: 'rgba(0, 77, 64, 0.08)', p: 1.5, borderRadius: 3, display: 'flex', color: 'primary.main' }}>
            <DashboardIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -0.5 }}>
              Control Console
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, Master Administrator. Managing system metrics across collections.
            </Typography>
          </Box>
        </Stack>

        {/* METRICS COUNT Grid */}
      {/* METRICS COUNT GRID - CASTED TO TEMPORARILY BYPASS STRICT OVERLOADS */}
<Grid container spacing={3} sx={{ mb: 4 }}>
  {STATS_CARDS.map((stat, index) => {
    const LegacyGridItem = Grid as any; // Type-casting the classic Grid element
    return (
      <LegacyGridItem item xs={12} sm={4} key={index}>
        <Card 
          sx={{ 
            borderRadius: 4, 
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: 'none',
            background: theme.palette.background.paper
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mt: 1 }}>
                  {stat.count}
                </Typography>
              </Box>
              <Box sx={{ opacity: 0.85 }}>
                {stat.icon}
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </LegacyGridItem>
    );
  })}
</Grid>

        {/* WORKSPACE CONTENT AREA PLACEHOLDER */}
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: theme.palette.divider, boxShadow: 'none' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
              Operational Overview Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Select options from the top navigation bar to configure database rows directly inside the active cluster.
            </Typography>
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
}