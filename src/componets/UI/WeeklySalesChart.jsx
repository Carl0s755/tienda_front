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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const WeeklySalesChart = () => {
    const [resumen, setResumen] = useState([]);
    const [detalles, setDetalles] = useState([]);

    useEffect(() => {
        const fetchWeeklySales = async () => {
            try {
                const res = await api.get('/sales-weekly-report');
                const data = res.data?.data ?? {};
                setResumen(data.resumen || []);
                setDetalles(data.detalles || []);
            } catch (error) {
                console.error('Error al obtener el reporte semanal:', error);
            }
        };

        fetchWeeklySales();
    }, []);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Reporte Semanal de Ventas', 14, 20);

        autoTable(doc, {
            startY: 30,
            head: [['Fecha', 'Total Ventas', 'Monto Total']],
            body: resumen.map(item => [
                item.FECHA,
                item.TOTAL_VENTAS,
                `$${parseFloat(item.TOTAL_MONTO).toFixed(2)}`
            ]),
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Fecha', 'Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
            body: detalles.map(item => [
                item.FECHA,
                item.PRODUCTO,
                item.CANTIDAD,
                `$${parseFloat(item.PRECIO_UNITARIO).toFixed(2)}`,
                `$${parseFloat(item.SUBTOTAL).toFixed(2)}`
            ]),
        });

        doc.save('reporte_semanal.pdf');
    };

    if (!resumen.length) {
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
                <BarChart data={resumen} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="FECHA" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="TOTAL_MONTO" name="Monto Total" fill="#2563eb" />
                    <Bar dataKey="TOTAL_VENTAS" name="Ventas" fill="#f97316" />
                </BarChart>
            </ResponsiveContainer>

            <div style={styles.buttonContainer}>
                <button onClick={handleDownloadPDF} style={styles.button}>
                    Generar PDF
                </button>
            </div>
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
    buttonContainer: {
        marginTop: '1.5rem',
        textAlign: 'center',
    },
    button: {
        padding: '0.6rem 1.2rem',
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
};

export default WeeklySalesChart;
