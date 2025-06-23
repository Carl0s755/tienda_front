import React from 'react';

const Modal = ({ open, onClose, title, children, size = 'md' }) => {
    if (!open) return null;

    return (
        <div style={overlayStyle}>
            <div style={{ ...containerStyle, ...sizeStyles[size] }}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>{title}</h2>
                    <button onClick={onClose} style={closeButtonStyle}>✖</button>
                </div>
                <div style={bodyStyle}>{children}</div>
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
};

const containerStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative'
};

const sizeStyles = {
    sm: { width: '300px' },
    md: { width: '500px' },
    lg: { width: '700px' },
    xl: { width: '900px' }
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
};

const titleStyle = {
    margin: 0,
    fontSize: '1.25rem'
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer'
};

const bodyStyle = {
    paddingTop: '0.5rem'
};

export default Modal;
