import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Paper, Chip } from '@mui/material';
import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const RoomCalendar = ({ room, bookings = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Transform bookings into calendar events
  const events = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.guestName} (${booking.guests} guests)`,
    start: new Date(booking.checkIn),
    end: new Date(booking.checkOut),
    booking: booking
  }));

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.booking.status === 'confirmed' ? '#4caf50' : 
                      event.booking.status === 'pending' ? '#ff9800' : '#f44336',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ height: 400, mb: 2 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day']}
          defaultView="month"
          tooltipAccessor={event => `${event.title}\nCheck-in: ${format(event.start, 'PPP')}\nCheck-out: ${format(event.end, 'PPP')}`}
        />
      </Box>

      {selectedEvent && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Booking Details
          </Typography>
          <Typography variant="body2">
            Guest: {selectedEvent.booking.guestName}
          </Typography>
          <Typography variant="body2">
            Guests: {selectedEvent.booking.guests}
          </Typography>
          <Typography variant="body2">
            Check-in: {format(selectedEvent.start, 'PPP')}
          </Typography>
          <Typography variant="body2">
            Check-out: {format(selectedEvent.end, 'PPP')}
          </Typography>
          <Typography variant="body2">
            Status: <Chip 
              label={selectedEvent.booking.status}
              size="small"
              color={
                selectedEvent.booking.status === 'confirmed' ? 'success' :
                selectedEvent.booking.status === 'pending' ? 'warning' : 'error'
              }
            />
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RoomCalendar; 