import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      return;
    }

    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, {
        status: 'cancelled'
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error al cancelar turno:', error);
      alert('Error al cancelar el turno');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      default: return 'Pendiente';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Cargando tus turnos...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Mis Turnos</h2>
      
      {appointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No tienes turnos reservados</h3>
          <p>¡Reserva tu primer turno para comenzar!</p>
        </div>
      ) : (
        <div className="appointment-grid">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className={`card appointment-card ${appointment.status}`}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <h3>{appointment.service_name}</h3>
                <span 
                  style={{ 
                    background: getStatusColor(appointment.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {getStatusText(appointment.status)}
                </span>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>📅 Fecha:</strong> {formatDate(appointment.date)}
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>🕐 Hora:</strong> {appointment.time}
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>⏱️ Duración:</strong> {appointment.duration} minutos
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <strong>💰 Precio:</strong> ${appointment.price}
              </div>

              {appointment.notes && (
                <div style={{ 
                  marginBottom: '15px',
                  padding: '10px',
                  background: '#f5f5f5',
                  borderRadius: '4px'
                }}>
                  <strong>📝 Notas:</strong> {appointment.notes}
                </div>
              )}

              {appointment.status === 'pending' && (
                <button 
                  className="btn btn-danger"
                  onClick={() => cancelAppointment(appointment.id)}
                  style={{ width: '100%' }}
                >
                  Cancelar Turno
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;