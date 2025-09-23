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
  const [formEdit, setFormEdit] = useState({ ...form, currentPassword: '', newPassword: '', repeatNewPassword: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await API.get('/api/users/admins/' + 3);
      setAdmins(data);
    } catch (e) {
      console.log(e)
      setAdmins([]);
    }
  };

  const handleOpenModal = (admin = null) => {
    setEditAdmin(admin);
    setForm(admin ? { ...admin, password: '', repeatPassword: '' } : initialForm);
    setFormEdit({ ...form, currentPassword: '', newPassword: '', repeatNewPassword: '' });
    setModalOpen(true);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleChangeEdit = e => setFormEdit(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Contraseñas no coinciden",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    } else if (formEdit.newPassword !== formEdit.repeatNewPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Contraseñas no coinciden",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    try {
      if (editAdmin) {
        await API.put(`/api/users/${editAdmin.id}`, { ...formEdit, userType: 3 });
        console.log(formEdit)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Administrador actualizado",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        await API.post('/auth/signup', { ...form, userType: 3 });
        console.log(form);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Administrador agregado",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      setModalOpen(false);
      fetchAdmins();
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.response?.data?.message || 'Ocurrió un error',
        showConfirmButton: false,
        timer: 3000,
      });
      console.log(error);
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
        await API.delete(`/api/users/${id}`);
        fetchAdmins();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Administrador eliminado",
          showConfirmButton: false,
          timer: 3000,
        });
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
        <form onSubmit={handleSubmit} className="product-form">
          <input name="fullName" placeholder="Nombre completo" value={form.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
          <input name="phoneNumber" placeholder="Teléfono" value={form.phoneNumber} onChange={handleChange} required />
          {editAdmin ? (
            <>
              <input name="currentPassword" type="password" placeholder="Contraseña actual" value={formEdit.currentPassword} onChange={handleChangeEdit} required />
              {formEdit.currentPassword ? (
                <>
                  <input name="newPassword" type="password" placeholder="Nueva contraseña" value={formEdit.newPassword} onChange={handleChangeEdit} required />
                  <input name="repeatNewPassword" type="password" placeholder="Repetir nueva contraseña" value={formEdit.repeatNewPassword} onChange={handleChangeEdit} required />
                </>
              ) : null}
            </>

          ) : (
            <>
              <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
              <input name="repeatPassword" type="password" placeholder="Repetir contraseña" value={form.repeatPassword} onChange={handleChange} required />
            </>
          )}
          <button type="submit">
            {editAdmin ? 'Actualizar datos' : 'Agregar'}
          </button>
        </form>
      </GlobalModal>
    </div>
  );
}