/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Stack, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function DetailsModal({ open, handleClose, boat }: any) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = boat.images && boat.images.length > 0 ? boat.images : ['/default-placeholder.jpg'];
console.log('Boat details for modal:', images);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [open, images.length]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {boat.name}
        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ height: 250, bgcolor: 'grey.200', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '90%', height: 200, mx: 'auto', borderRadius: 3, overflow: 'hidden', mb: 2, bgcolor: 'grey.200' }}>
          <Box component="img" src={boat?.images?.[currentIdx]} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
        </Box>
        
        <Typography variant="h6">Hosted by: {boat.ownerName}</Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 700 }}>Included Features:</Typography>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {(boat.features || []).map((f: string) => <Chip key={f} label={f} />)}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}