/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, TextField, Button, Typography, MenuItem, Paper, 
   Alert, CircularProgress, Box
} from '@mui/material';
import { useRouter } from 'next/navigation';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AddBoatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const tokenRef = useRef<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', 
    licenseNumber: '', 
    type: 'Luxury Houseboat', 
    rooms: '', 
    capacity: '', 
    basePrice: '', 
    features: '' // New field added
  });

  useEffect(() => {
    tokenRef.current = localStorage.getItem('kayal_vista_auth_token');
    if (!tokenRef.current) setError('Unauthorized: Please log in.');
  }, []);

  const openCloudinaryWidget = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        multiple: true,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setImages((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Process features into an array
    const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== "");

    try {
      const res = await fetch('/api/owner/boats', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `${tokenRef.current}` 
        },
        body: JSON.stringify({ 
            ...formData, 
            features: featuresArray, 
            images,
            rooms: Number(formData.rooms),
            capacity: Number(formData.capacity),
            basePrice: Number(formData.basePrice)
        })
      });

      if (!res.ok) throw new Error('Failed to register vessel');
      alert('Vessel Registered Successfully!');
      router.push('/owner/boats');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e0e0e0' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 800 }}>Register New Fleet Vessel</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField fullWidth required label="Vessel Public Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField fullWidth required label="License Number" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField select fullWidth label="Vessel Classification" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <MenuItem value="Luxury Houseboat">Luxury Houseboat</MenuItem>
                <MenuItem value="Premium Cruise">Premium Cruise</MenuItem>
                <MenuItem value="Traditional">Traditional Shikhara</MenuItem>
              </TextField>
            </Box>
            <Box>
              <TextField fullWidth required type="number" label="Rooms" value={formData.rooms} onChange={(e) => setFormData({...formData, rooms: e.target.value})} />
            </Box>
            <Box>
              <TextField fullWidth required type="number" label="Max Capacity" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField fullWidth required type="number" label="Base Price Tariff (₹)" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField 
                fullWidth 
                label="Features/Facilities (comma separated)" 
                placeholder="e.g. Wi-Fi, AC, Private Deck, Kitchen"
                value={formData.features} 
                onChange={(e) => setFormData({...formData, features: e.target.value})} 
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <Button fullWidth variant="outlined" startIcon={<CloudUploadIcon />} onClick={openCloudinaryWidget} sx={{ py: 1.5 }}>
                {images.length > 0 ? `${images.length} images uploaded` : 'Upload Vessel Photos'}
              </Button>
            </Box>
          </Box>
          <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 4, fontWeight: 700 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Register Vessel'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}