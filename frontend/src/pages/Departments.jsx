import { useEffect, useState } from 'react';
import { proccess } from '../api';

export default function Departments() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');
  const [editId, setEditId] = useState(null);

  async function load() {
    const r = await proccess('Department', 'listDepartments', []);
    if (r.data) setRows(r.data);
    else setMsg(r.msg || 'Error');
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');
    let r;
    if (editId) {
      r = await proccess('Department', 'updateDepartment', [editId, name, description]);
    } else {
      r = await proccess('Department', 'insertDepartment', [name, description]);
    }
    setMsg(r.msg);
    if (!r.err) {
      setName('');
      setDescription('');
      setEditId(null);
      load();
    }
  }

  function startEdit(row) {
    setEditId(row.department_id);
    setName(row.name);
    setDescription(row.description || '');
  }

  async function remove(id) {
    const r = await proccess('Department', 'deleteDepartment', [id]);
    setMsg(r.msg);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <h2>Departamentos</h2>
      </div>
      <div className="panel">
        <form onSubmit={onSubmit} className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Descripción</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <div className="actions">
              <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
              {editId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditId(null);
                    setName('');
                    setDescription('');
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
        {msg && <div className="msg">{msg}</div>}
      </div>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Activo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.department_id}>
                <td>{r.department_id}</td>
                <td>{r.name}</td>
                <td>{r.description}</td>
                <td>{r.is_active ? 'Sí' : 'No'}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="secondary" onClick={() => startEdit(r)}>
                      Editar
                    </button>
                    <button type="button" className="danger" onClick={() => remove(r.department_id)}>
                      Desactivar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
