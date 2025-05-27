import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import { Link } from 'react-router-dom';

const VistaPublicaSitios = () => {
    const [sitios, setSitios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSitios = async () => {
            try {
                const response = await api.getSitiosTuristicos();
                setSitios(response.data);
            } catch (err) {
                setError('Fallo al cargar los sitios turísticos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSitios();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando sitios turísticos...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Sitios Turísticos Disponibles en Colombia</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {sitios.length > 0 ? (
                    sitios.map(sitio => (
                        <div key={sitio.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', transition: 'transform 0.2s ease-in-out', ':hover': { transform: 'translateY(-5px)' } }}>
                            {sitio.url_imagen && <img src={sitio.url_imagen} alt={sitio.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ marginBottom: '10px', color: '#007bff' }}>{sitio.nombre}</h3>
                                <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '10px' }}>{sitio.descripcion.substring(0, 120)}...</p>
                                <p style={{ fontWeight: 'bold', color: '#666' }}>Ubicación: {sitio.ubicacion}</p>
                                {sitio.nombre_creador && <p style={{ fontSize: '0.8em', color: '#777' }}>Creado por: {sitio.nombre_creador}</p>}
                                <Link to={`/sitios/${sitio.id}`} style={{ display: 'inline-block', marginTop: '15px', padding: '10px 18px', background: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>
                                    Ver Detalles
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No hay sitios turísticos disponibles aún.</p>
                )}
            </div>
        </div>
    );
};

export default VistaPublicaSitios;