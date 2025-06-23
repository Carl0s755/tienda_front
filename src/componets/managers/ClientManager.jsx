import React, { useEffect, useState } from 'react';
import api from '../../services/axios/axios';
import useModal from '../../hooks/useModal';
import Modal from '../UI/Modal';
import ClientForm from '../forms/ClientForm';
import Grid from "../UI/Grid";
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ClientManager = () => {
    const [clients, setClients] = useState([]);
    const { isOpen, open, close } = useModal();
    const [selectedClient, setSelectedClient] = useState(null);

    const loadClients = () => {
        api.get('/clients')
            .then(res => setClients(res.data.data || []))
            .catch(err => console.error('Error cargando clientes:', err));
    };

    const handleCreate = () => {
        setSelectedClient(null);
        open();
    };

    const handleEdit = (client) => {
        const mappedClient = {
            id_cliente: client.ID_CLIENTE,
            nombre: client.NOMBRE,
            email: client.EMAIL,
            telefono: client.TELEFONO
        };
        setSelectedClient(mappedClient);
        open();
    };

    const handleDelete = (client) => {
        Swal.fire({
            title: `¿Eliminar "${client.nombre}"?`,
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/clients/${client.Id_Cliente}`)
                    .then(() => {
                        loadClients();
                        Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
                    })
                    .catch((err) => {
                        console.error(err);
                        Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
                    });
            }
        });
    };

    const handleSaveClient = (data) => {
        const clientId = data.id_cliente;
        const endpoint = clientId && clientId !== 0 ? `/clients/${clientId}` : '/clients';
        const method = clientId && clientId !== 0 ? api.put : api.post;

        const payload = {
            Id_Cliente: data.id_cliente,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono
        };

        method(endpoint, payload)
            .then(() => {
                close();
                loadClients();
                Swal.fire({
                    icon: 'success',
                    title: clientId ? 'Cliente actualizado' : 'Cliente creado',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar el cliente.'
                });
            });
    };

    useEffect(() => {
        loadClients();
    }, []);

    const columns = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'email', label: 'Correo' },
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
                    <h1 style={titleStyle}>Catálogo de Clientes</h1>
                    <button
                        onClick={handleCreate}
                        style={buttonStyle}
                    >
                        <FaPlus style={{ marginRight: '0.5rem' }} />
                        Agregar Cliente
                    </button>
                </div>
                <div style={gridWrapperStyle}>
                    <Grid columns={columns} data={clients} actions={actions} />
                </div>
            </div>
            <Modal
                open={isOpen}
                onClose={close}
                title={selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                size="md"
            >
                <ClientForm
                    client={selectedClient}
                    onCancel={close}
                    onSubmit={handleSaveClient}
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

export default ClientManager;
