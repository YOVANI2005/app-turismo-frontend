import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
            <h1>¡Bienvenido a la Aplicación de Promoción Turística de Colombia!</h1>
            <p>Descubre los sitios turísticos más asombrosos y deportes extremos en Colombia.</p>
            <p>Explora, gestiona y promueve la belleza de nuestro país.</p>
            <Link to="/sitios" style={{ display: 'inline-block', padding: '12px 25px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontSize: '1.1em', marginTop: '20px' }}>
                Explorar Sitios Turísticos
            </Link>
        </div>
    );
};

export default HomePage;