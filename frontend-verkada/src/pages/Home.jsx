import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-header">
          <div className="home-logo">
            <div className="logo-icon">🔐</div>
            <h1 className="home-title">Verkada</h1>
          </div>
          <div className="home-divider"></div>
        </div>
        
        <div className="home-content">
          <div className="welcome-section">
            <h2 className="welcome-title">Bienvenido al Sistema de Control de Acceso</h2>
            <p className="welcome-description">
              Gestiona puertas, usuarios, accesos y alarmas de forma segura y eficiente. 
              Tu plataforma integral para el control de acceso inteligente.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚪</div>
              <h3 className="feature-title">Gestión de Puertas</h3>
              <p className="feature-description">
                Administra y monitorea todas las puertas de tu sistema
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Control de Usuarios</h3>
              <p className="feature-description">
                Gestiona permisos y accesos de usuarios de manera centralizada
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Registro de Accesos</h3>
              <p className="feature-description">
                Monitorea y audita todos los eventos de acceso en tiempo real
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚨</div>
              <h3 className="feature-title">Sistema de Alarmas</h3>
              <p className="feature-description">
                Recibe notificaciones inmediatas ante eventos de seguridad
              </p>
            </div>
          </div>
          
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Monitoreo</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Seguro</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Escalable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}