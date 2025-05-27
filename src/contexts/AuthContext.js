import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../api/api'; // Importar las funciones de la API

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await api.login(username, password);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Guardar el usuario en localStorage
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (username, email, password) => {
        const res = await api.register(username, email, password);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = () => {
        localStorage.removeItem('user'); // Eliminar usuario de localStorage
        setUser(null);
    };

    // Funciones para verificar roles
    const isAdmin = user && user.role === 'admin';
    const isGuiaTuristico = user && user.role === 'guia_turistico';
    const isAuthenticated = !!user; // Verdadero si hay un usuario logueado

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isGuiaTuristico, loading, login, register, logout }}>
            {!loading && children} {/* Renderizar solo cuando no está cargando */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); // Hook para usar el contexto