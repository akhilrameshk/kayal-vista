/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  useTheme
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface DBUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  contactDetails: string;
  role: 'SUPER_ADMIN' | 'BOAT_OWNER' | 'NORMAL_USER';
  createdAt: string;
}

export default function AdminUsersDirectory() {
  const theme = useTheme();
  const router = useRouter();
  
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('kayal_vista_auth_token');
    const role = localStorage.getItem('kayal_vista_user_role');

    if (!token || role !== 'SUPER_ADMIN') {
      router.push('/login');
      return;
    }

    async function loadRegisteredUsers() {
      try {
        const response = await fetch('/api/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': token || ''
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load system users.');
        }

        setUsers(data.users);
      } catch (err: any) {
        setErrorBanner(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRegisteredUsers();
  }, [router]);

  // Color mapper helper for role badges
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Chip label="Super Admin" color="error" size="small" sx={{ fontWeight: 700 }} />;
      case 'BOAT_OWNER':
        return <Chip label="Boat Owner" color="primary" size="small" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label="Traveler" color="default" size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '85vh', py: 6 }}>
      <Container maxWidth="lg">

        {/* PROFILE SUB-HEADER SYSTEM */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 5 }}>
          <Box sx={{ bgcolor: 'rgba(0, 77, 64, 0.08)', p: 1.5, borderRadius: 3, display: 'flex', color: 'primary.main' }}>
            <PeopleAltIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -0.5 }}>
              User Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage registered system entities within the active <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>kayalvista</span> database.
            </Typography>
          </Box>
        </Stack>

        {errorBanner && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
            {errorBanner}
          </Alert>
        )}

        {/* USERS DATA COLLECTION TABLE */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 4, 
            boxShadow: 'none', 
            border: '1px solid', 
            borderColor: theme.palette.divider,
            background: theme.palette.background.paper,
            overflow: 'hidden'
          }}
        >
          <Table aria-label="database users table layout">
            <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 77, 64, 0.02)' : 'rgba(255,255,255,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>Contact Details</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>System Role</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>Registered Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No registered user accounts found inside the database instance.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow 
                    key={user._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{user.fullName}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{user.username}</TableCell>
                    <TableCell color="text.primary">{user.email}</TableCell>
                    <TableCell color="text.primary">{user.contactDetails}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </Box>
  );
}