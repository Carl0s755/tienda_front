import React, { useEffect, useRef } from 'react';
import Header from './Header';
import { toast } from 'react-toastify';
import api from '../../services/axios/axios';
import SalesSummaryWidget from "./SalesSummaryWidget";

const MainLayout = ({ children, showHeader = true }) => {
    const alreadyFetched = useRef(false);

    useEffect(() => {
        if (alreadyFetched.current) return;

        const fetchStockAlerts = async () => {
            try {
                const res = await api.get('/stock-alerts');
                const alerts = res.data?.data || [];

                if (alerts.length > 0) {
                    toast.warning(`⚠️ Hay productos con stock bajo`, {
                        autoClose: 4000
                    });

                    alerts.forEach(product => {
                        if (product?.nombre && product?.id_producto && product?.stock !== undefined) {
                            toast.info(`🧾 ${product.nombre} (ID: ${product.id_producto}) tiene ${product.stock} unidades`, {
                                position: 'bottom-right',
                                autoClose: 5000
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('Error al cargar alertas de stock:', error);
            }
        };

        const fetchExpirationAlerts = async () => {
            try {
                const res = await api.get('/expiration-alerts');
                const alerts = res.data?.data || [];

                if (alerts.length > 0) {
                    toast.warning(`⚠️ Hay productos próximos a caducar`, {
                        autoClose: 4000
                    });

                    alerts.forEach(product => {
                        if (product?.nombre && product?.id_producto && product?.fecha_caducidad) {
                            toast.info(`📅 ${product.nombre} (ID: ${product.id_producto}) caduca el ${product.fecha_caducidad}`, {
                                position: 'bottom-right',
                                autoClose: 5000
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('Error al cargar alertas de caducidad:', error);
            }
        };

        fetchStockAlerts();
        fetchExpirationAlerts();
        alreadyFetched.current = true;
    }, []);

    return (
        <div>
            {showHeader && <Header />}
            <main>{children}</main>
            <SalesSummaryWidget />
        </div>
    );
};

export default MainLayout;
