import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import useModal from '../../hooks/useModal';
import Modal from '../UI/Modal';
import Grid from "../UI/Grid";
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import SaleForm from "../forms/SalesForm";

const SaleManager = () => {
    const [sales, setSales] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const { isOpen, open, close } = useModal();
    const [selectedSale, setSelectedSale] = useState(null);

    const loadSales = () => {
        api.get('/sales')
            .then(res => setSales(res.data.data || []))
            .catch(err => console.error(err));
    };

    const loadClients = () => {
        api.get('/drops/clients')
            .then(res => setClients(res.data.data || []))
            .catch(err => console.error('Error cargando clientes:', err));
    };

    const loadProducts = () => {
        api.get('/drops/products')
            .then(res => setProducts(res.data.data || []))
            .catch(err => console.error('Error cargando productos:', err));
    };

    const handleCreate = () => {
        setSelectedSale(null);
        open();
    };

    const handleDelete = (sale) => {
        Swal.fire({
            title: `¿Eliminar venta #${sale.Id_Venta}?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/sales/${sale.Id_Venta}`)
                    .then(() => {
                        loadSales();
                        Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success');
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire('Error', 'No se pudo eliminar la venta.', 'error');
                    });
            }
        });
    };

    const handleGenerateTicket = (sale) => {
        api.get(`/sales-ticket/${sale.Id_Venta}`)
            .then(res => {
                const venta = res.data.data.venta;
                const detalles = res.data.data.detalles;

                const doc = new jsPDF({
                    unit: 'mm',
                    format: [80, 150],
                });

                let y = 10;

                doc.setFontSize(12);
                doc.setFont('courier', 'normal');
                doc.text("Tienda La Moderna", 40, y, { align: 'center' });
                y += 6;

                doc.setFontSize(10);
                doc.text("------------------------------", 40, y, { align: 'center' });
                y += 5;

                doc.text(`Venta: ${venta.ID_VENTA}`, 10, y); y += 5;
                doc.text(`Fecha: ${venta.FECHA}`, 10, y); y += 5;
                doc.text(`Cliente: ${venta.CLIENTE}`, 10, y); y += 5;
                doc.text(`Pago: ${venta.METODO_PAGO}`, 10, y); y += 6;

                doc.text("PRODUCTOS", 40, y, { align: 'center' }); y += 5;
                doc.text("------------------------------", 40, y, { align: 'center' }); y += 5;

                detalles.forEach((p, i) => {
                    doc.text(`${p.PRODUCTO}`, 10, y); y += 4;
                    doc.text(`  ${p.CANTIDAD} x $${p.PRECIO_UNITARIO} = $${p.SUBTOTAL}`, 10, y); y += 5;
                });

                doc.text("------------------------------", 40, y, { align: 'center' }); y += 6;
                doc.setFontSize(11);
                doc.text(`TOTAL: $${venta.TOTAL_VENTA}`, 10, y); y += 6;

                doc.setFontSize(9);
                doc.text("Gracias por su compra", 40, y, { align: 'center' }); y += 5;
                doc.text("Tienda La Moderna", 40, y, { align: 'center' });

                doc.save(`ticket_venta_${venta.ID_VENTA}.pdf`);
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'No se pudo generar el ticket.', 'error');
            });
    };



    const handleSaveSale = (data) => {
        const saleId = selectedSale?.Id_Venta;
        const endpoint = saleId ? `/sales/${parseInt(saleId)}` : '/sales';
        const method = saleId ? api.put : api.post;

        const mappedData = {
            Id_Cliente: data.Id_Cliente && !isNaN(parseInt(data.Id_Cliente))
                ? parseInt(data.Id_Cliente)
                : null,
            fecha_venta: data.fecha_venta,
            metodo_pago: data.metodo_pago || null,
            detalles: (data.detalles || []).map(det => ({
                id_producto: parseInt(det.id_producto),
                cantidad: parseFloat(det.cantidad),
                precio_unitario: parseFloat(det.precio_unitario)
            }))
        };

        if (!mappedData.Id_Cliente) {
            Swal.fire({
                icon: 'warning',
                title: 'Cliente requerido',
                text: 'Debes seleccionar un cliente antes de guardar la venta.'
            });
            return;
        }

        if (!mappedData.detalles.length) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin productos',
                text: 'Agrega al menos un producto a la venta.'
            });
            return;
        }

        method(endpoint, mappedData)
            .then(() => {
                close();
                loadSales();
                Swal.fire({
                    icon: 'success',
                    title: saleId ? 'Venta actualizada' : 'Venta registrada',
                    showConfirmButton: false,
                    timer: 1500
                });
                window.dispatchEvent(new Event('venta-registrada'));
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar la venta.'
                });
            });
    };

    useEffect(() => {
        loadSales();
        loadClients();
        loadProducts();
    }, []);

    const columns = [
        { key: 'fecha_venta', label: 'Fecha' },
        { key: 'metodo_pago', label: 'Metodo de pago' },
        { key: 'total_venta', label: 'Total' }
    ];

    const actions = [
        {
            label: <FaFilePdf />,
            title: 'Generar ticket',
            onClick: handleGenerateTicket,
            style: {
                fontSize: '1rem',
                color: '#059669',
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
                    <h1 style={titleStyle}>Registro de Ventas</h1>
                    <button onClick={handleCreate} style={buttonStyle}>
                        <FaPlus style={{ marginRight: '0.5rem' }} />
                        Nueva Venta
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
                    onCancel={close}
                    onSubmit={handleSaveSale}
                    clients={clients}
                    products={products}
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
