import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(0);

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '16px',
            margin: '24px 32px',
            width: '320px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '420px',
            position: 'relative'
        }}>
            <img src={product.photo} alt={product.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3 style={{ margin: '10px 0 4px 0' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '15px', margin: '0 0 8px 0', minHeight: '48px', textAlign: 'center' }}>{product.description}</p>
            <div style={{ flex: 1 }} />
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'absolute',
                bottom: '16px',
                left: 0
            }}>
                <span style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    color: '#2a8',
                    marginBottom: '10px',
                    alignSelf: 'center',
                    display: 'block',
                    textAlign: 'center'
                }}>
                    Precio ${product.price}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button onClick={() => setQuantity(q => Math.max(0, q - 1))} style={{ fontSize: '20px', width: '32px', height: '32px' }}>-</button>
                    <span style={{ margin: '0 12px', fontSize: '18px' }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} style={{ fontSize: '20px', width: '32px', height: '32px' }}>+</button>
                </div>
                <button
                    style={{
                        background: '#2a8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 18px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        width: '90%'
                    }}
                    onClick={() => {
                        onAddToCart(product, quantity);
                        setQuantity(0);
                    }}
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
};

export function Products({ selectedType, searchQuery }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        let url = '';
        if (searchQuery && searchQuery.trim() !== "") {
            url = `http://localhost:8080/api/products/searcher?name=${encodeURIComponent(searchQuery)}`;
        } else if (selectedType) {
            url = `http://localhost:8080/api/products/product/${selectedType}`;
        } else {
            url = 'http://localhost:8080/api/products';
        }
        axios.get(url).then(res => setProducts(res.data))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, [selectedType, searchQuery]);

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '2rem'
        }}>
            {loading ? (
                <div style={{ fontSize: 20, color: '#888', marginTop: 40 }}>Cargando...</div>
            ) : products.length === 0 && searchQuery ? (
                <div style={{ fontSize: 22, color: '#c00', marginTop: 40 }}>Producto no encontrado</div>
            ) : products.length === 0 ? (
                <div style={{ fontSize: 20, color: '#888', marginTop: 40 }}>No hay productos para mostrar</div>
            ) : (
                products.map(product => (
                    <ProductCard key={product.code} product={product} onAddToCart={addToCart} />
                ))
            )}
        </div>
    );
}