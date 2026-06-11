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
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

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
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -0.5 }}>
                KAYAL<span style={{ color: theme.palette.primary.main }}>VISTA</span>
                {userRole && (
                  <Box component="span" sx={{ fontSize: '10px', verticalAlign: 'super', ml: 0.5, bgcolor: userRole === 'SUPER_ADMIN' ? 'error.main' : 'primary.main', color: 'white', px: 0.8, py: 0.2, borderRadius: 1.5, fontWeight: 800 }}>
                    {userRole === 'SUPER_ADMIN' ? 'ADMIN' : 'OWNER'}
                  </Box>
                )}
              </Typography>
            </Stack>
          </Link>

          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {activeNavLinks.map((link) => (
              <Button key={link.path} component={Link} href={link.path} sx={{ color: pathname === link.path ? 'primary.main' : 'text.secondary', fontWeight: pathname === link.path ? 800 : 600, textTransform: 'none', px: 2, borderRadius: 2 }}>
                {link.label}
              </Button>
            ))}
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', display: { xs: 'none', md: 'flex' } }}>
            <IconButton onClick={onToggleThemeMode}>{theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
            {isAuthenticated ? (
              <Button onClick={handleLogoutAction} color="error" startIcon={<LogoutIcon />}>Logout</Button>
            ) : (
              <Button variant="contained" component={Link} href="/login">Sign In</Button>
            )}
          </Stack>

          <IconButton sx={{ display: { md: 'none' } }} onClick={toggleDrawer(true)}><MenuIcon /></IconButton>
        </Box>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 260, pt: 3 }} onClick={toggleDrawer(false)}>
          <List>
            {activeNavLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton component={Link} href={link.path} selected={pathname === link.path}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}