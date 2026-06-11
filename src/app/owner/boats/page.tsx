'use client';
import React from 'react';
import { Container } from '@mui/material';
import BoatListTable from '@/components/BoatListTable';

export default function OwnerBoatsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BoatListTable allowedRole="BOAT_OWNER" />
    </Container>
  );
}