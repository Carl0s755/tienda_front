import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import { FaCashRegister } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

        const handler = () => fetchData();
        window.addEventListener('venta-registrada', handler);

        return () => window.removeEventListener('venta-registrada', handler);
    }, []);

    const generatePDF = async () => {
        try {
            const res = await api.get('/sales-report-data');
            const { ventas, detalles } = res.data.data;

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Corte de Caja - Ventas del Día', 14, 20);

            ventas.forEach((venta, index) => {
                const yStart = 30 + index * 70;

                doc.setFontSize(12);
                doc.text(`Venta ID: ${venta.ID_VENTA}`, 14, yStart);
                doc.text(`Cliente: ${venta.CLIENTE}`, 14, yStart + 6);
                doc.text(`Fecha: ${venta.FECHA}`, 14, yStart + 12);
                doc.text(`Método de Pago: ${venta.METODO_PAGO}`, 14, yStart + 18);
                doc.text(`Total: $${venta.TOTAL_VENTA}`, 14, yStart + 24);

                const detallesVenta = detalles.filter(d => d.ID_VENTA === venta.ID_VENTA);

                autoTable(doc, {
                    startY: yStart + 30,
                    head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
                    body: detallesVenta.map(d => [
                        d.PRODUCTO,
                        d.CANTIDAD,
                        `$${parseFloat(d.PRECIO_UNITARIO).toFixed(2)}`,
                        `$${parseFloat(d.SUBTOTAL).toFixed(2)}`
                    ]),
                    theme: 'grid',
                    styles: { fontSize: 10 }
                });
            });

            doc.save('corte_caja.pdf');
        } catch (error) {
            console.error('Error al generar PDF:', error);
        }
    };

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
                        <button onClick={generatePDF} style={button}>Generar PDF</button>
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
    width: '240px',
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

const button = {
    marginTop: '0.75rem',
    backgroundColor: 'white',
    color: '#2563eb',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

export default SalesSummaryWidget;
