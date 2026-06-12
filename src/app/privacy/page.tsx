import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Kayal Vista collects, uses, and safeguards your personal information and transaction data.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicy() {
  const lastUpdated = "June 12, 2026";

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last Updated: {lastUpdated}
        </Typography>
        
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              1. Information We Collect
            </Typography>
            <Typography variant="body1" color="text.secondary" >
              When you reserve a houseboat on Kayal Vista, we collect information necessary to process your booking. This includes your name, contact details (email address and phone number), and any special requirements or preferences you submit during the reservation cycle.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              2. How We Use Your Information
            </Typography>
            <Typography variant="body1" color="text.secondary" >
              Your personal information is used primarily to manage availability, confirm reservations, secure payment verifications, and communicate important updates regarding your cruise on the Kerala backwaters. We also utilize aggregated data to evaluate platform health and maintain infrastructure security.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              3. Data Security and Retention
            </Typography>
            <Typography variant="body1" color="text.secondary" >
              We implement industry-standard administrative and technological parameters to prevent unauthorized exposure or access to your profile data. Payment processing handles financial tokens through verified secure gateways; Kayal Vista does not store direct raw banking or credit card details on its servers.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              4. Contact Information
            </Typography>
            <Typography variant="body1" color="text.secondary">
              If you have any questions or concerns regarding our privacy configurations, data removal tracking, or general account handling, please reach out to our administration team at <strong>support@kayalvista.com</strong>.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}