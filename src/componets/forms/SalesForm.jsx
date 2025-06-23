import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SalesForm = ({ sale = {}, details = [], onSave, onCancel }) => {
    const safeSale = sale || {};

    const formik = useFormik({
        initialValues: {
            id_venta: safeSale.id_venta || 0,
            fecha_venta: safeSale.fecha_venta || '',
            id_cliente: safeSale.id_cliente ?? '',
            metodo_pago: safeSale.metodo_pago || '',
            total_venta: safeSale.total_venta || ''
        },
        validationSchema: Yup.object({
            fecha_venta: Yup.date().required('La fecha es obligatoria'),
            id_cliente: Yup.number()
                .typeError('Debe ser un número')
                .required('El cliente es obligatorio'),
            metodo_pago: Yup.string().required('El método de pago es obligatorio'),
            total_venta: Yup.number()
                .typeError('Debe ser un número')
                .required('El total es obligatorio'),
        }),
        onSubmit: (values) => {
            const payload = {
                ...values,
                id_cliente: parseInt(values.id_cliente, 10),
                total_venta: parseFloat(values.total_venta),
                fecha_venta: new Date(values.fecha_venta).toISOString().split('T')[0]
            };
            onSave(payload);
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} style={formStyle}>
            <div style={fieldGroup}>
                <label style={labelStyle}>Fecha de Venta</label>
                <input
                    type="date"
                    name="fecha_venta"
                    value={formik.values.fecha_venta}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.fecha_venta && formik.errors.fecha_venta && (
                    <div style={errorText}>{formik.errors.fecha_venta}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>ID Cliente</label>
                <input
                    type="number"
                    name="id_cliente"
                    value={formik.values.id_cliente}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.id_cliente && formik.errors.id_cliente && (
                    <div style={errorText}>{formik.errors.id_cliente}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Método de Pago</label>
                <input
                    type="text"
                    name="metodo_pago"
                    value={formik.values.metodo_pago}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.metodo_pago && formik.errors.metodo_pago && (
                    <div style={errorText}>{formik.errors.metodo_pago}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Total</label>
                <input
                    type="number"
                    name="total_venta"
                    value={formik.values.total_venta}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.total_venta && formik.errors.total_venta && (
                    <div style={errorText}>{formik.errors.total_venta}</div>
                )}
            </div>

            {details?.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Detalles:</h3>
                    <ul style={{ paddingLeft: '1rem' }}>
                        {details.map((d, i) => (
                            <li key={i}>
                                Producto ID: {d.id_producto}, Cantidad: {d.cantidad}, Precio: ${d.precio_unitario}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div style={{ marginTop: '1rem', fontStyle: 'italic', color: '#6b7280' }}>
                    Sin detalles para esta venta.
                </div>
            )}

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

export default SalesForm;
