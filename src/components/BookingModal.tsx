/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, RadioGroup,
  FormControlLabel, Radio, Button, Divider,
  Alert, Stack, IconButton, MenuItem, Grid, Paper,
  CircularProgress, Backdrop
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { CheckCircle } from '@mui/icons-material';

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const initialCustomer = { name: '', email: '', phone: '' };

export default function BookingModal({ open, handleClose, boat }: any) {
  const [bookingType, setBookingType] = useState('ROOM');
  const [tripType, setTripType] = useState('DAY');
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [customer, setCustomer] = useState(initialCustomer);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Added processing/loading state

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const resetAll = () => {
    setBookingType('ROOM');
    setTripType('DAY');
    setQuantity(1);
    setSelectedDate(dayjs());
    setCustomer(initialCustomer);
    setIsSuccess(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setIsProcessing(false);
    }
  }, [open]);

  const onClose = () => {
    // Prevent modal from closing while payment processing is ongoing
    if (isProcessing) return;
    resetAll();
    handleClose();
  };

  const priceData = useMemo(() => {
    if (!boat) return { base: 0, platform: 99, gst: 0, total: 0, isWeekend: false };

    const isWeekend = selectedDate?.day() === 0 || selectedDate?.day() === 6;
    let baseRate = boat.basePrice || 0;

    if (isWeekend) baseRate *= 1.3;
    if (tripType === 'DAY_NIGHT') baseRate *= 1.25;

    const base =
      bookingType === 'ROOM'
        ? baseRate
        : baseRate + Math.max(0, quantity - 4) * 600;

    const platform = 99;
    const gst = (base + platform) * 0.05;
    const total = base + platform + gst;

    return { base, platform, gst, total, isWeekend };
  }, [quantity, bookingType, tripType, boat, selectedDate]);

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: priceData.total })
      });

      const { orderId } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(priceData.total * 100),
        currency: "INR",
        order_id: orderId,
        name: "Kayal Vista",
        handler: async (response: any) => {
          // Trigger loading screen immediately after a successful payment authorization
          setIsProcessing(true);
          try {
            await fetch('/api/bookings/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                boatId: boat?._id,
                boatName: boat?.name,
                customer,
                totalPrice: priceData.total,
                travelDate: selectedDate?.format('DD-MM-YYYY'),
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                status: 'COMPLETED'
              })
            });
            setIsSuccess(true);
          } catch (saveError) {
            console.error("Failed to save booking:", saveError);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      (window as any).Razorpay(options).open();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: 520 },
        bgcolor: 'background.paper',
        borderRadius: "10px",
        boxShadow: 24,
        overflow: 'hidden',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* LOADING BACKDROP (SCOPED WITHIN MODAL CONTAINER) */}
        <Backdrop
          open={isProcessing}
          sx={{
            position: 'absolute',
            color: '#fff',
            zIndex: (theme) => theme.zIndex.modal + 1,
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'rgba(15, 23, 42, 0.7)'
          }}
        >
          <CircularProgress color="primary" size={50} thickness={4.5} />
          <Typography sx={{ fontWeight: 600, fontSize: 15, letterSpacing: '0.3px' }}>
            Securing Your Booking...
          </Typography>
        </Backdrop>

        {/* HEADER */}
        <Box sx={{
          p: 2,
          background: 'linear-gradient(135deg,#0ea5e9,#2563eb)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontWeight: 700 }}>
            {boat?.name || 'Booking'}
          </Typography>

          <IconButton onClick={onClose} sx={{ color: '#fff' }} disabled={isProcessing}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* BODY */}
        <Box sx={{ p: 2, overflowY: 'auto' }}>

          {isSuccess ? (
            <Stack spacing={2} sx={{ py: 3, alignItems: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 60 }} />

              <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                Booking Confirmed
              </Typography>

              <Typography sx={{ fontSize: 13 }}>
                Hi <b>{customer.name}</b>, your trip is confirmed.
              </Typography>

              <Button fullWidth variant="contained" onClick={onClose}>
                Done
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>

              {/* DATE FULL WIDTH */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Travel Date"
                  value={selectedDate}
                  onChange={(v: any) => setSelectedDate(v)}
                  minDate={dayjs()}
                  slotProps={{
                    textField: { fullWidth: true, size: 'small' }
                  }}
                />
              </LocalizationProvider>

              {/* CUSTOMER PROFILE & TRIP SELECTION */}
              <Grid container spacing={1}>
                <Grid size={6}>
                  <TextField
                    select
                    label="Trip Type"
                    size="small"
                    fullWidth
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                  >
                    <MenuItem value="DAY">Day</MenuItem>
                    <MenuItem value="DAY_NIGHT">Day + Night</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Full Name"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                  />
                </Grid>

                <Grid size={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Phone"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                  />
                </Grid>
              </Grid>

              {/* BOOKING TYPE */}
              <RadioGroup
                row
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
              >
                <FormControlLabel value="ROOM" control={<Radio />} label="Room" />
                <FormControlLabel value="PERSON" control={<Radio />} label="Person" />
              </RadioGroup>

              <TextField
                size="small"
                type="number"
                label="Quantity"
                fullWidth
                disabled={bookingType === 'ROOM'}
                value={bookingType === 'ROOM' ? boat?.rooms : quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

              {/* WEEKEND ALERT */}
              {priceData.isWeekend && (
                <Alert severity="info" sx={{ fontSize: 12 }}>
                  Weekend 30% price hike applied
                </Alert>
              )}

              {/* PRICE CARD */}
              <Paper sx={{ p: 1.5, borderRadius: 2,  }}>
                <Stack spacing={0.5} sx={{ fontSize: 14 }}>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Base</span>
                    <b>₹{priceData.base.toFixed(0)}</b>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Platform Fee</span>
                    <b>₹{priceData.platform}</b>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Service Charge(3%)</span>
                    <b>₹{priceData.gst.toFixed(0)}</b>
                  </Box>

                  <Divider sx={{ my: 0.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>Total</b>
                    <b style={{ color: '#2563eb' }}>
                      ₹{priceData.total.toFixed(0)}
                    </b>
                  </Box>

                </Stack>
              </Paper>

              {/* ACTION BUTTONS */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={onClose}
                  sx={{ py: 1.2, fontWeight: 600 }}
                >
                  Cancel
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConfirmBooking}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  Pay ₹{priceData.total.toFixed(0)}
                </Button>
              </Box>

            </Stack>
          )}
        </Box>
      </Box>
    </Modal>
  );
}