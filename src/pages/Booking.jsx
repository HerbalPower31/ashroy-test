import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField, Button, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    idType: '',
    idNumber: '',
    specialRequests: ''
  });

  const [idImage, setIdImage] = useState(null);
  const [idPreview, setIdPreview] = useState('');

  const idTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'driving', label: 'Driving License' },
    { value: 'passport', label: 'Passport' },
    { value: 'voter', label: 'Voter ID' }
  ];

  const handleIdImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIdImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (formData.guests < 1 || formData.guests > room.capacity) {
      newErrors.guests = `Guests must be between 1 and ${room.capacity}`;
    }
    if (!formData.idType) newErrors.idType = 'ID type is required';
    if (!formData.idNumber) newErrors.idNumber = 'ID number is required';
    if (!idImage) newErrors.idImage = 'ID proof image is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('roomId', room.id);
    formDataToSend.append('checkIn', format(dateRange.startDate, 'yyyy-MM-dd'));
    formDataToSend.append('checkOut', format(dateRange.endDate, 'yyyy-MM-dd'));
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('idProof', idImage);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const data = await response.json();
      navigate('/booking-confirmation', { 
        state: { 
          bookingId: data.bookingId,
          roomName: room.name,
          checkIn: format(dateRange.startDate, 'dd MMM yyyy'),
          checkOut: format(dateRange.endDate, 'dd MMM yyyy'),
          guestName: formData.name
        }
      });
    } catch (error) {
      setErrors({ submit: 'Failed to create booking. Please try again.' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Guest Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.idType}>
                    <InputLabel>ID Type *</InputLabel>
                    <Select
                      name="idType"
                      value={formData.idType}
                      label="ID Type *"
                      onChange={handleInputChange}
                    >
                      {idTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.idType && (
                      <FormHelperText>{errors.idType}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ID Number"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    error={!!errors.idNumber}
                    helperText={errors.idNumber}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="id-image-upload"
                    type="file"
                    onChange={handleIdImageChange}
                  />
                  <label htmlFor="id-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload ID Proof
                    </Button>
                  </label>
                  {errors.idImage && (
                    <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                      {errors.idImage}
                    </Typography>
                  )}
                  {idPreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={idPreview}
                        alt="ID Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Booking; 