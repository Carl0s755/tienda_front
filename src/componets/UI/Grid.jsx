import React, { useState } from 'react';

const Grid = ({ columns = [], data = [], actions = [] }) => {
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    const flatData = Array.isArray(data) ? data.flat().filter(row => Object.keys(row).length > 0) : [];
    const pageCount = Math.ceil(flatData.length / rowsPerPage);
    const paginatedData = flatData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div style={{ overflowX: 'auto' }}>
            {flatData.length === 0 ? (
                <div style={emptyStateStyle}>No hay datos disponibles</div>
            ) : (
                <>
                    <table style={tableStyle}>
                        <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} style={thStyle}>{col.label}</th>
                            ))}
                            {actions.length > 0 && <th style={thStyle}>Acciones</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((row, idx) => (
                            <tr
                                key={idx}
                                style={rowStyle}
                                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                                onMouseOut={e => (e.currentTarget.style.backgroundColor = 'white')}
                            >
                                {columns.map(col => (
                                    <td key={col.key} style={tdStyle}>
                                        {col.key === '__index' ? page * rowsPerPage + idx + 1 : row[col.key]}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td style={tdStyle}>
                                        {actions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => action.onClick(row)}
                                                style={actionButtonStyle}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {pageCount > 1 && (
                        <div style={paginationStyle}>
                            <button
                                style={paginationButtonStyle}
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                            >
                                ← Anterior
                            </button>
                            <span style={pageIndicatorStyle}>Página {page + 1} de {pageCount}</span>
                            <button
                                style={paginationButtonStyle}
                                disabled={page + 1 >= pageCount}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const thStyle = {
    textAlign: 'left',
    padding: '0.75rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.95rem'
};

const tdStyle = {
    padding: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.95rem'
};

const rowStyle = {
    transition: 'background-color 0.2s ease',
    backgroundColor: 'white'
};

const actionButtonStyle = {
    padding: '0.4rem 0.75rem',
    backgroundColor: '#e5e7eb',
    color: '#111827',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500
};

const paginationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0.5rem'
};

const paginationButtonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.4rem 0.75rem',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.85rem'
};

const pageIndicatorStyle = {
    fontSize: '0.9rem',
    color: '#374151'
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    fontSize: '1rem',
    fontStyle: 'italic'
};

export default Grid;
