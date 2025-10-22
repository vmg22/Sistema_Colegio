import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
 const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      color: '#343a40',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '6rem',
      fontWeight: 'bold',
      margin: '0'
    },
    subtitle: {
      fontSize: '1.5rem',
      margin: '0 0 20px 0'
    },
    link: {
      fontSize: '1rem',
      color: '#007bff',
      textDecoration: 'none',
      border: '1px solid #007bff',
      padding: '10px 20px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s'
    }
  };

  // Agregamos un estilo para el hover del enlace usando un poco de JavaScript
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#007bff';
    e.target.style.color = '#ffffff';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '#007bff';
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Página No Encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link 
        to="/" 
        style={styles.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Volver al Inicio
      </Link>
    </div>
  );
};


export default NotFoundPage
