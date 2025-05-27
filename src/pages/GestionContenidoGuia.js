import React, { useState, useEffect } from 'react';
import * as api from '../api/api';
import { useAuth } from '../contexts/AuthContext';

const GestionContenidoGuia = () => {
    const { user } = useAuth(); // Obtener el usuario actual para filtrar contenido si es guía
    const [sitios, setSitios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        descripcion: '',
        ubicacion: '',
        urlImagen: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchSitios();
    }, [user]); // Vuelve a cargar si el usuario cambia (ej. rol)

    const fetchSitios = async () => {
        try {
            setLoading(true);
            const response = await api.getSitiosTuristicos();
            // Filtrar sitios si el rol es 'guia_turistico', o mostrar todos si es 'admin'
            const filteredSites = user.role === 'guia_turistico'
                ? response.data.filter(sitio => sitio.creado_por === user.id)
                : response.data;
            setSitios(filteredSites);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Fallo al cargar los sitios turísticos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.updateSitioTuristico(formData.id, formData);
                alert('¡Sitio turístico actualizado exitosamente!');
            } else {
                await api.createSitioTuristico(formData);
                alert('¡Sitio turístico creado exitosamente!');
            }
            // Limpiar formulario y refrescar lista
            setFormData({ id: null, nombre: '', descripcion: '', ubicacion: '', urlImagen: '' });
            setIsEditing(false);
            fetchSitios();
        } catch (err) {
            setError(err.response?.data?.message || `Fallo al ${isEditing ? 'actualizar' : 'crear'} sitio.`);
            console.error(err);
        }
    };

    const handleEdit = (sitio) => {
        setFormData({
            id: sitio.id,
            nombre: sitio.nombre,
            descripcion: sitio.descripcion,
            ubicacion: sitio.ubicacion,
            urlImagen: sitio.url_imagen || '', // Asegurarse de que sea un string vacío si es null
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este sitio turístico?')) {
            setError('');
            try {
                await api.deleteSitioTuristico(id);
                alert('¡Sitio turístico eliminado exitosamente!');
                fetchSitios(); // Refrescar la lista
            } catch (err) {
                setError(err.response?.data?.message || 'Fallo al eliminar sitio.');
                console.error(err);
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando contenido...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
                {isEditing ? 'Editar Sitio Turístico' : 'Agregar Nuevo Sitio Turístico'}
            </h2>
            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '40px', background: '#f9f9f9' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre:</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px', boxSizing: 'border-box' }}></textarea>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ubicación:</label>
                    <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} required style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL de Imagen (Opcional):</label>
                    <input type="text" name="urlImagen" value={formData.urlImagen} onChange={handleChange} style={{ width: 'calc(100% - 16px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', marginRight: '10px', transition: 'background-color 0.3s ease' }}>
                    {isEditing ? 'Actualizar Sitio' : 'Agregar Sitio'}
                </button>
                {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: null, nombre: '', descripcion: '', ubicacion: '', urlImagen: '' }); }}
                        style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', transition: 'background-color 0.3s ease' }}>
                        Cancelar Edición
                    </button>
                )}
            </form>

            <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '30px', color: '#333' }}>Mis Sitios Turísticos ({user.role === 'guia_turistico' ? 'Creados por Mí' : 'Todos los Sitios'})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {sitios.length > 0 ? (
                    sitios.map(sitio => (
                        <div key={sitio.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', background: '#fff' }}>
                            {sitio.url_imagen && <img src={sitio.url_imagen} alt={sitio.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ marginBottom: '10px', color: '#007bff' }}>{sitio.nombre}</h3>
                                <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '10px' }}>{sitio.descripcion.substring(0, 100)}...</p>
                                <p style={{ fontWeight: 'bold', color: '#666' }}>Ubicación: {sitio.ubicacion}</p>
                                {sitio.nombre_creador && <p style={{ fontSize: '0.8em', color: '#777' }}>Creado por: {sitio.nombre_creador}</p>}
                                <div style={{ marginTop: '15px' }}>
                                    <button onClick={() => handleEdit(sitio)} style={{ background: '#ffc107', color: '#333', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', transition: 'background-color 0.3s ease' }}>Editar</button>
                                    <button onClick={() => handleDelete(sitio.id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No hay sitios turísticos {user.role === 'guia_turistico' ? 'creados por ti' : 'disponibles'} aún.</p>
                )}
            </div>
        </div>
    );
};

export default GestionContenidoGuia;