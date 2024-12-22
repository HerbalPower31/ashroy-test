import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const BlockDates = () => {
  // Real room data
  const rooms = [
    { id: 1, name: 'Deluxe Room', price: 2999 },
    { id: 2, name: 'Super Deluxe Room', price: 3999 },
    { id: 3, name: 'Executive Suite', price: 4999 },
  ];

  const [selectedRoom, setSelectedRoom] = useState('');
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [blockReason, setBlockReason] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch blocked dates for selected room
  useEffect(() => {
    if (selectedRoom) {
      setLoading(true);
      // For now using mock data, replace with actual API call
      const fetchBlockedDates = async () => {
        try {
          // Simulating API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockBlockedDates = [
            {
              id: 1,
              roomId: 1,
              startDate: '2024-03-01',
              endDate: '2024-03-05',
              reason: 'Room Maintenance',
            },
            {
              id: 2,
              roomId: 1,
              startDate: '2024-03-15',
              endDate: '2024-03-20',
              reason: 'Deep Cleaning',
            },
            {
              id: 3,
              roomId: 2,
              startDate: '2024-03-10',
              endDate: '2024-03-12',
              reason: 'AC Repair',
            },
          ];

          setBlockedDates(mockBlockedDates.filter(date => date.roomId === parseInt(selectedRoom)));
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch blocked dates');
          setLoading(false);
        }
      };

      fetchBlockedDates();
    }
  }, [selectedRoom]);

  const handleSubmit = async () => {
    if (!selectedRoom || !dateRange[0].startDate || !dateRange[0].endDate || !blockReason) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newBlock = {
        id: editId || Date.now(),
        roomId: parseInt(selectedRoom),
        startDate: format(dateRange[0].startDate, 'yyyy-MM-dd'),
        endDate: format(dateRange[0].endDate, 'yyyy-MM-dd'),
        reason: blockReason,
      };

      if (editMode) {
        setBlockedDates(prev => prev.map(block => block.id === editId ? newBlock : block));
        setSuccess('Block dates updated successfully');
      } else {
        setBlockedDates(prev => [...prev, newBlock]);
        setSuccess('Dates blocked successfully');
      }

      // Reset form
      setBlockReason('');
      setShowDatePicker(false);
      setEditMode(false);
      setEditId(null);
    } catch (err) {
      setError('Failed to block dates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (block) => {
    setSelectedRoom(block.roomId.toString());
    setDateRange([
      {
        startDate: new Date(block.startDate),
        endDate: new Date(block.endDate),
        key: 'selection',
      },
    ]);
    setBlockReason(block.reason);
    setEditMode(true);
    setEditId(block.id);
    setShowDatePicker(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBlockedDates(prev => prev.filter(block => block.id !== id));
      setSuccess('Block dates deleted successfully');
    } catch (err) {
      setError('Failed to delete blocked dates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Block Dates
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Room</InputLabel>
            <Select
              value={selectedRoom}
              label="Select Room"
              onChange={(e) => setSelectedRoom(e.target.value)}
              disabled={loading}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name} - ₹{room.price}/night
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => setShowDatePicker(true)}
            sx={{ mb: 2 }}
            disabled={loading}
          >
            {dateRange[0].startDate && dateRange[0].endDate
              ? `${format(dateRange[0].startDate, 'MMM dd, yyyy')} - ${format(
                  dateRange[0].endDate,
                  'MMM dd, yyyy'
                )}`
              : 'Select Dates'}
          </Button>

          <Dialog
            open={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            maxWidth="md"
          >
            <DialogTitle>Select Date Range</DialogTitle>
            <DialogContent>
              <DateRange
                editableDateInputs={true}
                onChange={item => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                minDate={new Date()}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDatePicker(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <TextField
            fullWidth
            label="Blocking Reason"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !selectedRoom || !dateRange[0].startDate || !dateRange[0].endDate || !blockReason}
          >
            {loading ? 'Processing...' : editMode ? 'Update Block' : 'Block Dates'}
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Currently Blocked Dates
        </Typography>
        {selectedRoom ? (
          loading ? (
            <Typography color="textSecondary">Loading blocked dates...</Typography>
          ) : blockedDates.length > 0 ? (
            <List>
              {blockedDates.map((block) => (
                <ListItem
                  key={block.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={`${format(new Date(block.startDate), 'MMM dd, yyyy')} - ${format(
                      new Date(block.endDate),
                      'MMM dd, yyyy'
                    )}`}
                    secondary={block.reason}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleEdit(block)} 
                      sx={{ mr: 1 }}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDelete(block.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">No blocked dates for this room</Typography>
          )
        ) : (
          <Typography color="textSecondary">Select a room to view blocked dates</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default BlockDates; 