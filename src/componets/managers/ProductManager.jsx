import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import useModal from '../../hooks/useModal';
import Modal from '../UI/Modal';
import ProductForm from '../forms/ProductForm';
import Grid from "../UI/Grid";
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const { isOpen, open, close } = useModal();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = () => {
        api.get('/products')
            .then(res => setProducts(res.data.data || []))
            .catch(err => console.error(err));
    };

    const loadProveedores = () => {
        api.get('/providers/list')
            .then(res => setProveedores(res.data.data || []))
            .catch(err => console.error('Error cargando proveedores:', err));
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        open();
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        open();
    };

    const handleDelete = (product) => {
        Swal.fire({
            title: `¿Eliminar "${product.nombre}"?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/products/${product.Id_Producto}`)
                    .then(() => {
                        loadProducts();
                        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
                    });
            }
        });
    };

    const handleSaveProduct = (data) => {
        const productId = selectedProduct?.Id_Producto;
        const endpoint = productId ? `/products/${parseInt(productId)}` : '/products';
        const method = productId ? api.put : api.post;

        method(endpoint, data)
            .then(() => {
                close();
                loadProducts();
                Swal.fire({
                    icon: 'success',
                    title: productId ? 'Producto actualizado' : 'Producto creado',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar el producto.'
                });
            });
    };

    useEffect(() => {
        loadProducts();
        loadProveedores();
    }, []);

    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'precio_unitario', label: 'Precio Unitario' },
        { key: 'stock', label: 'Stock' },
        { key: 'fecha_caducidad', label: 'Fecha de Caducidad' },
        { key: 'Id_Proveedor', label: 'Proveedor' }
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
                    <h1 style={titleStyle}>Catálogo de Productos</h1>
                    <button
                        onClick={handleCreate}
                        style={buttonStyle}
                    >
                        <FaPlus style={{ marginRight: '0.5rem' }} />
                        Agregar Producto
                    </button>
                </div>
                <div style={gridWrapperStyle}>
                    <Grid columns={columns} data={products} actions={actions} />
                </div>
            </div>
            <Modal
                open={isOpen}
                onClose={close}
                title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                size="md"
            >
                <ProductForm
                    product={selectedProduct}
                    onCancel={close}
                    onSubmit={handleSaveProduct}
                    proveedores={proveedores}
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

export default ProductManager;
