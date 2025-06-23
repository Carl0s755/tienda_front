import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProductForm = ({ product = null, onSubmit, onCancel, proveedores = [] }) => {
    const formik = useFormik({
        initialValues: {
            Id_Producto : product.Id_Producto || 0,
            nombre: product?.nombre || '',
            descripcion: product?.descripcion || '',
            precio_unitario: product?.precio_unitario || '',
            stock: product?.stock || '',
            fecha_caducidad: product?.fecha_caducidad || '',
            id_proveedor: product?.id_proveedor || ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            descripcion: Yup.string().required('La descripción es obligatoria'),
            precio_unitario: Yup.number().typeError('Debe ser un número').required('El precio es obligatorio'),
            stock: Yup.number().integer('Debe ser un número entero').required('El stock es obligatorio'),
            fecha_caducidad: Yup.date().required('La fecha es obligatoria'),
            id_proveedor: Yup.number().typeError('Selecciona un proveedor').required('El proveedor es obligatorio')
        }),
        onSubmit: (values) => {
            const payload = {
                ...values,
                precio_unitario: parseFloat(values.precio_unitario),
                stock: parseInt(values.stock, 10),
                id_proveedor: parseInt(values.id_proveedor, 10),
                fecha_caducidad: new Date(values.fecha_caducidad).toISOString().split('T')[0] // ← aquí se asegura el formato YYYY-MM-DD
            };

            onSubmit(payload);
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
                <label style={labelStyle}>Descripción</label>
                <textarea
                    name="descripcion"
                    value={formik.values.descripcion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                />
                {formik.touched.descripcion && formik.errors.descripcion && (
                    <div style={errorText}>{formik.errors.descripcion}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Precio</label>
                <input
                    type="text"
                    name="precio_unitario"
                    value={formik.values.precio_unitario}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.precio_unitario && formik.errors.precio_unitario && (
                    <div style={errorText}>{formik.errors.precio_unitario}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Stock</label>
                <input
                    type="text"
                    name="stock"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.stock && formik.errors.stock && (
                    <div style={errorText}>{formik.errors.stock}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Fecha de caducidad</label>
                <input
                    type="date"
                    name="fecha_caducidad"
                    value={formik.values.fecha_caducidad}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                />
                {formik.touched.fecha_caducidad && formik.errors.fecha_caducidad && (
                    <div style={errorText}>{formik.errors.fecha_caducidad}</div>
                )}
            </div>

            <div style={fieldGroup}>
                <label style={labelStyle}>Proveedor</label>
                <select
                    name="id_proveedor"
                    value={formik.values.id_proveedor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={inputStyle}
                >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map(p => (
                        <option key={p.ID} value={p.ID}>
                            {p.NOMBRE}
                        </option>
                    ))}
                </select>
                {formik.touched.id_proveedor && formik.errors.id_proveedor && (
                    <div style={errorText}>{formik.errors.id_proveedor}</div>
                )}
            </div>

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

export default ProductForm;
