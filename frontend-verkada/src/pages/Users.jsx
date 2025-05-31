import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('resident');

  const fetchUsers = async () => {
    const res = await api.get('users/');
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('users/', {
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      });
      setUsername('');
      setPassword('');
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('resident');
      fetchUsers();
    } catch (err) {
      console.error('Error al crear usuario:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`users/${id}/`);
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Registrar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="resident">Residente</option>
          <option value="admin">Administrador</option>
          <option value="visitor">Visitante</option>
        </select>
        <button type="submit">Crear Usuario</button>
      </form>

      <h3>Usuarios Registrados</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.role}
            <button
              onClick={() => handleDelete(user.id)}
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
