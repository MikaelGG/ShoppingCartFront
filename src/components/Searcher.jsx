import axios from 'axios';
import { useState, useEffect } from 'react';
import './css/Searcher.css'
import API from "../config/AxiosConfig";


export default function Searcher({ placeholder = "Buscar...", onChange, value, onTypeChange, onSearch }) {
    const [productType, setProductType] = useState([]);

    useEffect(() => {
        API.get('/api/product-types').then((response) => {
            console.log(response.data);
            setProductType(response.data);
        });
    }, []);


    return (
        <div className="searcher-container">
            <div className="search-box">
                <span 
                    className="search-icon" 
                    onClick={onSearch} 
                    title="Buscar"
                >
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
                    className="search-input"
                    onKeyDown={e => { if (e.key === 'Enter') onSearch(); }}
                />
            </div>
            
            <div className="filter-section">
                <span className="filter-title">
                    Merch Disponiblessd
                </span>
                {/* Aquí va el gancho en PNG */}
                <span className="filter-icon-container">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3620/3620456.png"
                        alt="Gancho"
                        className="filter-icon"
                    />
                </span>
                <select
                    className="filter-select"
                    defaultValue=""
                    onChange={e => onTypeChange && onTypeChange(e.target.value)}
                >
                    <option value="" disabled>
                        Seleccionar
                    </option>
                    {productType.map((val, key) => (
                        <option key={key} value={val.id}>
                            {val.nameType}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
