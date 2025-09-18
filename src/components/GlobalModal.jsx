import React from 'react';
import './css/GlobalModal.css';

export default function GlobalModal({ open, onClose, title, children, width = 400 }) {
  if (!open) return null;
  return (
    <div className="globalmodal-backdrop">
      <div className="globalmodal-content">
        <button onClick={onClose} className="globalmodal-close" title="Cerrar">&times;</button>
        {title && <div className="globalmodal-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}