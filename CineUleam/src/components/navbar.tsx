import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/usuario.context';
import { authService } from '../services/auth.service';
import { LogOut, Home, Film, Users, Menu, X, Edit, Calendar } from 'lucide-react';
import { useState } from 'react';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await authService.singOut();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const isActive = (path: string) => {
        // Para salas, activo si es /salas o cualquier ruta que comience con /salas/
        if (path === '/salas') {
            return location.pathname === '/salas' || location.pathname.startsWith('/salas/');
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    if (loading) {
        return null;
    }

    // Don't show navbar on login/register pages
    if (!user && (location.pathname === '/' || location.pathname === '/register')) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/logoUleam.png" alt="Logo ULEAM" className="navbar-logo-img" />
                    <span className="navbar-logo-text">Cine ULEAM</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="navbar-menu">
                    {user ? (
                        <>
                            <li className="navbar-item">
                                <Link 
                                    to="/home" 
                                    className={`navbar-link ${isActive('/home') ? 'active' : ''}`}
                                >
                                    <Home size={20} />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            {user.rol ? (
                                <>
                                    <li className="navbar-item">
                                        <Link 
                                            to="/subir-peliculas" 
                                            className={`navbar-link ${isActive('/subir-peliculas') ? 'active' : ''}`}
                                        >
                                            <Film size={20} />
                                            <span>Subir Películas</span>
                                        </Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link 
                                            to="/editar-peliculas" 
                                            className={`navbar-link ${isActive('/editar-peliculas') ? 'active' : ''}`}
                                        >
                                            <Edit size={20} />
                                            <span>Editar Películas</span>
                                        </Link>
                                    </li>
                                    <li className="navbar-item">
                                        <Link 
                                            to="/salas" 
                                            className={`navbar-link ${isActive('/salas') ? 'active' : ''}`}
                                        >
                                            <Users size={20} />
                                            <span>Salas</span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <li className="navbar-item">
                                    <Link 
                                        to="/reservar" 
                                        className={`navbar-link ${isActive('/reservar') ? 'active' : ''}`}
                                    >
                                        <Calendar size={20} />
                                        <span>Mis Reservas</span>
                                    </Link>
                                </li>
                            )}
                            <li className="navbar-item">
                                <button 
                                    onClick={handleLogout}
                                    className="navbar-link navbar-logout"
                                >
                                    <LogOut size={20} />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </li>
                            <li className="navbar-item navbar-user">
                                <span className="navbar-user-email">{user.email}</span>
                                {user.rol && (
                                    <span className="navbar-user-badge">Admin</span>
                                )}
                            </li>
                        </>
                    ) : (
                        <li className="navbar-item">
                            <Link 
                                to="/" 
                                className="navbar-link"
                            >
                                <span>Iniciar Sesión</span>
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                {user && (
                    <button 
                        className="navbar-mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}
            </div>

            {/* Mobile Menu */}
            {user && isMobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    <Link 
                        to="/home" 
                        className={`navbar-mobile-link ${isActive('/home') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Home size={20} />
                        <span>Inicio</span>
                    </Link>
                    {user.rol ? (
                        <>
                            <Link 
                                to="/subir-peliculas" 
                                className={`navbar-mobile-link ${isActive('/subir-peliculas') ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Film size={20} />
                                <span>Subir Películas</span>
                            </Link>
                            <Link 
                                to="/editar-peliculas" 
                                className={`navbar-mobile-link ${isActive('/editar-peliculas') ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Edit size={20} />
                                <span>Editar Películas</span>
                            </Link>
                            <Link 
                                to="/salas" 
                                className={`navbar-mobile-link ${isActive('/salas') ? 'active' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Users size={20} />
                                <span>Salas</span>
                            </Link>
                        </>
                    ) : (
                        <Link 
                            to="/reservar" 
                            className={`navbar-mobile-link ${isActive('/reservar') ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Calendar size={20} />
                            <span>Mis Reservas</span>
                        </Link>
                    )}
                    <div className="navbar-mobile-user">
                        <span className="navbar-mobile-user-email">{user.email}</span>
                        {user.rol && (
                            <span className="navbar-mobile-user-badge">Admin</span>
                        )}
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="navbar-mobile-link navbar-mobile-logout"
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

