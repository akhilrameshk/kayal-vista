/* eslint-disable react-hooks/set-state-in-effect */
// app/components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  useTheme,
  Divider,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Navigation Configs
const PUBLIC_LINKS = [
  { label: 'How it works', path: '/how-it-works' },
  { label: 'Partner With Us', path: '/operator-portal' },
  { label: 'Our Story', path: '/our-story' },
  { label: 'Contact Us' , path: '/contact' }
];

const ADMIN_LINKS = [
  { label: 'Availability', path: '/admin/availability' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Boat List', path: '/admin/boats' },
  { label: 'Booking List', path: '/bookings' }
];

const OWNER_LINKS = [
  { label: 'Dashboard', path: '/owner' },
  { label: 'My Fleet', path: '/owner/boats' },
  { label: 'Booking List', path: '/bookings' }
];

// New dynamic array matching your specifications for standard customers
const CUSTOMER_LINKS = [
  { label: 'Booking List', path: '/dashboard/bookings' },
  { label: 'Profile Settings', path: '/dashboard/profile' },
  { label: 'Support Desk', path: '/support' }
];

export default function Header() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Anchor target state for handling the desktop avatar menu toggle matrix
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const activeToken = localStorage.getItem('kayal_vista_auth_token');
    const savedRole = localStorage.getItem('kayal_vista_user_role');
    const savedName = localStorage.getItem('kayal_vista_user_name');
    const savedEmail = localStorage.getItem('kayal_vista_user_email'); // Safe-check verification email tracker
    
    if (activeToken) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setUserName(savedName || 'User');
      setUserEmail(savedEmail || '');
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName('');
      setUserEmail('');
    }
  }, [pathname]);

  // Role-based Dynamic Nav Selection Router Pipeline
  const activeNavLinks = 
    userRole === 'SUPER_ADMIN' ? ADMIN_LINKS : 
    userRole === 'BOAT_OWNER' ? OWNER_LINKS : 
    userRole === 'NORMAL_USER' ? CUSTOMER_LINKS : 
    PUBLIC_LINKS;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutAction = () => {
    localStorage.removeItem('kayal_vista_auth_token');
    localStorage.removeItem('kayal_vista_user_role');
    localStorage.removeItem('kayal_vista_user_name');
    localStorage.removeItem('kayal_vista_user_email');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    handleMenuClose();
    router.push('/');
  };

  const toggleDrawer = (open: boolean) => () => setMobileOpen(open);

  return (
    <Box component="header" sx={{ bgcolor: theme.palette.background.paper, borderBottom: '1px solid', borderColor: theme.palette.divider, position: 'sticky', top: 0, zIndex: 1100 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', height: 72, alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* LOGO LINK WITH REDIRECT ROUTING BALANCERS */}
          <Link href={userRole === 'SUPER_ADMIN' ? '/admin/dashboard' : userRole === 'BOAT_OWNER' ? '/owner' : userRole === 'NORMAL_USER' ? '/dashboard/bookings' : '/'} style={{ textDecoration: 'none' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <DirectionsBoatIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 900, color: theme.palette.text.primary, letterSpacing: -0.5 }}>
                KAYAL<span style={{ color: theme.palette.primary.main }}>VISTA</span>
                {userRole && (
                  <Box 
                    component="span" 
                    sx={{ 
                      fontSize: '10px', 
                      verticalAlign: 'super', 
                      ml: 0.5, 
                      bgcolor: userRole === 'SUPER_ADMIN' ? 'error.main' : userRole === 'BOAT_OWNER' ? 'primary.main' : '#00796b', 
                      color: 'white', 
                      px: 0.8, 
                      py: 0.2, 
                      borderRadius: 1.5, 
                      fontWeight: 800 
                    }}
                  >
                    {userRole === 'SUPER_ADMIN' ? 'ADMIN' : userRole === 'BOAT_OWNER' ? 'OWNER' : 'GUEST'}
                  </Box>
                )}
              </Typography>
            </Stack>
          </Link>

          {/* Desktop Navigation Links */}
          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {activeNavLinks.map((link) => (
              <Button key={link.path} component={Link} href={link.path} sx={{ color: pathname === link.path ? 'primary.main' : 'text.secondary', fontWeight: pathname === link.path ? 800 : 600, textTransform: 'none', px: 2, borderRadius: 2 }}>
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Desktop Auth Section with Menu Dropdown */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, border: '2px solid', borderColor: theme.palette.primary.main, ml: 1 }}>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: theme.palette.primary.main, fontSize: '0.85rem', fontWeight: 700 }}>
                    {userName ? userName[0].toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  slotProps={{ paper: { sx: { mt: 1.5, minWidth: 200, borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' } } }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{userName}</Typography>
                    {userEmail && <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{userEmail}</Typography>}
                  </Box>
                  <Divider />
                  
                  {userRole === 'NORMAL_USER' && (
                    <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/bookings'); }}>
                      <DashboardIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} /> My Dashboard
                    </MenuItem>
                  )}
                  
                  <MenuItem onClick={handleLogoutAction} sx={{ color: theme.palette.error.main, fontWeight: 600 }}>
                    <LogoutIcon sx={{ fontSize: 18, mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="contained" component={Link} href="/login" startIcon={<LoginIcon />} sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>
                Sign In
              </Button>
            )}
          </Stack>

          {/* Mobile Menu Toggle button */}
          <IconButton sx={{ display: { md: 'none' }, color: theme.palette.text.primary }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Container>

      {/* Mobile Side Drawer Navigation Menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: theme.palette.background.paper }} role="presentation">
          
          {/* User Meta Data Block inside Drawer viewport */}
          {isAuthenticated && (
            <Box sx={{ p: 3, bgcolor: theme.palette.action.hover }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <AccountCircleIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: theme.palette.text.primary, lineHeight: 1.2 }}>
                    {userName}
                  </Typography>
                  {userRole && (
                    <Typography variant="caption" sx={{ fontWeight: 700, color: userRole === 'NORMAL_USER' ? '#00796b' : 'text.secondary', textTransform: 'capitalize' }}>
                      {userRole.toLowerCase().replace('_', ' ')}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          )}

          <Divider sx={{ borderColor: theme.palette.divider }} />

          {/* Dynamic Link Mapping loop inside drawer */}
          <List sx={{ flexGrow: 1, pt: 1 }} onClick={toggleDrawer(false)}>
            {activeNavLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton component={Link} href={link.path} selected={pathname === link.path}>
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: pathname === link.path ? 800 : 600,
                          color: pathname === link.path ? theme.palette.primary.main : theme.palette.text.primary
                        }}
                      >
                        {link.label}
                      </Typography>
                    } 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ borderColor: theme.palette.divider }} />

          {/* Action Trigger Sticky bottom box footer */}
          <Box sx={{ p: 2 }} onClick={toggleDrawer(false)}>
            {isAuthenticated ? (
              <Button 
                fullWidth 
                variant="outlined" 
                color="error" 
                startIcon={<LogoutIcon />} 
                onClick={handleLogoutAction}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
              >
                Logout Account
              </Button>
            ) : (
              <Button 
                fullWidth 
                variant="contained" 
                component={Link} 
                href="/login"
                startIcon={<LoginIcon />}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
              >
                Sign In
              </Button>
            )}
          </Box>

        </Box>
      </Drawer>
    </Box>
  );
}