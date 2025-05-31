import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../pages/Acces.css'; // Importa el archivo CSS

export default function Access() {
  const [accessList, setAccessList] = useState([]);
  const [users, setUsers] = useState([]);
  const [doors, setDoors] = useState([]);
  const [userId, setUserId] = useState('');
  const [doorId, setDoorId] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchData = async () => {
    try {
      const [accessRes, usersRes, doorsRes] = await Promise.all([
        api.get('access/'),
        api.get('users/'),
        api.get('doors/'),
      ]);
      setAccessList(accessRes.data);
      setUsers(usersRes.data);
      setDoors(doorsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('access/', {
        user: userId,
        door: doorId,
        is_permanent: isPermanent,
        start_time: isPermanent ? null : startTime,
        end_time: isPermanent ? null : endTime,
      });
      setUserId('');
      setDoorId('');
      setIsPermanent(false);
      setStartTime('');
      setEndTime('');
      fetchData();
    } catch (err) {
      console.error('Error al registrar acceso:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`access/${id}/`);
      fetchData();
    } catch (err) {
      console.error('Error al eliminar acceso:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="access-container">
      <div className="access-card">
        <div className="access-header">
          <h2 className="access-title">Registrar Permiso de Acceso</h2>
          <div className="access-divider"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="access-form">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="access-select"
          >
            <option value="">Seleccionar usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>

          <select
            value={doorId}
            onChange={(e) => setDoorId(e.target.value)}
            required
            className="access-select"
          >
            <option value="">Seleccionar puerta</option>
            {doors.map((door) => (
              <option key={door.id} value={door.id}>{door.name}</option>
            ))}
          </select>

          <label className="access-checkbox-container">
            <input
              type="checkbox"
              checked={isPermanent}
              onChange={(e) => setIsPermanent(e.target.checked)}
              className="access-checkbox"
            />
            <span className="access-checkbox-label">Permanente</span>
          </label>

          {!isPermanent && (
            <div className="access-datetime-container">
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="access-datetime"
                placeholder="Fecha y hora de inicio"
              />
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="access-datetime"
                placeholder="Fecha y hora de fin"
              />
            </div>
          )}

          <button
            type="submit"
            className="access-submit-button"
          >
            Guardar Permiso
          </button>
        </form>
      </div>

      <div className="access-list-card">
        <div className="access-list-header">
          <h3 className="access-list-title">Permisos Registrados</h3>
          <div className="access-divider"></div>
        </div>
        
        {accessList.length === 0 ? (
          <div className="access-empty-state">
            <p className="access-empty-text">No hay permisos registrados</p>
            <p className="access-empty-subtext">Agrega el primer permiso de acceso</p>
          </div>
        ) : (
          <ul className="access-list">
            {accessList.map((perm) => (
              <li key={perm.id} className="access-item">
                <span className="access-item-info">
                  Usuario {perm.user} → Puerta {perm.door} (
                  {perm.is_permanent ? 'Permanente' : `${perm.start_time} - ${perm.end_time}`})
                </span>
                <button
                  onClick={() => handleDelete(perm.id)}
                  className="access-delete-button"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}