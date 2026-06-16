// app/components/FloatingActionButtons.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Fab, Zoom, Tooltip, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Import the new Chatbot component layout
import ChatbotDrawer from './ChatbotDrawer';

interface FloatingActionButtonsProps {
  onToggleThemeMode?: () => void;
}

export default function FloatingActionButtons({ onToggleThemeMode }: FloatingActionButtonsProps) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [isLowerHalf, setIsLowerHalf] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScrollTracking = () => {
      const scrolled = window.scrollY;
      const totalScrollablePageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrolled > totalScrollablePageHeight / 2) {
        setIsLowerHalf(true);
      } else {
        setIsLowerHalf(false);
      }
    };
    window.addEventListener('scroll', handleScrollTracking);
    return () => window.removeEventListener('scroll', handleScrollTracking);
  }, []);

  const handleToggleMenu = () => setIsOpen((prev) => !prev);

  const handleAutoScrollAction = () => {
    if (isLowerHalf) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919633134324?text=hi%20%2C%0Ai%20would%20like%20to%20heare%20%20more%20about%20your%20service', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 24, sm: 24 }, // Kept neat and clear at 24px since sticky navigation bar is removed
          right: 24,
          zIndex: theme.zIndex.speedDial,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* WhatsApp Button */}
        <Zoom in={isOpen} timeout={500}>
          <Tooltip title="Chat on WhatsApp" placement="left" arrow>
            <Fab size="medium" onClick={handleWhatsAppClick} sx={{ bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#128C7E' } }}>
              <WhatsAppIcon />
            </Fab>
          </Tooltip>
        </Zoom>

        {/* Chatbot Action Button */}
        <Zoom in={isOpen} timeout={400}>
          <Tooltip title="AI Crew Support" placement="left" arrow>
            <Fab size="medium" onClick={() => setChatOpen(true)} color="primary">
              <SmartToyIcon />
            </Fab>
          </Tooltip>
        </Zoom>

        {/* Dark / Light Palette Mode Switcher Button */}
        <Zoom in={isOpen} timeout={300}>
          <Tooltip title={theme.palette.mode === 'dark' ? "Activate Light UI" : "Activate Dark UI"} placement="left" arrow>
            <Fab size="medium" color='success' onClick={onToggleThemeMode} sx={{   border: '1px solid', borderColor: 'divider' }}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </Fab>
          </Tooltip>
        </Zoom>

        {/* Scroll Toggle */}
        <Zoom in={isOpen} timeout={200}>
          <Tooltip title={isLowerHalf ? "Scroll to Top" : "Scroll to Bottom"} placement="left" arrow>
            <Fab size="medium" onClick={handleAutoScrollAction} color="info">
              {isLowerHalf ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </Fab>
          </Tooltip>
        </Zoom>

        {/* Menu Expand Toggle */}
        <Tooltip title={isOpen ? "Collapse Actions" : "Expand Actions"} placement="left" arrow>
          <Fab color="secondary" size="medium" onClick={handleToggleMenu} sx={{  color: theme.palette.text.primary, border: '1px solid', borderColor: 'divider' }}>
            {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </Fab>
        </Tooltip>
      </Box>

      {/* RENDER DRAWER ELEMENT */}
      <ChatbotDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}