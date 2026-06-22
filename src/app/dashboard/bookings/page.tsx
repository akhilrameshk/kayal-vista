/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container,  Grid, Paper, Box, Typography, Stack, Tabs, Tab, 
  Avatar, Button, Card, CardContent, Chip, Divider, List, 
  ListItem, ListItemText, ListItemAvatar, TextField, CircularProgress, Alert
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import SecurityIcon from '@mui/icons-material/Security';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Profile state trackers tracking live parameters
  const [customerInfo, setCustomerInfo] = useState({ name: 'Guest', email: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load user info values saved locally during user onboarding sessions
  useEffect(() => {
    const savedName = localStorage.getItem('kayal_vista_user_name') || 'Guest Profile';
    const savedEmail = localStorage.getItem('kayal_vista_user_email') || 'your-email@example.com';
    const savedPhone = localStorage.getItem('kayal_vista_user_phone') || 'Not registered';

    setCustomerInfo({ name: savedName, email: savedEmail, phone: savedPhone });
  }, []);

  // Fetch reservations completely authorized via your new Bearer token workflow
  const loadCustomerReservations = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      const token = localStorage.getItem('kayal_vista_auth_token');
      if (!token) {
        setErrorMessage('Authentication session expired. Please sign in again.');
        setLoading(false);
        return;
      }

      // Hits the secure backend route without exposing the database ID in the URL structure
      const res = await fetch(`/api/customer/dashboard/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      
      const payload = await res.json();
      
      if (payload.success) {
        setBookings(payload.data || []);
      } else {
        setErrorMessage(payload.error || 'Failed to pull reservations records.');
      }
    } catch (err) {
      console.error("Dashboard data initialization failure:", err);
      setErrorMessage('Network connection breakdown targeting dashboard endpoints.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomerReservations();
  }, [loadCustomerReservations]);

  // Handle password modification updates securely over verification channels
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({ type: 'error', text: 'All operational credential fields are required.' });
      return;
    }

    try {
      const token = localStorage.getItem('kayal_vista_auth_token');
      if (!token) {
        setPasswordStatus({ type: 'error', text: 'Your authorization signature is missing. Please sign back in.' });
        return;
      }

      const res = await fetch('/api/customer/dashboard/update-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });
      const data = await res.json();
      
      if (data.success) {
        setPasswordStatus({ type: 'success', text: 'Password encrypted and saved safely!' });
        setPasswordForm({ currentPassword: '', newPassword: '' });
      } else {
        setPasswordStatus({ type: 'error', text: data.error || 'Failed to update user security keys.' });
      }
    } catch {
      setPasswordStatus({ type: 'error', text: 'Network failure communicating with authorization hub.' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      
      {/* SUMMARY BANNER */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: '16px', background: 'linear-gradient(135deg, #0d2c34 0%, #17424c 100%)', color: '#ffffff' }}>
        <Grid container spacing={3} >
          <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', alignItems: 'center' }}>
            <Stack direction="row" spacing={2.5} >
              <Avatar sx={{ width: 64, height: 64, bgcolor: '#00796b', fontSize: '1.4rem', fontWeight: 800, border: '3px solid rgba(255,255,255,0.2)' }}>
                {customerInfo.name ? customerInfo.name[0].toUpperCase() : 'U'}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>Hello, {customerInfo.name}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
                  Track your premium backwater reservations, modify access keys, and submit support tickets.
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: 'right' } }}>
            <Box sx={{ display: 'inline-block', p: 2, bgcolor: 'rgba(255,255,255,0.07)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: 0.5 }}>TOTAL CRUISE STAYS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#26a69a', mt: 0.5 }}>{bookings.length}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* NAVIGATION TABS CONNECTOR */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} textColor="primary" indicatorColor="primary" sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem' } }}>
          <Tab icon={<DirectionsBoatIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Booking List" />
          <Tab icon={<SecurityIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Profile" />
          <Tab icon={<ContactSupportIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Support Page" />
        </Tabs>
      </Box>

      {/* TAB PANEL 1: BOOKINGS LIST */}
      <CustomTabPanel value={activeTab} index={0}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#0d2c34' }}>Your Registered Itineraries</Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress color="primary" /></Box>
        ) : errorMessage ? (
          <Alert severity="error" sx={{ borderRadius: '8px' }}>{errorMessage}</Alert>
        ) : bookings.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: '12px', borderStyle: 'dashed' }}>
            <ConfirmationNumberIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>No reservations found</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>You haven&apos;t locked in any backwater cruise stays yet.</Typography>
          </Paper>
        ) : (
          <Stack spacing={2.5}>
            {bookings.map((item) => {
              const boatMeta = item.boatId || {};
              const travelDates = Array.isArray(item.travelDate) ? item.travelDate : [item.travelDate];
              
              return (
                <Card key={item._id} variant="outlined" sx={{ borderRadius: '12px', transition: '0.2s', '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.04)' } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} >
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0d2c34' }}>{boatMeta.name || boatMeta.title || item.boatName || 'Premium Vessel Stay'}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <DirectionsBoatIcon sx={{ fontSize: 14 }} /> Category: {boatMeta.type || boatMeta.category || 'Luxury Houseboat'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: { xs: 1, sm: 0 } }}>
                          <CalendarMonthIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>SCHEDULED WINDOW</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{travelDates.join(', ')}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>TOTAL COST</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#00796b' }}>₹{item.totalPrice?.toLocaleString('en-IN') || '0'}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 2 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Chip 
                          label={item.status || 'PENDING'} 
                          color={['COMPLETED', 'CONFIRMED', 'Paid', 'booked'].includes(item.status) ? 'success' : 'warning'} 
                          sx={{ fontWeight: 700, borderRadius: '6px', fontSize: '0.75rem' }} 
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </CustomTabPanel>

      {/* TAB PANEL 2: PROFILE PAGE */}
      <CustomTabPanel value={activeTab} index={1}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>Account Parameters</Typography>
              <Stack spacing={2.5}>
                <TextField fullWidth label="Full Operational Name" value={customerInfo.name} disabled variant="outlined" helperText="Linked automatically to booking identity configuration parameters." />
                <TextField fullWidth label="Primary Verification Email Address" value={customerInfo.email} disabled variant="outlined" />
                <TextField fullWidth label="Contact Registration Phone String" value={customerInfo.phone} disabled variant="outlined" />
              </Stack>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>Update Password Security</Typography>
              
              {passwordStatus && <Alert severity={passwordStatus.type} sx={{ mb: 2, borderRadius: '8px' }}>{passwordStatus.text}</Alert>}
              
              <Box component="form" onSubmit={handlePasswordUpdate}>
                <Stack spacing={2.5}>
                  <TextField fullWidth type="password" label="Temporary / Current Password" placeholder="Paste single string credential from signup email" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                  <TextField fullWidth type="password" label="Secure New Password String" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                  <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, py: 1.2, mt: 1 }}>
                    Save Updated Keys
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* TAB PANEL 3: SUPPORT PAGE */}
      <CustomTabPanel value={activeTab} index={2}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2.5 }}>Open an Assistance Ticket</Typography>
              <Stack spacing={2.5}>
                <TextField fullWidth label="Subject Reference" placeholder="Food configuration requirements, boarding time adjustments..." />
                <TextField fullWidth multiline rows={4} label="Detailed Request Description" placeholder="Explain your request context here..." />
                <Button variant="contained" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, width: 'fit-content', px: 4, py: 1 }}>
                  Submit Support Ticket
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Frequently Asked Inquiries</Typography>
            <List disablePadding>
              {[
                { q: 'Where are standard pick-up checkpoints located?', a: 'Vessels default anchor and onboarding nodes align directly at Punnamada Lake jetty points.' },
                { q: 'Can I shift scheduled check-in calendar windows?', a: 'Rescheduling requests entered 48 hours prior to onboarding incur zero penalty matrix deductions.' }
              ].map((faq, idx) => (
                <React.Fragment key={idx}>
                  <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 36 }}></ListItemAvatar>
                    <ListItemText 
                      primary={faq.q} 
                      secondary={faq.a} 
                      slotProps={{
                        primary: {
                          sx: { fontWeight: 700, fontSize: '0.88rem', mb: 0.5, color: '#0d2c34' }
                        },
                        secondary: {
                          sx: { fontSize: '0.82rem', lineHeight: 1.5 }
                        }
                      }}
                    />
                  </ListItem>
                  {idx === 0 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </CustomTabPanel>

    </Container>
  );
}