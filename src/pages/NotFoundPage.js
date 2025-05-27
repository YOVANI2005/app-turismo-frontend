import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>404 - Página No Encontrada</h1>
            <p>Lo sentimos, la página que estás buscando no existe.</p>
            <Link to="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>
                Volver a la Página de Inicio
            </Link>
        </div>
    );
};

export default NotFoundPage;