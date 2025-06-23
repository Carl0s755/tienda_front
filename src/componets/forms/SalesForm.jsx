import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SaleForm = ({ sale = null, onSubmit, onCancel, clients = [] }) => {
    const formik = useFormik({
        initialValues: {
            Id_Venta: sale?.Id_Venta || 0,
            fecha_venta: sale?.fecha_venta || '',
            total_venta: sale?.total_venta || '',
            Id_Cliente: sale?.Id_Cliente?.toString() || '',
            metodo_pago: sale?.metodo_pago || ''
        },
        validationSchema: Yup.object({
            fecha_venta: Yup.date().required('La fecha es obligatoria'),
            total_venta: Yup.number().typeError('Debe ser un número').required('El total es obligatorio'),
            Id_Cliente: Yup.string().required('El cliente es obligatorio'), // <- validación como string
            metodo_pago: Yup.string().required('El método de pago es obligatorio')
        }),
        onSubmit: onSubmit,
        enableReinitialize: true
    });

    return (
        <form onSubmit={formik.handleSubmit} style={formStyle}>
            <input type="hidden" name="Id_Venta" value={formik.values.Id_Venta} />

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
                <label style={labelStyle}>Total</label>
                <input
                    type="text"
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

            <div style={fieldGroup}>
                <label style={labelStyle}>Cliente</label>
                <select
                    name="Id_Cliente"
                    value={formik.values.Id_Cliente}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                >
                    <option value="">Seleccione un cliente</option>
                    {clients.map(c => (
                        <option key={c.ID_CLIENTE} value={c.ID_CLIENTE}>
                            {c.NOMBRE}
                        </option>
                    ))}
                </select>
                {formik.touched.Id_Cliente && formik.errors.Id_Cliente && (
                    <div style={errorText}>{formik.errors.Id_Cliente}</div>
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

            <div style={buttonGroup}>
                <button type="submit" style={submitButtonStyle}>Guardar</button>
                <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancelar</button>
            </div>
        </form>
    );
};


const formStyle = { width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldGroup = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontWeight: '600', marginBottom: '0.4rem', color: '#1f2937', fontSize: '0.95rem' };
const inputStyle = { padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem' };
const errorText = { marginTop: '0.25rem', color: '#dc2626', fontSize: '0.875rem' };
const buttonGroup = { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' };
const submitButtonStyle = { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' };
const cancelButtonStyle = { backgroundColor: '#e5e7eb', color: '#111827', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' };

export default SaleForm;
