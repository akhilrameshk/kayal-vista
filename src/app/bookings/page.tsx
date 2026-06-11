/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  Container, Box, Typography, Paper, CircularProgress, Chip, useTheme, alpha,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';

export default function BookingsPage() {
  const theme = useTheme();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination Controls
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Date Filtering Controls (00:00:00 boundaries)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('kayal_vista_auth_token') || '';

    fetch('/api/bookings', {
      headers: { 'Authorization': token }
    })
      .then((res) => res.json())
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : (data.bookings || []);
        setBookings(arrayData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  // Compute local date filtered dataset rows concurrently
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!b.travelDate) return false;
      
      // Parse ISO timestamp properties cleanly from database values
      const bookingDate = typeof b.travelDate === 'string' ? parseISO(b.travelDate) : new Date(b.travelDate);

      if (startDate && endDate) {
        return isWithinInterval(bookingDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate),
        });
      }
      if (startDate) {
        return bookingDate >= startOfDay(startDate);
      }
      if (endDate) {
        return bookingDate <= endOfDay(endDate);
      }
      return true;
    });
  }, [bookings, startDate, endDate]);

  // Read current segmented slice values matching pagination index tracking bounds
  const paginatedBookings = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredBookings.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredBookings, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        
        {/* VIEW HEADER CONTROL HEADER */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.025em' }}>
              Booking Management
            </Typography>
            <Typography color="text.secondary">View and manage all your boat bookings</Typography>
          </Box>
        </Box>

        {/* INTERACTIVE DATE RANGE CONTROL MATRIX */}
       <Paper 
  elevation={0} 
  sx={{ 
    p: "10px", 
    mb: "10px", 
    borderRadius: '16px', 
    border: '1px solid #e2e8f0',
    bgcolor: '#ffffff',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    gap: "5px"
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', minWidth: '140px' }}>
    <FilterAltIcon fontSize="small" />
    <Typography variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      Filter Range:
    </Typography>
  </Box>
  
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1 }}>
    <DatePicker
      label="Start Date"
      value={startDate}
      // state state setter logic
      onChange={(date: any) => { 
        const jsDate = date && typeof date.toDate === 'function' ? date.toDate() : date;
        setStartDate(jsDate); 
        setPage(0); 
      }}
      // Opens the calendar popup when the input box is clicked
      slotProps={{ 
        textField: { 
          size: 'small', 
          fullWidth: true,
          onClick: (e: any) => {
            // Target the picker container button explicitly if native clicks mismatch
            const btn = e.currentTarget.querySelector('button');
            if (btn) btn.click();
          },
          sx: { '& .MuiInputBase-root': { cursor: 'pointer' }, '& input': { cursor: 'pointer' } }
        } 
      }}
    />
    
    <DatePicker
      label="End Date"
      value={endDate}
      minDate={startDate || undefined}
      onChange={(date: any) => { 
        const jsDate = date && typeof date.toDate === 'function' ? date.toDate() : date;
        setEndDate(jsDate); 
        setPage(0); 
      }}
      // Opens the calendar popup when the input box is clicked
      slotProps={{ 
        textField: { 
          size: 'small', 
          fullWidth: true,
          onClick: (e: any) => {
            const btn = e.currentTarget.querySelector('button');
            if (btn) btn.click();
          },
          sx: { '& .MuiInputBase-root': { cursor: 'pointer' }, '& input': { cursor: 'pointer' } }
        } 
      }}
    />
  </Stack>

  {(startDate || endDate) && (
    <Chip 
      label="Clear Filters" 
      onClick={() => { setStartDate(null); setEndDate(null); setPage(0); }} 
      onDelete={() => { setStartDate(null); setEndDate(null); setPage(0); }}
      color="error" 
      variant="outlined"
      sx={{ borderRadius: '8px', fontWeight: 600 }}
    />
  )}
</Paper>

        
      

        {/* REGISTRY VIEW SHEET INTERSECTION DATA PANELS */}
        {filteredBookings.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '1px dashed #cbd5e1', bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
            <DirectionsBoatIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>No match records found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Try adjusting your chosen search matrix calendars parameters.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0px 10px 30px rgba(0,0,0,0.02)' }}>
            <TableContainer sx={{ maxHeight: '60vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569' }}>Boat Name</TableCell>
                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569' }}>Customer</TableCell>
                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569' }}>Travel Date</TableCell>
                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569' }}>Booking Status</TableCell>
                    <TableCell align="right" sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569' }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBookings.map((b) => (
                    <TableRow key={b._id} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{b.boatId?.name || b.boatName || 'N/A'}</TableCell>
                      <TableCell sx={{ color: '#334155', fontWeight: 500 }}>{b.customer?.name || 'Guest'}</TableCell>
                      <TableCell sx={{ color: '#334155', fontWeight: 500 }}>
                        {b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={b.status} 
                          size="small" 
                          color={b.status === 'COMPLETED' ? 'success' : b.status === 'PENDING' ? 'warning' : 'error'}
                          sx={{ borderRadius: '6px', fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        ₹{b.totalPrice?.toLocaleString('en-IN') || '0'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* STICKY LOWER CONTROL LINE NAVIGATION */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredBookings.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}
            />
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
}