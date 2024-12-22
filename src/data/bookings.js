const bookings = {
  // Bookings for Ashroy's rooms
  'Ashroy': [
    {
      id: 1,
      roomId: 1,
      guestName: 'John Doe',
      guests: 2,
      checkIn: '2024-02-20',
      checkOut: '2024-02-23',
      status: 'confirmed',
      totalAmount: 3600
    },
    {
      id: 2,
      roomId: 2,
      guestName: 'Jane Smith',
      guests: 4,
      checkIn: '2024-02-25',
      checkOut: '2024-02-28',
      status: 'confirmed',
      totalAmount: 7500
    },
    {
      id: 3,
      roomId: 1,
      guestName: 'Mike Johnson',
      guests: 2,
      checkIn: '2024-03-01',
      checkOut: '2024-03-03',
      status: 'pending',
      totalAmount: 2400
    }
  ],
  // Bookings for John Smith's rooms
  'John Smith': [
    {
      id: 4,
      roomId: 3,
      guestName: 'Alice Brown',
      guests: 2,
      checkIn: '2024-02-18',
      checkOut: '2024-02-21',
      status: 'confirmed',
      totalAmount: 9000
    },
    {
      id: 5,
      roomId: 3,
      guestName: 'Robert Wilson',
      guests: 2,
      checkIn: '2024-02-24',
      checkOut: '2024-02-26',
      status: 'pending',
      totalAmount: 6000
    }
  ]
};

export default bookings; 