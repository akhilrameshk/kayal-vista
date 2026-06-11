'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  useTheme,
  Grid
} from '@mui/material';
import AnchorIcon from '@mui/icons-material/Anchor';
import MapIcon from '@mui/icons-material/Map';
import SecurityIcon from '@mui/icons-material/Security';

// Distinct color configurations for the core value cards
const CARD_PALETTES = [
  {
    iconBg: 'rgba(2, 132, 199, 0.15)',
    iconColor: '#0284c7',
    // Soft blue tint background gradient
    cardBg:'#0284c7',
    glow: 'rgba(2, 132, 199, 0.1)',
    hoverBorder: 'rgba(2, 132, 199, 0.5)'
  },
  {
    iconBg: 'rgba(13, 148, 136, 0.15)',
    iconColor: '#0d9488',
    // Soft teal tint background gradient
    cardBg:'#0d9488',
    glow: 'rgba(13, 148, 136, 0.1)',
    hoverBorder: 'rgba(13, 148, 136, 0.5)'
  },
  {
    iconBg: 'rgba(217, 119, 6, 0.15)',
    iconColor: '#d97706',
    // Soft sunset gold tint background gradient
    cardBg:"#d97706",
    glow: 'rgba(217, 119, 6, 0.1)',
    hoverBorder: 'rgba(217, 119, 6, 0.5)'
  }
];

export default function AboutPage() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Abstract background decorative color blobs for top-tier premium depth */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-5%', 
          width: '500px', 
          height: '500px', 
          borderRadius: '50%', 
          background: isLight ? 'radial-gradient(circle, rgba(2,132,199,0.06) 0%, rgba(255,255,255,0) 70%)' : 'radial-gradient(circle, rgba(2,132,199,0.15) 0%, rgba(15,23,42,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        
        {/* ================= HERO TITLE SECTION ================= */}
        <Box sx={{ mb: 8, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 900, 
              color: 'text.primary', 
              mb: 2,
              letterSpacing: '-1.5px',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Our <Box component="span" sx={{ color: 'primary.main', background: 'linear-gradient(120deg, #0284c7, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Story</Box>
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500, 
              maxWidth: '750px', 
              lineHeight: 1.6,
              fontSize: { xs: '1.05rem', md: '1.25rem' }
            }}
          >
            We bridge the gap between discerning travelers and elite fleet operators, crafting seamless voyages across the historic backwaters of Alappuzha.
          </Typography>
        </Box>

        {/* ================= MISSION STATEMENT BOX ================= */}
        <Box 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: "20px", 
            background: isLight 
              ? 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' 
              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: isLight ? '0px 20px 40px rgba(2, 132, 199, 0.04)' : '0px 20px 40px rgba(0, 0, 0, 0.25)',
            border: '1px solid',
            borderColor: isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(255, 255, 255, 0.05)',
            mb: 8,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative side accent highlight accent line strip */}
          <Box 
            sx={{ 
              position: 'absolute', 
              left: 0, 
              top: 0, 
              bottom: 0, 
              width: '6px', 
              background: 'linear-gradient(to bottom, #0284c7, #38bdf8)' 
            }} 
          />

          <Typography variant="h4" sx={{ fontWeight: 850, color: 'text.primary', mb: 3, letterSpacing: '-0.5px' }}>
            Driven by Authentic Heritage
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.8, mb: 3 }}>
            Born from a deep love for Kerala&apos;s iconic kaayals (lakes) and canals, our platform is designed to preserve local heritage while introducing cutting-edge booking luxury. We curate only verified cruise opportunities, ensuring every traveler finds their perfect vantage point safely and transparently.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
            By working hand-in-hand with licensed local operators, we maintain high standards of safety, traditional craftsmanship, and premium hospitality while simplifying the discovery process.
          </Typography>
        </Box>

        {/* ================= CORE VALUES SECTION ================= */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 850, 
              mb: 1, 
              color: 'text.primary', 
              letterSpacing: '-0.5px',
              textAlign: { xs: 'center', md: 'left' } 
            }}
          >
            Our Founding Principles
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}
          >
            The values backing every single backwater dynamic launch arrangement.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Value Card 1 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 5, 
                 bgcolor: CARD_PALETTES[0].iconBg,
                border: '1px solid', 
                borderColor: 'divider',
                height: '100%',
                boxShadow: `0 10px 30px rgba(0,0,0,0.01)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: CARD_PALETTES[0].hoverBorder,
                  boxShadow: `0 20px 35px ${CARD_PALETTES[0].glow}, 0 4px 12px rgba(0,0,0,0.03)`
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2.5}>
                  <Box 
                    sx={{ 
                      bgcolor: CARD_PALETTES[0].iconBg, 
                      p: 1.75, 
                      borderRadius: 3, 
                      color: CARD_PALETTES[0].iconColor, 
                      display: 'flex', 
                      width: 'fit-content',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
                    }}
                  >
                    <AnchorIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Rooted Locally
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.925rem' }}>
                    Every cruise option is deeply vetted by operators who understand the unique geography and waters of Vembanad Lake.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Value Card 2 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 5, 
                bgcolor: CARD_PALETTES[1].iconBg,
                border: '1px solid', 
                borderColor: 'divider',
                height: '100%',
                boxShadow: `0 10px 30px rgba(0,0,0,0.01)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: CARD_PALETTES[1].hoverBorder,
                  boxShadow: `0 20px 35px ${CARD_PALETTES[1].glow}, 0 4px 12px rgba(0,0,0,0.03)`
                }
              }}
            >
              <CardContent sx={{ p: 4 }} >
                <Stack spacing={2.5}>
                  <Box 
                    sx={{ 
                      bgcolor: CARD_PALETTES[1].iconBg, 
                      p: 1.75, 
                      borderRadius: 3, 
                      color: CARD_PALETTES[1].iconColor, 
                      display: 'flex', 
                      width: 'fit-content',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
                    }}
                  >
                    <MapIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Vantage Optimization
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.925rem' }}>
                    We map out route assets specifically designed for golden hours, wide open breezes, and iconic landscape viewing.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Value Card 3 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 5, 
               bgcolor: CARD_PALETTES[2].iconBg,
                border: '1px solid', 
                borderColor: 'divider',
                height: '100%',
                boxShadow: `0 10px 30px rgba(0,0,0,0.01)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: CARD_PALETTES[2].hoverBorder,
                  boxShadow: `0 20px 35px ${CARD_PALETTES[2].glow}, 0 4px 12px rgba(0,0,0,0.03)`
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2.5}>
                  <Box 
                    sx={{ 
                      bgcolor: CARD_PALETTES[2].iconBg, 
                      p: 1.75, 
                      borderRadius: 3, 
                      color: CARD_PALETTES[2].iconColor, 
                      display: 'flex', 
                      width: 'fit-content',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.01)'
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Strict Quality Care
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.925rem' }}>
                    No hidden operational surprises. Transparent pricing structures and completely verified boat configurations.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}