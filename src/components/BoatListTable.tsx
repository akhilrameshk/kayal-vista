/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, CircularProgress, Paper, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  useTheme, alpha, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface DBBoat {
  _id: string;
  name: string;
  type: string;
  capacity: number;
  basePrice: number;
  location: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  features?: string[];
  images?: string[];
}

export default function BoatListTable({ allowedRole }: { allowedRole: 'SUPER_ADMIN' | 'BOAT_OWNER' }) {
  const router = useRouter();
  const theme = useTheme();
  const [boats, setBoats] = useState<DBBoat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoat, setEditingBoat] = useState<DBBoat | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    name: '', type: 'Luxury Houseboat', capacity: '', basePrice: '', location: 'Alappuzha', features: '', images: '', status: 'ACTIVE'
  });

  const fetchFleet = async () => {
    const token = localStorage.getItem('kayal_vista_auth_token');
    try {
      const res = await fetch('/api/admin/boats', { headers: { 'Authorization': token || '' } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setBoats(data.boats || []);
    } catch (err: any) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };
const handleNavigateToAddBoat = () => {
    // Optional: add any processing logic here
    router.push('/owner/boats/add');
  };
  useEffect(() => { 
    fetchFleet(); 
  }, []);

  const handleOpenModal = (boat?: DBBoat) => {
    if (boat) {
      setEditingBoat(boat);
      setFormData({
        name: boat.name, 
        type: boat.type, 
        capacity: boat.capacity.toString(),
        basePrice: boat.basePrice.toString(), 
        location: boat.location,
        features: (boat.features || []).join(', '), 
        images: (boat.images || []).join(', '),
        status: boat.status
      });
    } else {
      setEditingBoat(null);
      setFormData({ name: '', type: 'Luxury Houseboat', capacity: '', basePrice: '', location: 'Alappuzha', features: '', images: '', status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    const token = localStorage.getItem('kayal_vista_auth_token');
    const url = editingBoat ? `/api/admin/boats/${editingBoat._id}` : '/api/admin/boats';
    
    try {
      const res = await fetch(url, {
        method: editingBoat ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token || '' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          location: formData.location,
          status: formData.status,
          features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ""),
          images: formData.images.split(',').map(i => i.trim()).filter(i => i !== ""),
          capacity: Number(formData.capacity),
          basePrice: Number(formData.basePrice)
        })
      });

      if (!res.ok) throw new Error(`Failed to ${editingBoat ? 'update' : 'create'} vessel details.`);
      setIsModalOpen(false);
      fetchFleet();
    } catch (err: any) { 
      alert(err.message); 
    } finally { 
      setFormSubmitting(false); 
    }
  };

  const handleDeleteBoat = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this vessel from your fleet logs?')) return;
    const token = localStorage.getItem('kayal_vista_auth_token');
    try {
      const res = await fetch(`/api/admin/boats/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token || '' }
      });
      if (!res.ok) throw new Error('Could not delete vessel record.');
      fetchFleet();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'success';
      case 'MAINTENANCE': return 'warning';
      case 'INACTIVE': return 'error';
      default: return 'default';
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  const displayedBoats = boats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fleet Management
            </Typography>
            <Typography color="text.secondary">
              Manage your vessels, update pricing, and set maintenance status.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
           onClick={handleNavigateToAddBoat}
            sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
          >
            Add New Vessel
          </Button>
        </Box>
      </Box>

      {boats.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No vessels found. Add your first boat to get started!
          </Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: theme.palette.mode === 'light'
              ? '0px 4px 20px rgba(0,0,0,0.08)'
              : '0px 4px 20px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}
        >
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                  '& th': {
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'primary.main',
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }
                }}
              >
                <TableCell sx={{ py: 2.5 }}>Vessel Name</TableCell>
                <TableCell sx={{ py: 2.5 }}>Type</TableCell>
                <TableCell align="center" sx={{ py: 2.5 }}>Capacity</TableCell>
                <TableCell sx={{ py: 2.5 }}>Location</TableCell>
                <TableCell align="right" sx={{ py: 2.5 }}>Base Price</TableCell>
                <TableCell align="center" sx={{ py: 2.5 }}>Status</TableCell>
                <TableCell align="center" sx={{ py: 2.5 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBoats.map((boat) => (
                <TableRow
                  key={boat._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                      transition: 'all 0.2s ease',
                    },
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell sx={{ py: 2.5, fontWeight: 700 }}>
                    {boat.name}
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <Chip
                      label={boat.type}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1.5, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5, fontWeight: 700 }}>
                    {boat.capacity} Guests
                  </TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    {boat.location}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2.5, fontWeight: 700, color: 'primary.main' }}>
                    ₹{boat.basePrice.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5 }}>
                    <Chip
                      label={boat.status}
                      color={getStatusColor(boat.status) as any}
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 700, fontSize: '0.75rem', minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenModal(boat)}
                        sx={{
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                          borderRadius: 1.5,
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteBoat(boat._id)}
                        sx={{
                          color: 'error.main',
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) },
                          borderRadius: 1.5,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={boats.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          />
        </TableContainer>
      )}

      {/* Dynamic Pop-up Form Dialog */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.3rem' }}>
          {editingBoat ? 'Edit Vessel Details' : 'Register New Vessel'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              fullWidth 
              label="Vessel Name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <TextField 
              fullWidth 
              select 
              label="Vessel Type" 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <MenuItem value="Luxury Houseboat">Luxury Houseboat</MenuItem>
              <MenuItem value="Premium Cruise">Premium Cruise</MenuItem>
              <MenuItem value="Traditional Shikhara">Traditional Shikhara</MenuItem>
            </TextField>
            <TextField 
              fullWidth 
              label="Capacity (Guests)" 
              type="number" 
              value={formData.capacity} 
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              required
            />
            <TextField 
              fullWidth 
              label="Base Price (₹)" 
              type="number" 
              value={formData.basePrice} 
              onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
              required
            />
            <TextField 
              fullWidth 
              select 
              label="Location" 
              value={formData.location} 
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            >
              <MenuItem value="Alappuzha">Alappuzha</MenuItem>
              <MenuItem value="Kottayam">Kottayam</MenuItem>
              <MenuItem value="Kumarakom">Kumarakom</MenuItem>
            </TextField>
            <TextField 
              fullWidth 
              select 
              label="Status" 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>
            <TextField 
              fullWidth 
              label="Features" 
              multiline
              rows={2}
              value={formData.features} 
              onChange={(e) => setFormData({...formData, features: e.target.value})} 
              helperText="Comma separated values (e.g., Wi-Fi, AC, Kitchen)"
            />
            <TextField 
              fullWidth 
              label="Vessel Image URLs" 
              multiline
              rows={2}
              value={formData.images} 
              onChange={(e) => setFormData({...formData, images: e.target.value})} 
              helperText="Comma separated image source links (e.g., /img1.jpg, /img2.jpg)"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formSubmitting}>
              {formSubmitting ? 'Saving...' : 'Save Vessel'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}