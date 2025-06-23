import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ClientForm = ({ client = {}, onSubmit, onCancel }) => {
    const formik = useFormik({
        initialValues: {
            Id_Cliente: client.Id_Cliente || 0,
            nombre: client.nombre || '',
            email: client.email || '',
            telefono: client.telefono || ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            email: Yup.string().email('Formato de email inválido').required('El email es obligatorio'),
            telefono: Yup.string().required('El teléfono es obligatorio')
        }),
        onSubmit: (values) => {
            onSubmit(values);
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} style={formStyle}>
            <div style={fieldGroup}>
                <label style={labelStyle}>Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                    <div style={errorText}>{formik.errors.nombre}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.email && formik.errors.email && (
                    <div style={errorText}>{formik.errors.email}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Teléfono</label>
                <input
                    type="text"
                    name="telefono"
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.telefono && formik.errors.telefono && (
                    <div style={errorText}>{formik.errors.telefono}</div>
                )}
            </div>

            <div style={buttonGroup}>
                <button type="submit" style={submitButtonStyle}>Guardar</button>
                <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancelar</button>
            </div>
        </form>
    );
};

// Estilos
const formStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const fieldGroup = {
    display: 'flex',
    flexDirection: 'column'
};

const labelStyle = {
    fontWeight: '600',
    marginBottom: '0.4rem',
    color: '#1f2937',
    fontSize: '0.95rem'
};

const inputStyle = {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem'
};

const errorText = {
    marginTop: '0.25rem',
    color: '#dc2626',
    fontSize: '0.875rem'
};

const buttonGroup = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem'
};

const submitButtonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer'
};

const cancelButtonStyle = {
    backgroundColor: '#e5e7eb',
    color: '#111827',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer'
};

export default ClientForm;
