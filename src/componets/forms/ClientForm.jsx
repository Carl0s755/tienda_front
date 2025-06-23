import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ClientForm = ({ client = null, onSubmit, onCancel }) => {
    const formik = useFormik({
        initialValues: {
            id_cliente: client?.id_cliente || 0,
            nombre: client?.nombre || '',
            email: client?.email || '',
            telefono: client?.telefono || ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            email: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
            telefono: Yup.string().required('El teléfono es obligatorio')
        }),
        onSubmit: onSubmit,
        enableReinitialize: true
    });

    const fields = [
        { name: 'nombre', label: 'Nombre' },
        { name: 'email', label: 'Correo' },
        { name: 'telefono', label: 'Teléfono' }
    ];

    return (
        <form onSubmit={formik.handleSubmit} style={formStyle}>
            <input type="hidden" name="id_cliente" value={formik.values.id_cliente || 0} />
            {fields.map(({ name, label }) => (
                <div style={fieldGroup} key={name}>
                    <label style={labelStyle}>{label}</label>
                    <input
                        type="text"
                        name={name}
                        value={formik.values[name] || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={inputStyle}
                    />
                    {formik.touched[name] && formik.errors[name] && (
                        <div style={errorText}>{formik.errors[name]}</div>
                    )}
                </div>
            ))}

            <div style={buttonGroup}>
                <button type="submit" style={submitButtonStyle}>Guardar</button>
                <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancelar</button>
            </div>
        </form>
    );
};

const formStyle = {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
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
