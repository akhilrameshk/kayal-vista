/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  Container, Box, Typography, Paper, CircularProgress, Chip, useTheme, alpha,
  Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EmailIcon from '@mui/icons-material/Email';
import ReplyIcon from '@mui/icons-material/Reply';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import { isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';

export default function EnquiriesPage() {
  const theme = useTheme();
  
  // Data State Channels
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filtering Matrix
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Modal Interactive States
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = () => {
    const token = localStorage.getItem('kayal_vista_auth_token') || '';
    fetch('/api/messages', { headers: { 'Authorization': token } })
      .then((res) => res.json())
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : (data.enquiries || []);
        setEnquiries(arrayData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error reading collection metrics:", err);
        setLoading(false);
      });
  };

  // 1. Process Date Restrictions Data Array Clones
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (!e.createdAt) return true;
      const targetDate = typeof e.createdAt === 'string' ? parseISO(e.createdAt) : new Date(e.createdAt);

      if (startDate && endDate) {
        return isWithinInterval(targetDate, { start: startOfDay(startDate), end: endOfDay(endDate) });
      }
      if (startDate) return targetDate >= startOfDay(startDate);
      if (endDate) return targetDate <= endOfDay(endDate);
      return true;
    });
  }, [enquiries, startDate, endDate]);

  // 2. Extract current targeted range matrix for lower pagination rows boundaries
  const paginatedEnquiries = useMemo(() => {
    const startOffset = page * rowsPerPage;
    return filteredEnquiries.slice(startOffset, startOffset + rowsPerPage);
  }, [filteredEnquiries, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSendingReply(true);

    try {
      const response = await fetch('/api/enquiries/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId: selectedEnquiry._id,
          customerEmail: selectedEnquiry.email,
          customerName: selectedEnquiry.name,
          replyMessage: replyText
        })
      });

      if (response.ok) {
        setSelectedEnquiry(null);
        setReplyText('');
        fetchEnquiries();
      } else {
        alert('Server validation rejected email dispatch parameters.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        
        {/* DASHBOARD ARCHITECTURE HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.02em' }}>
            Enquiry Register
          </Typography>
          <Typography color="text.secondary">Review real-time incoming contact submissions and dispatch email solutions</Typography>
        </Box>

        {/* CONTROLS INPUT WRAPPER BLOCK */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: "12px", mb: "24px", borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff',
            display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: "12px" 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', minWidth: '140px', px: 1 }}>
            <FilterAltIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>DATE RANGE:</Typography>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1, width: '100%' }}>
            <DatePicker
              label="From"
              value={startDate}
              onChange={(date: any) => { setStartDate(date?.toDate?.() || date); setPage(0); }}
              slotProps={{ 
                textField: { 
                  size: 'small', fullWidth: true, 
                  onClick: (e: any) => e.currentTarget.querySelector('button')?.click(),
                  sx: { '& .MuiInputBase-root': { cursor: 'pointer' } } 
                } 
              }}
            />
            <DatePicker
              label="To"
              value={endDate}
              minDate={startDate || undefined}
              onChange={(date: any) => { setEndDate(date?.toDate?.() || date); setPage(0); }}
              slotProps={{ 
                textField: { 
                  size: 'small', fullWidth: true, 
                  onClick: (e: any) => e.currentTarget.querySelector('button')?.click(),
                  sx: { '& .MuiInputBase-root': { cursor: 'pointer' } } 
                } 
              }}
            />
          </Stack>
          
          {(startDate || endDate) && (
            <Chip 
              label="Clear Filters" 
              onClick={() => { setStartDate(null); setEndDate(null); setPage(0); }} 
              color="error" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 600 }} 
            />
          )}
        </Paper>

        {/* REFACTORED DATA TABLE GRID SHEET CONTAINER */}
        {filteredEnquiries.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '1px dashed #cbd5e1', bgcolor: alpha(theme.palette.primary.main, 0.005) }}>
            <EmailIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.4 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>No enquiries matching parameters</Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0px 10px 30px rgba(0,0,0,0.01)' }}>
            <TableContainer sx={{ maxHeight: '65vh' }}>
              <Table stickyHeader aria-label="enquiries matrix table">
                <TableHead>
                  <TableRow>
                    <th style={{ backgroundColor: '#f8fafc', padding: '16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.875rem', borderBottom: '1px solid #e2e8f0' }}>Received Date</th>
                    <th style={{ backgroundColor: '#f8fafc', padding: '16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.875rem', borderBottom: '1px solid #e2e8f0' }}>Customer Contact</th>
                    <th style={{ backgroundColor: '#f8fafc', padding: '16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.875rem', borderBottom: '1px solid #e2e8f0' }}>Message Details</th>
                    <th style={{ backgroundColor: '#f8fafc', padding: '16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.875rem', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                    <th style={{ backgroundColor: '#f8fafc', padding: '16px', textAlign: 'right', fontWeight: 700, color: '#475569', fontSize: '0.875rem', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEnquiries.map((e) => (
                    <TableRow key={e._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      
                      {/* TIMESTAMP INDEX */}
                      <TableCell sx={{ whiteSpace: 'nowrap', verticalAlign: 'middle', py: 2.5 }}>
                        <Stack direction="row" spacing={1}  sx={{ color: '#475569' }}>
                          <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.8 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* CLIENT IDENTITY WRAPPER */}
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={0.5} >
                            <PersonIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{e.name}</Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} /> {e.email}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* DATA PACKET MESSAGING FIELD BOX */}
                      <TableCell sx={{ maxWidth: '360px', verticalAlign: 'middle' }}>
                        <Stack direction="row" spacing={1} >
                          <ChatIcon sx={{ fontSize: '1.05rem', color: '#94a3b8', mt: 0.4, flexShrink: 0 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#334155', 
                              fontWeight: 500,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.5
                            }}
                          >
                            {e.message}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* STATUS CHIP INDICATOR */}
                      <TableCell sx={{ verticalAlign: 'middle' }}>
                        <Chip 
                          label={e.status || 'PENDING'} 
                          size="small"
                          color={e.status === 'RESOLVED' ? 'success' : 'warning'}
                          sx={{ borderRadius: '6px', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.02em' }}
                        />
                      </TableCell>

                      {/* CALL TO INTERACTION LINE CONTROLS */}
                      <TableCell align="right" sx={{ verticalAlign: 'middle' }}>
                        {e.status === 'RESOLVED' ? (
                          <Tooltip title="Reply Dispatched">
                            <Stack direction="row" spacing={0.5} sx={{ color: 'success.main', pr: 1 }}>
                              <CheckCircleIcon fontSize="small" />
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>Replied</Typography>
                            </Stack>
                          </Tooltip>
                        ) : (
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<ReplyIcon />}
                            onClick={() => setSelectedEnquiry(e)}
                            sx={{ 
                              borderRadius: '8px', 
                              textTransform: 'none', 
                              fontWeight: 700, 
                              boxShadow: 'none',
                              py: 0.6, px: 2,
                              '&:hover': { boxShadow: 'none' }
                            }}
                          >
                            Reply
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* STICKY BOTTOM TABLE PAGINATION CONTROLS */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredEnquiries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}
            />
          </Paper>
        )}

        {/* MODAL POPUP DIALOG WINDOW */}
        <Dialog 
          open={Boolean(selectedEnquiry)} onClose={() => !sendingReply && setSelectedEnquiry(null)}
          fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
        >
          {selectedEnquiry && (
            <>
              <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                Compose Reply to {selectedEnquiry.name}
              </DialogTitle>
              <DialogContent>
                <Typography variant="caption" color="text.secondary"  sx={{ mb: 2 }}>
                  Recipient Email Target: <strong>{selectedEnquiry.email}</strong>
                </Typography>
                
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>CLIENT INQUIRY MESSAGE:</Typography>
                  <Typography variant="body2" sx={{ color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>{selectedEnquiry.message}</Typography>
                </Box>

                <TextField
                  fullWidth required multiline rows={5}
                  label="Write Email Response Content"
                  placeholder="Type details regarding packages, fleet configurations, custom quotes..."
                  value={replyText} onChange={(e) => setReplyText(e.target.value)}
                  disabled={sendingReply}
                  slotProps={{ input: { sx: { borderRadius: '12px' } } }}
                />
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={() => setSelectedEnquiry(null)} disabled={sendingReply} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendReply} variant="contained" disabled={sendingReply || !replyText.trim()}
                  sx={{ px: 3, borderRadius: '8px', textTransform: 'none', fontWeight: 700, minWidth: '120px' }}
                >
                  {sendingReply ? <CircularProgress size={20} color="inherit" /> : 'Send Email'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

      </Container>
    </LocalizationProvider>
  );
}