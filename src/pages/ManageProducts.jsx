import React, { useEffect, useState } from 'react';
import API from '../config/AxiosConfig';
import GlobalModal from '../components/GlobalModal';
import './css/ManageProducts.css'
import Swal from 'sweetalert2';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [modalProduct, setModalProduct] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [formProduct, setFormProduct] = useState({ name: '', photo: '', description: '', quantity: '', price: '', productType: {id: '', nameType: ''} });
  const [formType, setFormType] = useState({id: '', nameType: '' });
  const [editType, setEditType] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchTypes();
  }, []);

  const fetchProducts = async () => {
    const { data } = await API.get('/api/products');
    console.log(data);
    setProducts(data);
  };
  const fetchTypes = async () => {
    const { data } = await API.get('/api/product-types');
    console.log(data);
    setTypes(data);
  };

  const handleProductSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/products', formProduct);
      setModalProduct(false);
      fetchProducts();
      Swal.fire('Agregado', 'Producto agregado', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo agregar', 'error');
    }
  };

  const handleTypeSubmit = async e => {
    e.preventDefault();
    try {
      if (editType) {
        await API.put(`/api/product-types/${editType.id}`, formType);
        setEditType(null);
      } else {
        await API.post('/api/product-types', formType);
      }
      setFormType({id: '', nameType: '' });
      fetchTypes();
    } catch {}
  };

  const handleTypeDelete = id => {
    Swal.fire({
      title: '¿Eliminar tipo de producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(async result => {
      if (result.isConfirmed) {
        await API.delete(`/api/product-types/${id}`);
        fetchTypes();
      }
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    types.find(t => t.id === p.productType.id && t.nameType.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="products-container">
      <h1>Productos</h1>
      <div className="products-header">
        <button onClick={() => setModalProduct(true)}>
          Agregar producto
        </button>
        <button onClick={() => setModalType(true)}>
          Tipo de productos
        </button>
      </div>
      <input
        placeholder="Buscar producto o tipo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="products-grid">
        {filteredProducts.map(prod => (
          <div key={prod.id} className="product-card">
            <img src={prod.photo} alt={prod.name}/>
            <div className="name">{prod.name}</div>
            <div className="description">{prod.description}</div>
            <div className="quantity">Cantidad: {prod.quantity}</div>
            <div className="price">Precio: ${prod.price}</div>
            <div className="type">
              Tipo: {types.find(t => t.id === prod.productType.id)?.nameType || 'Sin tipo'}
            </div>
          </div>
        ))}
      </div>
      {/* Modal producto */}
      <GlobalModal open={modalProduct} onClose={() => setModalProduct(false)} title="Agregar producto" width={500}>
        <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input name="name" placeholder="Nombre" value={formProduct.name} onChange={e => setFormProduct(f => ({ ...f, name: e.target.value }))} required />
          <input name="photo" placeholder="URL de la foto" value={formProduct.photo} onChange={e => setFormProduct(f => ({ ...f, photo: e.target.value }))} required />
          <input name="description" placeholder="Descripción" value={formProduct.description} onChange={e => setFormProduct(f => ({ ...f, description: e.target.value }))} required />
          <input name="quantity" type="number" placeholder="Cantidad" value={formProduct.quantity} onChange={e => setFormProduct(f => ({ ...f, quantity: e.target.value }))} required />
          <input name="price" type="number" placeholder="Precio" value={formProduct.price} onChange={e => setFormProduct(f => ({ ...f, price: e.target.value }))} required />
          <select name="typeId" value={formProduct.productType.id} onChange={e => setFormProduct(f => ({ ...f, productType: { id: e.target.value } }))} required>
            <option value="">Selecciona tipo de producto</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.nameType}</option>)}
          </select>
          <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 5, padding: 10, fontWeight: 'bold', marginTop: 10 }}>
            Agregar
          </button>
        </form>
      </GlobalModal>
      {/* Modal tipo de producto */}
      <GlobalModal open={modalType} onClose={() => { setModalType(false); setEditType(null); setFormType({ name: '' }); }} title="Tipo de productos" width={400}>
        <form onSubmit={handleTypeSubmit} style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <input name="name" placeholder="Nombre tipo de producto" value={formType.nameType} onChange={e => setFormType({ name: e.target.value })} required />
          <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 5, padding: 10, fontWeight: 'bold' }}>
            {editType ? 'Actualizar' : 'Agregar'}
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {types.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7f7', borderRadius: 6, padding: 8 }}>
              {editType && editType.id === t.id ? (
                <input value={formType.nameType} onChange={e => setFormType({ name: e.target.value })} />
              ) : (
                <span>{t.nameType}</span>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setEditType(t); setFormType({ name: t.name }); }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✏️</button>
                <button onClick={() => handleTypeDelete(t.id)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </GlobalModal>
    </div>
  );
}