import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../api/api';

const DetalleSitioTuristico = () => {
    const { id } = useParams(); // Obtener el ID del parámetro de la URL
    const [sitio, setSitio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSitio = async () => {
            try {
                const response = await api.getSitioTuristicoById(id);
                setSitio(response.data);
            } catch (err) {
                setError('Fallo al cargar los detalles del sitio turístico.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSitio();
    }, [id]); // Ejecutar cuando el ID de la URL cambie

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando detalles del sitio...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
    if (!sitio) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Sitio turístico no encontrado.</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '50px auto', padding: '25px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', background: '#fff' }}>
            <Link to="/sitios" style={{ display: 'inline-block', marginBottom: '25px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Volver a Sitios</Link>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '2.2em' }}>{sitio.nombre}</h2>
            {sitio.url_imagen && <img src={sitio.url_imagen} alt={sitio.nombre} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ddd' }} />}
            <p style={{ fontSize: '1.1em', lineHeight: '1.6', color: '#444' }}><strong>Ubicación:</strong> {sitio.ubicacion}</p>
            <p style={{ fontSize: '1.1em', lineHeight: '1.6', color: '#444' }}>{sitio.descripcion}</p>
            {sitio.nombre_creador && <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>Agregado por: {sitio.nombre_creador} el {new Date(sitio.created_at).toLocaleDateString()}</p>}
        </div>
    );
};

export default DetalleSitioTuristico;