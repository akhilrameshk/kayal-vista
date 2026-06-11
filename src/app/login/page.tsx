/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Alert,
  InputAdornment,
  MenuItem,
  useTheme,
  Tab,
  Tabs,
  CircularProgress,
  IconButton
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PeopleIcon from '@mui/icons-material/People';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { executePortalLogin } from '@/utils/auth';

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();

  // Screen View Toggle: 0 = Sign In View, 1 = Registration View
  const [activeTab, setActiveTab] = useState(0);

  // Common Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Password Visibility State Channel
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration-Specific Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [registerRole, setRegisterRole] = useState<'BOAT_OWNER' | 'NORMAL_USER'>('NORMAL_USER');

  // UI Feedback Banners
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Dynamic Loader Hook State
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setFeedbackError(null);
    setFeedbackSuccess(null);
    setShowPassword(false); // Reset visibility state when switching tabs
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // 1. SIGN IN FLOW (Super Admin check + Registered Users check)

// 1. DYNAMIC API SIGN IN HANDLER
const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFeedbackError(null);
  setFeedbackSuccess(null);
  setIsLoading(true);

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Authentication rejected.');

    localStorage.setItem('kayal_vista_auth_token', data.token);
    localStorage.setItem('kayal_vista_user_role', data.user.role);
    localStorage.setItem('kayal_vista_user_name', data.user.name);

    setFeedbackSuccess(`Session verified successfully! Routing dashboard properties...`);
   // console.log("Login successful, user data:", data.user);
      router.push(data.user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/owner');
  } catch (err: any) {
    setFeedbackError(err.message);
    setIsLoading(false);
  }
};

// 2. DYNAMIC API ACCESSED REGISTRATION HANDLER
const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFeedbackError(null);
  setFeedbackSuccess(null);
  setIsLoading(true);

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        username,
        password,
        fullName,
        email,
        contactDetails,
        role: registerRole
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Registration rejected.');

    localStorage.setItem('kayal_vista_auth_token', data.token);
    localStorage.setItem('kayal_vista_user_role', data.user.role);
    localStorage.setItem('kayal_vista_user_name', data.user.name);

    setFeedbackSuccess(`Profile built cleanly! Injecting session access vectors...`);
   router.push(data.user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/owner');
  } catch (err: any) {
    setFeedbackError(err.message);
    setIsLoading(false);
  }
};

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '85vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="sm">
        
        {/* BRAND SYSTEM ICONOGRAPHY BAR */}
        <Stack sx={{ alignItems: 'center', mb: 3 }} spacing={1}>
          <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', color: 'white', display: 'flex', boxShadow: '0 4px 14px rgba(0,77,64,0.15)' }}>
            <DirectionsBoatIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -0.5 }}>
            {activeTab === 0 ? 'Gateway Console' : 'Register Profile'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: '420px' }}>
            {activeTab === 0 
              ? 'Authorized dashboard interface for system admins, registered operators, and verified travelers.' 
              : 'Create a dedicated account block to unlock platform access features across backwater marketplaces.'}
          </Typography>
        </Stack>

        <Card 
          sx={{ 
            borderRadius: 4, 
            boxShadow: theme.palette.mode === 'light' ? '0px 8px 32px rgba(0,77,64,0.03)' : 'none',
            border: '1px solid',
            borderColor: theme.palette.divider
          }}
        >
          {/* CONTROL TAB TRIPPERS FOR INTUITIVE USER ROUTING */}
       <Tabs 
  value={activeTab} 
  onChange={handleTabChange} 
  variant="fullWidth"
  textColor="primary"
  indicatorColor="primary"
  sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
>
            <Tab label="Sign In" sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }} />
            <Tab label="Register Account" sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }} />
          </Tabs>

          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            
            {/* ALERT MANAGEMENT NODES */}
            {feedbackError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>{feedbackError}</Alert>}
            {feedbackSuccess && <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>{feedbackSuccess}</Alert>}

            {/* ================= FORM VIEW 1: DYNAMIC PORTAL LOGIN ================= */}
            {activeTab === 0 && (
              <Box component="form" onSubmit={handleLoginSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    required
                    disabled={isLoading}
                    label="Username Handle"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin or your custom handle"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    disabled={isLoading}
                    type={showPassword ? 'text' : 'password'}
                    label="Security Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ color: 'primary.main', mr: 0.5 }}
                            >
                              {!showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1rem' }}
                  >
                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Open Authorized Session'}
                  </Button>
                </Stack>
              </Box>
            )}

            {/* ================= FORM VIEW 2: ACCOUNT REGISTRATION ================= */}
            {activeTab === 1 && (
              <Box component="form" onSubmit={handleRegisterSubmit}>
                <Stack spacing={2.5}>
                  
                  {/* Account Classification Assignment Dropdown */}
                  <TextField
                    fullWidth
                    select
                    disabled={isLoading}
                    label="Account Tier Classification"
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value as 'BOAT_OWNER' | 'NORMAL_USER')}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PeopleIcon sx={{ color: 'primary.main', mr: 0.5 }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  >
                    <MenuItem value="NORMAL_USER">Standard Traveler / Guest User</MenuItem>
                    <MenuItem value="BOAT_OWNER">Verified Fleet Operator / Boat Owner</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    required
                    disabled={isLoading}
                    label="Full Legal Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Akhil Kumar"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    disabled={isLoading}
                    label="Create Custom Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Unique username signature"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    disabled={isLoading}
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    disabled={isLoading}
                    label="Primary Contact Numbers"
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                    placeholder="e.g., +91 XXXXX XXXXX"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    disabled={isLoading}
                    type={showPassword ? 'text' : 'password'}
                    label="Secure Login Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create security sequence"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ color: 'primary.main', mr: 0.5 }}
                            >
                              {!showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1rem', mt: 1 }}
                  >
                    {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register Infrastructure Record'}
                  </Button>
                </Stack>
              </Box>
            )}

          </CardContent>
        </Card>
        
      </Container>
    </Box>
  );
}