import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookAppointment = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await axios.get(`/api/available-slots/${date}`);
      setAvailableSlots(response.data);
      setSelectedTime(''); // Reset selected time when date changes
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/appointments', {
        service_id: selectedService,
        date: selectedDate,
        time: selectedTime,
        notes: notes
      });

      alert('¡Turno reservado exitosamente!');
      navigate('/');
    } catch (error) {
      console.error('Error al reservar turno:', error);
      alert(error.response?.data?.error || 'Error al reservar el turno');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Reservar Turno</h2>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Servicio:</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
              >
                <option value="">Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration} min)
                  </option>
                ))}
              </select>
            </div>

            {selectedServiceData && (
              <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                background: '#e3f2fd',
                borderRadius: '4px'
              }}>
                <h4>{selectedServiceData.name}</h4>
                <p>{selectedServiceData.description}</p>
                <p><strong>Duración:</strong> {selectedServiceData.duration} minutos</p>
                <p><strong>Precio:</strong> ${selectedServiceData.price}</p>
              </div>
            )}

            <div className="form-group">
              <label>Fecha:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                required
              />
            </div>

            {selectedDate && (
              <div className="form-group">
                <label>Horario disponible:</label>
                {availableSlots.length === 0 ? (
                  <p style={{ color: '#f44336' }}>
                    No hay horarios disponibles para esta fecha
                  </p>
                ) : (
                  <div className="time-slots">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot}
                        className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Notas adicionales (opcional):</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguna preferencia o comentario especial..."
                rows="3"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/')}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !selectedService || !selectedDate || !selectedTime}
                style={{ flex: 2 }}
              >
                {loading ? 'Reservando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;