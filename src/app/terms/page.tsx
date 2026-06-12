import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Review the booking rules, cancellation protocols, and service policies for houseboats at Kayal Vista.',
  alternates: { canonical: '/terms' },
};

export default function TermsAndConditions() {
  const lastUpdated = "June 12, 2026";

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
          Terms & Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Last Updated: {lastUpdated}
        </Typography>
        
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              1. Scope of Agreement
            </Typography>
            <Typography variant="body1" color="text.secondary" >
              By accessing the Kayal Vista platform and booking local houseboat cruises, you agree to comply with and be bound by these Terms and Conditions. These terms apply directly to all users, guests, and vessel operators navigating our platform tools.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              2. Booking and Cancellation Policies
            </Typography>
            <Typography variant="body1" color="text.secondary" >
              Reservations are verified and officially logged when the baseline deposit or total price is cleared through the API gateway. Cancellations, structural date modifications, or capacity revisions are evaluated based on individual operator policies and regional conditions on the day of the journey.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              3. Guest Conduct and Vessel Safety
            </Typography>
            <Typography variant="body1" color="text.secondary" >
              All guests must strictly follow security guidelines outlined by the onboard crew during the cruise. Operators retain the right to suspend or adjust navigation routes if unexpected weather conditions, safety indicators, or local regulatory notices threaten the safety of the vessel or occupants.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1.5 }}>
              4. Liability Limitations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Kayal Vista serves as a specialized booking interface connecting customers with independent houseboat services. We maintain no responsibility or active liability for physical losses, operational delays, or trip structural variations caused by external factors or environmental forces beyond platform scope.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}