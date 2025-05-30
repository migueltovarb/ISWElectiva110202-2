import React, { useEffect, useState } from 'react';
import api from '../api/api';

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
    <div>
      <h2>Registrar Permiso de Acceso</h2>
      <form onSubmit={handleSubmit}>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Seleccionar usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>

        <select value={doorId} onChange={(e) => setDoorId(e.target.value)} required>
          <option value="">Seleccionar puerta</option>
          {doors.map((door) => (
            <option key={door.id} value={door.id}>{door.name}</option>
          ))}
        </select>

        <label>
          Permanente:
          <input
            type="checkbox"
            checked={isPermanent}
            onChange={(e) => setIsPermanent(e.target.checked)}
          />
        </label>

        {!isPermanent && (
          <>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit">Guardar Permiso</button>
      </form>

      <h3>Permisos Registrados</h3>
      <ul>
        {accessList.map((perm) => (
          <li key={perm.id}>
            Usuario {perm.user} → Puerta {perm.door} (
            {perm.is_permanent ? 'Permanente' : `${perm.start_time} - ${perm.end_time}`})
            <button
              onClick={() => handleDelete(perm.id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
