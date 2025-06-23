import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import useModal from '../../hooks/useModal';
import Modal from '../UI/Modal';
import Grid from '../UI/Grid';
import SaleForm from '../forms/SalesForm';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const SaleManager = () => {
    const [sales, setSales] = useState([]);
    const { isOpen, open, close } = useModal();
    const [selectedSale, setSelectedSale] = useState(null);
    const [saleDetails, setSaleDetails] = useState([]);

    const loadSales = () => {
        api.get('/sales')
            .then(res => setSales(res.data.data || []))
            .catch(err => console.error(err));
    };

    const loadSaleById = async (id) => {
        try {
            const [saleRes, detailRes] = await Promise.all([
                api.get(`/sales/${id}`),
                api.get(`/sale-details/${id}`)
            ]);

            setSelectedSale(saleRes.data.data || null);
            setSaleDetails(detailRes.data.data || []);
            open();
        } catch (err) {
            console.error('Error al cargar venta o detalles', err);
        }
    };

    const handleCreate = () => {
        setSelectedSale(null);
        setSaleDetails([]);
        open();
    };

    const handleEdit = (sale) => {
        if (sale?.id_venta) {
            loadSaleById(sale.id_venta);
        }
    };

    const handleDelete = (sale) => {
        Swal.fire({
            title: `¿Eliminar venta ID ${sale.id_venta}?`,
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(result => {
            if (result.isConfirmed) {
                api.delete(`/sales/${sale.id_venta}`)
                    .then(() => {
                        loadSales();
                        Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success');
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
                    });
            }
        });
    };

    const handleSave = () => {
        close();
        loadSales();
    };

    useEffect(() => {
        loadSales();
    }, []);

    const columns = [
        { key: 'id_venta', label: 'ID Venta' },
        { key: 'fecha_venta', label: 'Fecha' },
        { key: 'id_cliente', label: 'ID Cliente' },
        { key: 'total_venta', label: 'Total' },
        { key: 'metodo_pago', label: 'Método de Pago' }
    ];

    const actions = [
        {
            label: <FaEdit />,
            title: 'Editar',
            onClick: handleEdit,
            style: {
                fontSize: '1rem',
                color: '#2563eb',
                cursor: 'pointer',
                marginRight: '0.5rem'
            }
        },
        {
            label: <FaTrash />,
            title: 'Eliminar',
            onClick: handleDelete,
            style: {
                fontSize: '1rem',
                color: '#dc2626',
                cursor: 'pointer'
            }
        }
    ];

    return (
        <div style={outerContainerStyle}>
            <div style={innerContainerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Ventas</h1>
                    <button onClick={handleCreate} style={buttonStyle}>
                        <FaPlus style={{ marginRight: '0.5rem' }} />
                        Agregar Venta
                    </button>
                </div>
                <div style={gridWrapperStyle}>
                    <Grid columns={columns} data={sales} actions={actions} />
                </div>
            </div>
            <Modal
                open={isOpen}
                onClose={close}
                title={selectedSale ? 'Editar Venta' : 'Nueva Venta'}
                size="md"
            >
                <SaleForm
                    sale={selectedSale}
                    details={saleDetails}
                    onCancel={close}
                    onSave={handleSave}
                />
            </Modal>
        </div>
    );
};

const outerContainerStyle = {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '2rem 0',
    display: 'flex',
    justifyContent: 'center'
};

const innerContainerStyle = {
    width: '100%',
    maxWidth: '1100px',
    padding: '0 2rem'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
};

const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#111827'
};

const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s'
};

const gridWrapperStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden'
};

export default SaleManager;
