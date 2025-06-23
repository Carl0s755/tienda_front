import React from 'react';
import { Link } from 'react-router-dom';

const items = [
    { label: 'Ventas', path: '/sales', icon: '🛒' },
    { label: 'Notificaciones', path: '/utils', icon: '🛠️' },
    { label: 'Catálogo de proveedores', path: '/provider', icon: '🚚' },
    { label: 'Reporte de ventas', path: '/report', icon: '📊' },
    { label: 'Catálogo de clientes', path: '/clients', icon: '🧑‍💼' },
    { label: 'Catálogo de productos', path: '/products', icon: '📦' },    


];

const HomePage = () => {
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>LA MODERNA</h1>
                <div style={styles.grid}>
                    {items.map((item, i) => (
                        <Link
                            to={item.path}
                            key={i}
                            style={styles.card}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#e0ecff';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <div style={styles.icon}>{item.icon}</div>
                            <div style={styles.label}>{item.label}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#e0e7ff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: '1.5rem',
        padding: '2rem',
        maxWidth: '900px',
        width: '100%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    },
    title: {
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '2rem',
        borderBottom: '2px solid #3b82f6',
        paddingBottom: '0.5rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        justifyItems: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        padding: '1rem',
        width: '140px',
        height: '140px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: '#1f2937',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.3s ease-in-out',
    },
    icon: {
        fontSize: '2.8rem',
        marginBottom: '0.5rem',
    },
    label: {
        fontWeight: '500',
        textAlign: 'center',
        fontSize: '1rem',
    },
};

export default HomePage;
