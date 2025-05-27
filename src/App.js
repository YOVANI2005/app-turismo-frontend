import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Importar AuthProvider y useAuth

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VistaPublicaSitios from './pages/VistaPublicaSitios';
import DetalleSitioTuristico from './pages/DetalleSitioTuristico';
import AdminDashboard from './pages/AdminDashboard';
import GestionContenidoGuia from './pages/GestionContenidoGuia';
import NotFoundPage from './pages/NotFoundPage';

// Componente para rutas protegidas
const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>; // O un spinner de carga
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Redirigir al login si no está autenticado
    }

    // Si se especifican roles, verificar si el usuario tiene alguno de ellos
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />; // Redirigir a la página de inicio o a una página de no autorizado
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header /> {/* Componente de cabecera */}
                <main style={{ padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/sitios" element={<VistaPublicaSitios />} />
                        <Route path="/sitios/:id" element={<DetalleSitioTuristico />} />

                        {/* Rutas protegidas */}
                        <Route path="/admin" element={
                            <PrivateRoute roles={['admin']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/gestion-contenido" element={
                            <PrivateRoute roles={['guia_turistico', 'admin']}>
                                <GestionContenidoGuia />
                            </PrivateRoute>
                        } />

                        {/* Ruta para manejar URLs no encontradas */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer /> {/* Componente de pie de página */}
            </Router>
        </AuthProvider>
    );
}

// Componente de Cabecera (Header)
const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    return (
        <nav style={{ background: '#333', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2em' }}>Travel Colombia</Link>
            <div>
                <Link to="/sitios" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px' }}>Sitios Públicos</Link>
                {isAuthenticated ? (
                    <>
                        {user.role === 'admin' && (
                            <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px' }}>Panel Admin</Link>
                        )}
                        {(user.role === 'guia_turistico' || user.role === 'admin') && (
                            <Link to="/gestion-contenido" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px' }}>Gestionar Contenido</Link>
                        )}
                        <span style={{ marginLeft: '15px' }}>Bienvenido, {user.username} ({user.role})</span>
                        <button onClick={logout} style={{ marginLeft: '15px', padding: '5px 10px', cursor: 'pointer', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px' }}>Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px' }}>Iniciar Sesión</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none', marginLeft: '15px' }}>Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

// Componente de Pie de Página (Footer) - Opcional, pero bueno para la estructura
const Footer = () => {
    return (
        <footer style={{ background: '#333', color: '#fff', textAlign: 'center', padding: '10px 0', position: 'relative', bottom: '0', width: '100%' }}>
            <p>&copy; {new Date().getFullYear()} Travel Colombia. Todos los derechos reservados.</p>
        </footer>
    );
};

export default App; // Este comentario fuerza un redeploy en Vercel

