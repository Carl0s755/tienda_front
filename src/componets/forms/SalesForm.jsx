import React from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';

const SaleForm = ({ sale = null, onSubmit, onCancel, clients = [], products = [] }) => {
    const formik = useFormik({
        initialValues: {
            fecha_venta: sale?.fecha_venta || '',
            Id_Cliente: sale?.Id_Cliente || '',
            metodo_pago: sale?.metodo_pago || '',
            detalles: sale?.detalles || [
                { id_producto: '', cantidad: '', precio_unitario: '' }
            ]
        },
        validationSchema: Yup.object({
            fecha_venta: Yup.date().required('La fecha es obligatoria'),
            Id_Cliente: Yup.string().required('El cliente es obligatorio'),
            metodo_pago: Yup.string().required('El método de pago es obligatorio'),
            detalles: Yup.array().of(
                Yup.object().shape({
                    id_producto: Yup.string().required('Producto requerido'),
                    cantidad: Yup.number().required('Cantidad requerida'),
                    precio_unitario: Yup.number().required('Precio requerido'),
                })
            )
        }),
        onSubmit: onSubmit,
        enableReinitialize: true
    });

    return (
        <form onSubmit={formik.handleSubmit} style={formStyle}>
            <FormikProvider value={formik}>
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
                            <option key={c.ID} value={c.ID}>
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
                    <select
                        name="metodo_pago"
                        value={formik.values.metodo_pago}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={inputStyle}
                    >
                        <option value="">Seleccione un método</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Vales">Vales</option>
                    </select>
                    {formik.touched.metodo_pago && formik.errors.metodo_pago && (
                        <div style={errorText}>{formik.errors.metodo_pago}</div>
                    )}
                </div>


                {/* Detalles */}
                <FieldArray name="detalles">
                    {({ push, remove }) => (
                        <>
                            {formik.values.detalles.map((detalle, index) => {
                                const cantidad = Number(detalle.cantidad || 0);
                                const precio = Number(detalle.precio_unitario || 0);
                                const subtotal = cantidad * precio;

                                return (
                                    <div key={index} style={{
                                        border: '1px solid #ccc',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        marginBottom: '1rem',
                                        backgroundColor: '#f9fafb'
                                    }}>
                                        {/* Producto */}
                                        <div style={fieldGroup}>
                                            <label style={labelStyle}>Producto</label>
                                            <select
                                                name={`detalles[${index}].id_producto`}
                                                value={detalle.id_producto}
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    const selectedProduct = products.find(p => p.ID === selectedId);

                                                    formik.setFieldValue(`detalles[${index}].id_producto`, selectedId);

                                                    if (selectedProduct) {
                                                        formik.setFieldValue(
                                                            `detalles[${index}].precio_unitario`,
                                                            parseFloat(selectedProduct.PRECIO_UNITARIO)
                                                        );
                                                    }
                                                }}
                                                style={inputStyle}
                                            >
                                                <option value="">Seleccione un producto</option>
                                                {products.map(p => (
                                                    <option key={p.ID} value={p.ID}>
                                                        {p.NOMBRE}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>

                                        {/* Cantidad */}
                                        <div style={fieldGroup}>
                                            <label style={labelStyle}>Cantidad</label>
                                            <input
                                                type="number"
                                                name={`detalles[${index}].cantidad`}
                                                value={detalle.cantidad}
                                                onChange={formik.handleChange}
                                                style={inputStyle}
                                            />
                                        </div>

                                        {/* Precio Unitario */}
                                        <div style={fieldGroup}>
                                            <label style={labelStyle}>Precio Unitario</label>
                                            <input
                                                type="number"
                                                name={`detalles[${index}].precio_unitario`}
                                                value={detalle.precio_unitario}
                                                onChange={formik.handleChange}
                                                style={inputStyle}
                                            />
                                        </div>

                                        {/* Subtotal */}
                                        <div style={fieldGroup}>
                                            <label style={labelStyle}>Subtotal</label>
                                            <div style={{
                                                ...inputStyle,
                                                backgroundColor: '#f3f4f6',
                                                border: '1px solid #d1d5db'
                                            }}>
                                                ${subtotal.toFixed(2)}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            style={{ ...cancelButtonStyle, marginTop: '0.75rem' }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => push({ id_producto: '', cantidad: '', precio_unitario: '' })}
                                style={submitButtonStyle}
                            >
                                Agregar Producto
                            </button>
                        </>
                    )}
                </FieldArray>

                <div style={buttonGroup}>
                    <button type="submit" style={submitButtonStyle}>Guardar</button>
                    <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancelar</button>
                </div>
            </FormikProvider>
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
