import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import useModal from '../../hooks/useModal';
import Modal from '../UI/Modal';
import ProviderForm from '../forms/ProviderForm';
import Grid from '../UI/Grid';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ProviderManager = () => {
    const [providers, setProviders] = useState([]);
    const { isOpen, open, close } = useModal();
    const [selectedProvider, setSelectedProvider] = useState(null);

    const mapProvider = (p) => ({
        idProveedor: p.Id_Proveedor,
        nombre: p.nombre,
        contacto: p.contacto,
        telefono: p.telefono
    });


    const loadProviders = () => {
        api.get('/providers')
            .then(res => setProviders((res.data.data || []).map(mapProvider)))
            .catch(err => console.error(err));
    };

    const handleCreate = () => {
        setSelectedProvider(null);
        open();
    };

    const handleEdit = (provider) => {
        setSelectedProvider(provider);
        open();
    };

    const handleDelete = (provider) => {
        Swal.fire({
            title: `¿Eliminar "${provider.nombre}"?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/providers/${provider.idProveedor}`)
                    .then(() => {
                        loadProviders();
                        Swal.fire('Eliminado', 'El proveedor ha sido eliminado.', 'success');
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire('Error', 'No se pudo eliminar el proveedor.', 'error');
                    });
            }
        });
    };

    const handleSaveProvider = (data) => {
        const isEditing = !!data.idProveedor;
        const endpoint = isEditing ? `/providers/${data.idProveedor}` : '/providers';
        const method = isEditing ? api.put : api.post;

        method(endpoint, data)
            .then(() => {
                close();
                loadProviders();
                Swal.fire({
                    icon: 'success',
                    title: isEditing ? 'Proveedor actualizado' : 'Proveedor creado',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar el proveedor.'
                });
            });
    };

    useEffect(() => {
        loadProviders();
    }, []);

    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'contacto', label: 'Contacto' },
        { key: 'telefono', label: 'Teléfono' }
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
                    <h1 style={titleStyle}>Catálogo de Proveedores</h1>
                    <button onClick={handleCreate} style={buttonStyle}>
                        <FaPlus style={{ marginRight: '0.5rem' }} />
                        Agregar Proveedor
                    </button>
                </div>
                <div style={gridWrapperStyle}>
                    <Grid columns={columns} data={providers} actions={actions} />
                </div>
            </div>
            <Modal
                open={isOpen}
                onClose={close}
                title={selectedProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                size="md"
            >
                <ProviderForm
                    provider={selectedProvider}
                    onSubmit={handleSaveProvider}
                    onCancel={close}
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

export default ProviderManager;
