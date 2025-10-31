import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/notFoundPage.css'

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Página No Encontrada</h2>
      <p className="not-found-text">Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/" className="not-found-link">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFoundPage