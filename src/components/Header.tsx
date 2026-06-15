/* eslint-disable react-hooks/set-state-in-effect */
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

// Navigation Configs
const PUBLIC_LINKS = [
  { label: 'Explore Vistas', path: '/explore-vista' },
  { label: 'Operator Portal', path: '/operator-portal' },
  { label: 'Our Story', path: '/our-story' },
  { label: 'Contact Crew', path: '/contact' }
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

interface HeaderProps {
  onToggleThemeMode?: () => void;
}

export default function Header({ onToggleThemeMode }: HeaderProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const activeToken = localStorage.getItem('kayal_vista_auth_token');
    const savedRole = localStorage.getItem('kayal_vista_user_role');
    const savedName = localStorage.getItem('kayal_vista_user_name');
    
    if (activeToken) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setUserName(savedName || 'User');
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserName('');
    }
  }, [pathname]);

  // Role-based Nav Logic
  const activeNavLinks = 
    userRole === 'SUPER_ADMIN' ? ADMIN_LINKS : 
    userRole === 'BOAT_OWNER' ? OWNER_LINKS : 
    PUBLIC_LINKS;

  const handleLogoutAction = () => {
    localStorage.removeItem('kayal_vista_auth_token');
    localStorage.removeItem('kayal_vista_user_role');
    localStorage.removeItem('kayal_vista_user_name');
    setIsAuthenticated(false);
    router.push('/');
  };

  const toggleDrawer = (open: boolean) => () => setMobileOpen(open);

  return (
    <Box component="header" sx={{ bgcolor: theme.palette.background.paper, borderBottom: '1px solid', borderColor: theme.palette.divider, position: 'sticky', top: 0, zIndex: 1100 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', height: 72, alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Link href={userRole === 'SUPER_ADMIN' ? '/admin/dashboard' : userRole === 'BOAT_OWNER' ? '/owner' : '/'} style={{ textDecoration: 'none' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <DirectionsBoatIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 900, color: theme.palette.text.primary, letterSpacing: -0.5 }}>
                KAYAL<span style={{ color: theme.palette.primary.main }}>VISTA</span>
                {userRole && (
                  <Box component="span" sx={{ fontSize: '10px', verticalAlign: 'super', ml: 0.5, bgcolor: userRole === 'SUPER_ADMIN' ? 'error.main' : 'primary.main', color: 'white', px: 0.8, py: 0.2, borderRadius: 1.5, fontWeight: 800 }}>
                    {userRole === 'SUPER_ADMIN' ? 'ADMIN' : 'OWNER'}
                  </Box>
                )}
              </Typography>
            </Stack>
          </Link>

          {/* Desktop Navigation */}
          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {activeNavLinks.map((link) => (
              <Button key={link.path} component={Link} href={link.path} sx={{ color: pathname === link.path ? 'primary.main' : 'text.secondary', fontWeight: pathname === link.path ? 800 : 600, textTransform: 'none', px: 2, borderRadius: 2 }}>
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Desktop Action Links */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}>
            <IconButton onClick={onToggleThemeMode}>{theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
            {isAuthenticated ? (
              <Button onClick={handleLogoutAction} color="error" startIcon={<LogoutIcon />}>Logout</Button>
            ) : (
              <Button variant="contained" component={Link} href="/login">Sign In</Button>
            )}
          </Stack>

          {/* Mobile Menu Icon Toggle */}
          <IconButton sx={{ display: { md: 'none' }, color: theme.palette.text.primary }} onClick={toggleDrawer(true)}><MenuIcon /></IconButton>
        </Box>
      </Container>

      {/* Mobile Drawer Slide-out menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: theme.palette.background.paper }} role="presentation">
          
          {/* User Profile Info Section */}
          {isAuthenticated && (
            <Box sx={{ p: 3, bgcolor: theme.palette.action.hover }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <AccountCircleIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: theme.palette.text.primary, lineHeight: 1.2 }}>
                    {userName}
                  </Typography>
                  {userRole && (
                    <Typography variant="caption" color="theme.palette.text.secondary" sx={{ fontWeight: 600, textTransform: 'lowercase', color: theme.palette.text.secondary }}>
                      {userRole.replace('_', ' ')}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          )}

          {/* Interactive Utility Section (Theme Toggle) */}
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, pl: 1 }}>
              {theme.palette.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Typography>
            <IconButton onClick={onToggleThemeMode} sx={{ color: theme.palette.text.primary }}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: theme.palette.divider }} />

          {/* Navigation Links list */}
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

          {/* Authenticated Actions Footer (Login / Logout) */}
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