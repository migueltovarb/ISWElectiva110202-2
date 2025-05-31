import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../pages/User.css'; 

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

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      resident: 'Residente',
      visitor: 'Visitante'
    };
    return roleNames[role] || role;
  };

  return (
    <div className="users-container">
      <div className="users-card">
        <div className="users-header">
          <h2 className="users-title">Registrar Usuario</h2>
          <div className="users-divider"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="users-form">
          <div className="users-input-row">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="users-input"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="users-input"
              required
            />
          </div>
          
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="users-input users-input-full"
            required
          />
          
          <div className="users-input-row">
            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="users-input"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="users-input"
              required
            />
          </div>
          
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="users-select users-input-full"
          >
            <option value="resident">Residente</option>
            <option value="admin">Administrador</option>
            <option value="visitor">Visitante</option>
          </select>
          
          <button type="submit" className="users-submit-button">
            Crear Usuario
          </button>
        </form>
      </div>

      <div className="users-list-card">
        <div className="users-list-header">
          <h3 className="users-list-title">
            Usuarios Registrados
            <span className="users-counter">{users.length}</span>
          </h3>
          <div className="users-divider"></div>
        </div>
        
        {users.length === 0 ? (
          <div className="users-empty-state">
            <div className="users-empty-icon">👥</div>
            <p className="users-empty-text">No hay usuarios registrados</p>
            <p className="users-empty-subtext">Agrega el primer usuario al sistema</p>
          </div>
        ) : (
          <ul className="users-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                <div className="user-info">
                  <div className="user-name">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="user-details">
                    <span>@{user.username}</span>
                    <span>{user.email}</span>
                    <span className={`user-role ${user.role}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="user-delete-button"
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