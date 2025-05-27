import React, { useEffect, useState } from 'react';
import * as api from '../api/api';
import { useAuth } from '../contexts/AuthContext'; // Para obtener el usuario actual

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user: currentUser } = useAuth(); // Usuario actualmente logueado (admin)

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.getAllUsers();
            setUsers(response.data);
            setError(''); // Limpiar errores previos
        } catch (err) {
            setError(err.response?.data?.message || 'Fallo al cargar usuarios.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        // Prevenir que un admin cambie su propio rol
        if (userId === currentUser.id) {
            setError("No puedes cambiar tu propio rol.");
            return;
        }

        try {
            await api.updateUserRole(userId, newRole);
            setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
            alert('Rol de usuario actualizado exitosamente.');
        } catch (err) {
            setError(err.response?.data?.message || 'Fallo al actualizar el rol del usuario.');
            console.error(err);
        }
    };

    const handleDeleteUser = async (userId) => {
        // Prevenir que un admin se elimine a sí mismo
        if (userId === currentUser.id) {
            setError("No puedes eliminar tu propia cuenta.");
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar a este usuario? Esto eliminará todos los sitios turísticos creados por él si los tiene.')) {
            try {
                await api.deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));
                alert('Usuario eliminado exitosamente.');
            } catch (err) {
                setError(err.response?.data?.message || 'Fallo al eliminar el usuario.');
                console.error(err);
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando panel de administrador...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Panel de Administración - Gestión de Usuarios</h2>
            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Nombre de Usuario</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Rol</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Fecha de Creación</th>
                        <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.username}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    disabled={user.id === currentUser.id} // Deshabilitar cambio de rol para el usuario actual
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                >
                                    <option value="publico">publico</option>
                                    <option value="admin">admin</option>
                                    <option value="guia_turistico">guia_turistico</option>
                                </select>
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: user.id === currentUser.id ? 'not-allowed' : 'pointer' }}
                                    disabled={user.id === currentUser.id} // Deshabilitar eliminación para el usuario actual
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;