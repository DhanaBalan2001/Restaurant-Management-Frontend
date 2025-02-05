import React, { useState } from 'react';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    guestCount: '',
    timeSlot: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const checkAvailability = async () => {
    const response = await fetch(`http://localhost:5000/api/reservations/available-slots?date=${formData.date}&guestCount=${formData.guestCount}`);
    const data = await response.json();
    setAvailableSlots(data.availability);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/reservations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        date: formData.date,
        timeSlot: formData.timeSlot,
        guestCount: parseInt(formData.guestCount),
        table: selectedTable
      })
    });
    if (response.ok) {
      // Handle successful reservation
      alert('Reservation created successfully!');
    }
  };

  return (
    <div className="reservation-container">
      <h2>Make a Reservation</h2>
      <div className="availability-check">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
        <input
          type="number"
          placeholder="Number of Guests"
          value={formData.guestCount}
          onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
        />
        <button onClick={checkAvailability}>Check Availability</button>
      </div>

      {availableSlots.length > 0 && (
        <div className="time-slots">
          <h3>Available Time Slots</h3>
          <div className="slots-grid">
            {availableSlots.map((slot) => (
              <div key={slot.timeSlot} className="slot-item">
                <h4>{slot.timeSlot}</h4>
                <div className="tables-list">
                  {slot.availableTables.map((table) => (
                    <button
                      key={table._id}
                      onClick={() => {
                        setSelectedTable(table._id);
                        setFormData({...formData, timeSlot: slot.timeSlot});
                      }}
                      className={selectedTable === table._id ? 'selected' : ''}
                    >
                      Table {table.tableNumber}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTable && (
        <button onClick={handleSubmit} className="submit-reservation">
          Confirm Reservation
        </button>
      )}
    </div>
  );
};

export default ReservationForm;
