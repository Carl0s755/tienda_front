import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import { FaCashRegister } from 'react-icons/fa';

const SalesSummaryWidget = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/sales-today');
                setSummary(res.data?.data ?? null);
            } catch (error) {
                console.error('Error al obtener resumen de ventas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return null;

    return (
        <div style={widgetContainer}>
            <div style={widgetBox}>
                <div style={header}>
                    <FaCashRegister style={{ marginRight: '0.5rem' }} />
                    Ventas del día
                </div>
                {summary && summary.TOTAL_DIA ? (
                    <div style={info}>
                        <div>Total: <strong>${parseFloat(summary.TOTAL_DIA).toFixed(2)}</strong></div>
                        <div>Ventas: <strong>{summary.TOTAL_VENTAS}</strong></div>
                    </div>
                ) : (
                    <div style={info}>Aún no hay ventas registradas</div>
                )}
            </div>
        </div>
    );
};

const widgetContainer = {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    zIndex: 1000,
};

const widgetBox = {
    backgroundColor: '#2563eb',
    color: 'white',
    borderRadius: '0.75rem',
    padding: '1rem',
    width: '220px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
};

const header = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
};

const info = {
    fontSize: '0.95rem',
    lineHeight: '1.4',
};

export default SalesSummaryWidget;
