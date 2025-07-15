import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status });
      fetchAppointments();
    } catch (error) {
      console.error('Error al actualizar turno:', error);
      alert('Error al actualizar el turno');
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

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const todayAppointments = appointments.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.date === today;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    today: todayAppointments.length
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Cargando panel de administración...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Panel de Administración</h2>
      
      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#2196f3' }}>{stats.total}</h3>
          <p>Total Turnos</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#ff9800' }}>{stats.pending}</h3>
          <p>Pendientes</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#4caf50' }}>{stats.confirmed}</h3>
          <p>Confirmados</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#f44336' }}>{stats.cancelled}</h3>
          <p>Cancelados</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#9c27b0' }}>{stats.today}</h3>
          <p>Hoy</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <h3>Filtrar turnos:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos ({stats.total})
          </button>
          <button 
            className={`btn ${filter === 'pending' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendientes ({stats.pending})
          </button>
          <button 
            className={`btn ${filter === 'confirmed' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmados ({stats.confirmed})
          </button>
          <button 
            className={`btn ${filter === 'cancelled' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelados ({stats.cancelled})
          </button>
        </div>
      </div>

      {/* Lista de turnos */}
      {filteredAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h3>No hay turnos para mostrar</h3>
        </div>
      ) : (
        <div className="appointment-grid">
          {filteredAppointments.map((appointment) => (
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
                <strong>👤 Cliente:</strong> {appointment.client_name}
              </div>
              
              {appointment.client_phone && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>📞 Teléfono:</strong> {appointment.client_phone}
                </div>
              )}
              
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-success"
                    onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                    style={{ flex: 1 }}
                  >
                    Confirmar
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;