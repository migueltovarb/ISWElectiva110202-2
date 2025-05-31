// src/pages/Doors.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Doors() {
  const [doors, setDoors] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const fetchDoors = async () => {
    const res = await api.get('doors/');
    setDoors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('doors/', { name, location });
    setName('');
    setLocation('');
    fetchDoors();
  };

  useEffect(() => {
    fetchDoors();
  }, []);

  return (
    <div>
      <h2>Registrar Puerta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>

      <h3>Puertas registradas</h3>
      <ul>
        {doors.map((door) => (
          <li key={door.id}>{door.name} - {door.location}</li>
        ))}
      </ul>
    </div>
  );
}
