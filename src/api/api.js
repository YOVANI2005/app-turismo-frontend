import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // URL base de tu API
});

// Interceptor para añadir el token JWT a cada solicitud
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario del almacenamiento local
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`; // Añadir el token a la cabecera de autorización
    }
    return config;
});

// Funciones para interactuar con los endpoints de autenticación
export const login = (username, password) => API.post('/auth/login', { username, password });
export const register = (username, email, password) => API.post('/auth/register', { username, email, password });

// Funciones para interactuar con los endpoints de gestión de usuarios (solo para Admin)
export const getAllUsers = () => API.get('/users');
export const updateUserRole = (id, role) => API.put(`/users/${id}`, { role });
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Funciones para interactuar con los endpoints de sitios turísticos
export const getSitiosTuristicos = () => API.get('/sitios-turisticos');
export const getSitioTuristicoById = (id) => API.get(`/sitios-turisticos/${id}`);
export const createSitioTuristico = (data) => API.post('/sitios-turisticos', data);
export const updateSitioTuristico = (id, data) => API.put(`/sitios-turisticos/${id}`, data);
export const deleteSitioTuristico = (id) => API.delete(`/sitios-turisticos/${id}`);

export default API;