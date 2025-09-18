import React, { useEffect, useState } from 'react';
import API from '../config/AxiosConfig';
import Swal from 'sweetalert2';
import GlobalModal from '../components/GlobalModal';
import './css/Administrator.css';

const initialForm = { fullName: '', email: '', password: '', repeatPassword: '', phoneNumber: '' };

export default function Administrators() {
  const [admins, setAdmins] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await API.get('/admin');
      setAdmins(data);
    } catch (e) { setAdmins([]); }
  };

  const handleOpenModal = (admin = null) => {
    setEditAdmin(admin);
    setForm(admin ? { ...admin, password: '', repeatPassword: '' } : initialForm);
    setModalOpen(true);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }
    try {
      if (editAdmin) {
        await API.put(`/admin/${editAdmin.id}`, { ...form, userType: 3 });
        Swal.fire('Actualizado', 'Administrador actualizado', 'success');
      } else {
        await API.post('/admin', { ...form, userType: 3 });
        Swal.fire('Agregado', 'Administrador agregado', 'success');
      }
      setModalOpen(false);
      fetchAdmins();
    } catch {
      Swal.fire('Error', 'No se pudo guardar', 'error');
    }
  };

  const handleDelete = id => {
    Swal.fire({
      title: '¿Eliminar administrador?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async result => {
      if (result.isConfirmed) {
        await API.delete(`/admin/${id}`);
        fetchAdmins();
        Swal.fire('Eliminado', 'Administrador eliminado', 'success');
      }
    });
  };

  return (
    <div className="administrators-container">
      <h1>Administradores</h1>
      <div className="add-btn-container">
        <button onClick={() => handleOpenModal()} className="add-admin-btn">
          Agregar administrador
        </button>
      </div>
      <div className="admins-list">
        {admins.map(admin => (
          <div key={admin.id} className="admin-card">
            <div className="info">
              <div className="fullName">{admin.fullName}</div>
              <div className="email">{admin.email}</div>
              <div className="phone">{admin.phoneNumber}</div>
            </div>
            <div className="admin-actions">
              <button onClick={() => handleOpenModal(admin)} title="Editar">✏️</button>
              <button onClick={() => handleDelete(admin.id)} title="Eliminar">🗑️</button>
            </div>
          </div>
        ))}
      </div>
      <GlobalModal open={modalOpen} onClose={() => setModalOpen(false)} title={editAdmin ? 'Editar administrador' : 'Agregar administrador'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input name="fullName" placeholder="Nombre completo" value={form.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
          <input name="phoneNumber" placeholder="Teléfono" value={form.phoneNumber} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required={!editAdmin} />
          <input name="repeatPassword" type="password" placeholder="Repetir contraseña" value={form.repeatPassword} onChange={handleChange} required={!editAdmin} />
          <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 5, padding: 10, fontWeight: 'bold', marginTop: 10 }}>
            {editAdmin ? 'Actualizar datos' : 'Agregar'}
          </button>
        </form>
      </GlobalModal>
    </div>
  );
}