import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Searcher({ placeholder = "Buscar...", onChange, value, onTypeChange, onSearch }) {
    const [productType, setProductType] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8082/api/product-types').then((response) => {
            console.log(response.data);
            setProductType(response.data);
        });
    }, []);


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '6rem'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                borderRadius: '24px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.37)',
                padding: '8px 16px',
                minWidth: '320px'
            }}>
                <span style={{ marginRight: '8px', color: '#000000ff', fontSize: '32px', cursor: 'pointer' }} onClick={onSearch} title="Buscar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        background: 'transparent',
                        width: '100%'
                    }}
                    onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
                />
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1.5rem',
                gap: '24px'
            }}>
                <span style={{ fontWeight: 'bold', fontSize: '26px', textAlign: 'center' }}>
                    Merch Disponiblessd
                </span>
                {/* Aquí va el gancho en PNG */}
                <span style={{ display: 'flex', alignItems: 'center', height: '36px' }}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3620/3620456.png"
                        alt="Gancho"
                        style={{ height: '40px', width: '40px', objectFit: 'contain' }}
                    />
                </span>
                <select
                    style={{
                        minWidth: '200px',
                        padding: '10px 8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        fontSize: '18px',
                        textAlign: 'center'
                    }}
                    defaultValue=""
                    onChange={e => onTypeChange && onTypeChange(e.target.value)}
                >
                    <option value="" disabled style={{ fontSize: '18px', textAlign: 'center' }}>
                        Seleccionar
                    </option>
                    {productType.map((val, key) => (
                        <option key={key} value={val.id} style={{ fontSize: '18px', textAlign: 'center' }}>{val.nameType}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
