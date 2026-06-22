'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Stack,
   Grid,
  Divider,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import VerifiedShieldIcon from '@mui/icons-material/VerifiedUser';

interface RefundPolicyPopupProps {
  open: boolean;
  onClose: () => void;
  boatName?: string;
}

const POLICIES = [
  { label: '0-3 Days Left', value: '20% Return', color: '#d32f2f', desc: 'Cancellations made within 3 days of departure are eligible for a 20% refund.' },
  { label: '4-7 Days Left', value: '50% Return', color: '#f57c00', desc: 'Cancellations made between 4 to 7 days of departure receive a half refund.' },
  { label: '8-10 Days Left', value: '80% Return', color: '#0288d1', desc: 'Cancellations made between 8 to 10 days of departure receive an 80% refund.' },
  { label: 'Above 10 Days', value: '100% Return', color: '#2e7d32', desc: 'Enjoy full flexibility with a 100% complete refund protection timeline.' }
];

export default function RefundPolicyPopup({ open, onClose, boatName }: RefundPolicyPopupProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* Header Container Area */}
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <AssignmentReturnIcon sx={{ color: '#00796b' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 0.5 }}>
              Cancellation & Refund Policy
            </Typography>
            {boatName && (
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Applicable for: {boatName}
              </Typography>
            )}
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Core Percentage Matrix Grid Layout */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {POLICIES.map((policy, idx) => (
            <Grid size={{ xs: 6 }} key={idx}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                 
                  borderLeft: `4px solid ${policy.color}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  height: '100%'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {policy.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: policy.color }}>
                  {policy.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Text Explanations */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600,  mb: 1.5 }}>
          Detailed Breakdown Terms:
        </Typography>
        <Stack spacing={2}>
          {POLICIES.map((policy, idx) => (
            <Stack key={idx} direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: policy.color, mt: 0.75, flexShrink: 0 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {policy.label} Split Matrix
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {policy.desc}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>

        {/* Informational Guarantee Footer Note */}
        <Box sx={{ display: 'flex', gap: 1.5, p: 2, mt: 3,  borderRadius: '8px' }}>
          <VerifiedShieldIcon sx={{  fontSize: 20, mt: 0.2 }} />
          <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
            All processing processing timelines map natively onto base reservation time matrices. Refunds are auto-credited back to source payments channels within 5-7 business operational days.
          </Typography>
        </Box>
      </DialogContent>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: '#00796b', borderRadius: '8px', px: 3, '&:hover': { bgcolor: '#004d40' } }}>
          Got It
        </Button>
      </Box>
    </Dialog>
  );
}