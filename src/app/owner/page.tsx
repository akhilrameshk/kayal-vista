/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Button,
  Alert,
  useTheme,
  Grid
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import HandymanIcon from '@mui/icons-material/Handyman';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface OwnerStats {
  totalBoats: number;
  activeBoats: number;
  maintenanceBoats: number;
  estimatedDailyCapacity: number;
}

export default function BoatOwnerDashboard() {
  const theme = useTheme();
  const router = useRouter();
  
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [operatorName, setOperatorName] = useState('Operator');

  useEffect(() => {
    const token = localStorage.getItem('kayal_vista_auth_token');
    const role = localStorage.getItem('kayal_vista_user_role');
    const savedName = localStorage.getItem('kayal_vista_user_name');

    if (!token || role !== 'BOAT_OWNER') {
      router.push('/login');
      return;
    }

    if (savedName) setOperatorName(savedName);

   async function fetchOwnerStats() {
  try {
    const response = await fetch('/api/owner/stats', {
      method: 'GET',
      // Providing a fallback string ensures TypeScript accepts the type safely
      headers: { 'Authorization': token || '' } 
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Failed to pull operational data.');
    setStats(data.statistics);
  } catch (err: any) {
    setErrorBanner(err.message);
  } finally { // Fixed the typo from 'dry' to 'finally'
    setLoading(false);
  }
}

    fetchOwnerStats();
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Define layout structures for type safety using traditional Grid tags
  const LegacyGridItem = Grid as any;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '85vh', py: 6 }}>
      <Container maxWidth="lg">

        {/* WELCOME BANNER HEADER */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 5 }}>
          <Box sx={{ bgcolor: 'rgba(0, 77, 64, 0.08)', p: 1.5, borderRadius: 3, display: 'flex', color: 'primary.main' }}>
            <DashboardIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -0.5 }}>
              Vessel Control Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Logged in as: <strong>{operatorName}</strong>. Tracking live backwater operational streams.
            </Typography>
          </Box>
        </Stack>

        {errorBanner && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>{errorBanner}</Alert>}

        {/* METRICS VISUALIZATION CARD GRID */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 5 }}>
            
            <LegacyGridItem item xs={12} sm={4}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: theme.palette.divider, boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>Total Fleet Size</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>{stats.totalBoats}</Typography>
                    </Box>
                    <DirectionsBoatIcon fontSize="large" color="primary" sx={{ opacity: 0.8 }} />
                  </Stack>
                </CardContent>
              </Card>
            </LegacyGridItem>

            <LegacyGridItem item xs={12} sm={4}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: theme.palette.divider, boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>Active / Ready Hulls</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: 'success.main', mt: 1 }}>{stats.activeBoats}</Typography>
                    </Box>
                    <DirectionsBoatIcon fontSize="large" color="success" sx={{ opacity: 0.8 }} />
                  </Stack>
                </CardContent>
              </Card>
            </LegacyGridItem>

            <LegacyGridItem item xs={12} sm={4}>
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: theme.palette.divider, boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>Under Maintenance</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: 'warning.main', mt: 1 }}>{stats.maintenanceBoats}</Typography>
                    </Box>
                    <HandymanIcon fontSize="large" color="warning" sx={{ opacity: 0.8 }} />
                  </Stack>
                </CardContent>
              </Card>
            </LegacyGridItem>

          </Grid>
        )}

        {/* ACTION PANEL CARD LINK */}
        <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: theme.palette.divider, boxShadow: 'none', background: theme.palette.background.paper }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Manage Fleet Inventory Details
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Add new entries, adjust baseline tariff price books, or change cruise visibility flags inside your personal catalog.
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/owner/boats"
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 2.5, fontWeight: 700, textTransform: 'none', px: 3, py: 1.2, whiteSpace: 'nowrap' }}
              >
                Go to My Boats
              </Button>
            </Stack>
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
}