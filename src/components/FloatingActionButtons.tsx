'use client';

import React, { useState, useEffect } from 'react';
import { Box, Fab, Zoom, Tooltip, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // Customer care headset icon
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

  // Base transition system for crisp hover scaling
  const baseFabStyle = {
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1) translateY(-2px)',
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 40, sm: 40, md: 24 },
          right: 24,
          zIndex: theme.zIndex.speedDial,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          pb: { xs: 7, sm: 7, md: 3 },
        }}
      >
        {/* 1. WhatsApp Button (Green Glow) */}
        <Zoom in={isOpen} timeout={500}>
          <Tooltip title="Chat on WhatsApp" placement="left" arrow>
            <Fab 
              size="medium" 
              onClick={handleWhatsAppClick} 
              sx={{ 
                ...baseFabStyle,
                bgcolor: '#25D366', 
                color: '#fff', 
                animation: 'whatsappGlow 2.5s infinite ease-in-out',
                '&:hover': { 
                  bgcolor: '#128C7E',
                  transform: 'scale(1.1) translateY(-2px)',
                  boxShadow: '0 0 20px 5px rgba(37, 211, 102, 0.6)'
                },
                '@keyframes whatsappGlow': {
                  '0%, 100%': { boxShadow: '0 0 8px 1px rgba(37, 211, 102, 0.3)' },
                  '50%': { boxShadow: '0 0 16px 4px rgba(37, 211, 102, 0.6)' }
                }
              }}
            >
              <WhatsAppIcon />
            </Fab>
          </Tooltip>
        </Zoom>

        {/* 2. Customer Care Assistant Button (Ocean Teal Glow) */}
        <Zoom in={isOpen} timeout={400}>
          <Tooltip title="Chat with Support" placement="left" arrow>
            <Fab 
              size="medium" 
              onClick={() => setChatOpen(true)} 
              sx={{ 
                ...baseFabStyle,
                bgcolor: '#008080', 
                color: '#fff', 
                animation: 'supportGlow 2.5s infinite ease-in-out',
                '&:hover': { 
                  bgcolor: '#004d40',
                  transform: 'scale(1.1) translateY(-2px)',
                  boxShadow: '0 0 20px 5px rgba(0, 128, 128, 0.6)'
                },
                '@keyframes supportGlow': {
                  '0%, 100%': { boxShadow: '0 0 8px 1px rgba(0, 128, 128, 0.3)' },
                  '50%': { boxShadow: '0 0 16px 4px rgba(0, 128, 128, 0.6)' }
                }
              }}
            >
              <SupportAgentIcon />
            </Fab>
          </Tooltip>
        </Zoom>

        {/* 3. Dark / Light Palette Mode Switcher Button (Green Glow) */}
        <Zoom in={isOpen} timeout={300}>
          <Tooltip title={theme.palette.mode === 'dark' ? "Activate Light UI" : "Activate Dark UI"} placement="left" arrow>
            <Fab 
              size="medium" 
              color="success" 
              onClick={onToggleThemeMode} 
              sx={{ 
                ...baseFabStyle,
                border: '1px solid', 
                borderColor: 'divider',
                animation: 'themeGlow 2.5s infinite ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1) translateY(-2px)',
                  boxShadow: '0 0 20px 5px rgba(76, 175, 80, 0.5)'
                },
                '@keyframes themeGlow': {
                  '0%, 100%': { boxShadow: '0 0 6px 1px rgba(76, 175, 80, 0.2)' },
                  '50%': { boxShadow: '0 0 14px 4px rgba(76, 175, 80, 0.5)' }
                }
              }}
            >
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </Fab>
          </Tooltip>
        </Zoom>

        {/* 4. Scroll Toggle (Blue/Info Glow) */}
        <Zoom in={isOpen} timeout={200}>
          <Tooltip title={isLowerHalf ? "Scroll to Top" : "Scroll to Bottom"} placement="left" arrow>
            <Fab 
              size="medium" 
              onClick={handleAutoScrollAction} 
              color="info"
              sx={{
                ...baseFabStyle,
                animation: 'scrollGlow 2.5s infinite ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1) translateY(-2px)',
                  boxShadow: '0 0 20px 5px rgba(2, 136, 209, 0.5)'
                },
                '@keyframes scrollGlow': {
                  '0%, 100%': { boxShadow: '0 0 6px 1px rgba(2, 136, 209, 0.2)' },
                  '50%': { boxShadow: '0 0 14px 4px rgba(2, 136, 209, 0.5)' }
                }
              }}
            >
              {isLowerHalf ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </Fab>
          </Tooltip>
        </Zoom>

        {/* 5. Menu Expand Toggle (Purple/Secondary Glow) */}
        <Tooltip title={isOpen ? "Collapse Actions" : "Expand Actions"} placement="left" arrow>
          <Fab 
            color="secondary" 
            size="medium" 
            onClick={handleToggleMenu} 
            sx={{ 
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              color: theme.palette.text.primary, 
              border: '1px solid', 
              borderColor: 'divider',
              animation: 'menuGlow 2s infinite ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 18px 4px rgba(156, 39, 176, 0.5)'
              },
              '@keyframes menuGlow': {
                '0%, 100%': { boxShadow: '0 0 8px 1px rgba(156, 39, 176, 0.2)' },
                '50%': { boxShadow: '0 0 16px 6px rgba(156, 39, 176, 0.4)' }
              }
            }}
          >
            {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </Fab>
        </Tooltip>
      </Box>

      {/* RENDER DRAWER ELEMENT */}
      <ChatbotDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}