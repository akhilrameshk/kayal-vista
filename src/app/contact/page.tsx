'use client';
import React, { useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Stack,
  TextField, Button, useTheme, CircularProgress, Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

import { CheckCircle } from '@mui/icons-material';

export default function ContactPage() {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ py: 15, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Message Dispatched!</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you, {name}. Our operations support team has received your inquiry and will respond to {email} within 24 hours.
        </Typography>
        <Button variant="outlined" onClick={() => setSubmitted(false)} sx={{ borderRadius: 2 }}>
          Send Another Message
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 5, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Have questions about Kayal Vista? Reach out to our crew.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 4 }}>
          <Stack spacing={3}>
            {/* Port of Operations */}
            <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ bgcolor: 'rgba(0, 77, 64, 0.08)', p: 1.5, borderRadius: 2, color: 'primary.main', display: 'flex' }}>
                    <LocationOnIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>PORT OF OPERATIONS</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                     Stadium ward, Alappuzha, Kerala, 688001
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Updated Email */}
            <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ bgcolor: 'rgba(0, 77, 64, 0.08)', p: 1.5, borderRadius: 2, color: 'primary.main', display: 'flex' }}>
                    <EmailIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>EMAIL SUPPORT</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                      info@kayalvista.in
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Helpline */}
            <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Box sx={{ bgcolor: 'rgba(0, 77, 64, 0.08)', p: 1.5, borderRadius: 2, color: 'primary.main', display: 'flex' }}>
                    <PhoneInTalkIcon />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>HOTLINE ASSISTANCE</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                      9633134324 or 7012947953
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Form */}
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Send a Direct Message</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Drop us your details and our team will get back to you within 24 hours.
              </Typography>

              <Box component="form" onSubmit={handleMessageSubmit}>
                <Stack spacing={3}>
                  <TextField 
                    fullWidth required label="Full Name" 
                    value={name} onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                  />
                  <TextField 
                    fullWidth required type="email" label="Email Address" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                  />
                  <TextField 
                    fullWidth required multiline rows={4} label="Your Message Context" 
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    slotProps={{ input: { sx: { borderRadius: 3 } } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1rem' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Dispatch Message'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}