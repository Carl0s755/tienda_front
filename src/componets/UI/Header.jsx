import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Inicio', path: '/home' },
        { label: 'Clientes', path: '/clients' },
        { label: 'Productos', path: '/products' },
        { label: 'Ventas', path: '/sales' },
    ];

    return (
        <header style={styles.header}>
            <div style={styles.inner}>
                <h1 style={styles.logo}>🛍️ Tienda La Moderna</h1>
                <nav style={styles.nav}>
                    {navItems.map((item, i) => (
                        <Link
                            key={i}
                            to={item.path}
                            style={{
                                ...styles.link,
                                ...(location.pathname === item.path ? styles.active : {}),
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: '#111827',
        padding: '0.75rem 0', // vertical solamente
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    inner: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem', // 👉 espacio a los lados
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        color: '#f9fafb',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    nav: {
        display: 'flex',
        gap: '1rem',
    },
    link: {
        color: '#d1d5db',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s ease',
    },
    active: {
        color: '#3b82f6',
        borderBottom: '2px solid #3b82f6',
        paddingBottom: '0.2rem',
    },
};

export default Header;
