'use client';
import React from 'react';
import { Container } from '@mui/material';
import BoatListTable from '@/components/BoatListTable';

export default function AdminBoatsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BoatListTable allowedRole="SUPER_ADMIN" />
    </Container>
  );
}