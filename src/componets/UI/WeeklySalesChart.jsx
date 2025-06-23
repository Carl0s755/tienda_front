import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend
} from 'recharts';

const WeeklySalesChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchWeeklySales = async () => {
            try {
                const res = await api.get('/sales-weekly');
                setData(res.data?.data || []);
            } catch (error) {
                console.error('Error al obtener el reporte semanal:', error);
            }
        };

        fetchWeeklySales();
    }, []);

    if (!data.length) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Reporte Semanal de Ventas</h2>
                <p style={styles.noData}>No hay ventas registradas en la última semana.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Reporte Semanal de Ventas</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="FECHA" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="TOTAL_MONTO" name="Monto Total" fill="#2563eb" />
                    <Bar dataKey="TOTAL_VENTAS" name="Ventas" fill="#f97316" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '1rem',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: '#1f2937',
        textAlign: 'center',
    },
    noData: {
        textAlign: 'center',
        color: '#6b7280',
        fontStyle: 'italic',
    },
};

export default WeeklySalesChart;
