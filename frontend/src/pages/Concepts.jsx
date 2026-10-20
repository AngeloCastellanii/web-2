import { useEffect, useState } from 'react';
import { proccess } from '../api';

const empty = {
  name: '',
  effect: 'CREDIT',
  category: 'BONUS',
  is_automatic: false,
  calc_type: 'FIXED_AMOUNT',
  calc_value: ''
};

const effectLabel = { CREDIT: 'Acredita (+)', DEBIT: 'Debita (−)' };
const categoryLabel = {
  BASE_SALARY: 'Salario base',
  OVERTIME: 'Hora extra',
  BONUS: 'Bono',
  LEGAL_DEDUCTION: 'Descuento de ley',
  OPTIONAL: 'Opcional',
  LOAN: 'Préstamo'
};
const calcLabel = {
  PERCENT_SALARY: 'Porcentaje del salario',
  FIXED_AMOUNT: 'Monto fijo',
  MANUAL: 'Manual'
};

export default function Concepts() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const r = await proccess('Concept', 'listConcepts', []);
    if (r.data) setRows(r.data);
    else setMsg(r.msg);
  }

  useEffect(() => {
    load();
  }, []);

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');
    const params = [
      form.name,
      form.effect,
      form.category,
      form.is_automatic,
      form.calc_type,
      form.calc_value === '' ? null : Number(form.calc_value)
    ];
    let r;
    if (editId) {
      r = await proccess('Concept', 'updateConcept', [editId, ...params]);
    } else {
      r = await proccess('Concept', 'insertConcept', params);
    }
    setMsg(r.msg);
    if (!r.err) {
      setForm(empty);
      setEditId(null);
      load();
    }
  }

  function startEdit(row) {
    setEditId(row.concept_id);
    setForm({
      name: row.name,
      effect: row.effect,
      category: row.category,
      is_automatic: row.is_automatic,
      calc_type: row.calc_type || 'MANUAL',
      calc_value: row.calc_value ?? ''
    });
  }

  async function remove(id) {
    const r = await proccess('Concept', 'deleteConcept', [id]);
    setMsg(r.msg);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <h2>Conceptos</h2>
      </div>
      <div className="panel">
        <form onSubmit={onSubmit} className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Efecto</label>
            <select value={form.effect} onChange={(e) => setField('effect', e.target.value)}>
              <option value="CREDIT">Acredita (+)</option>
              <option value="DEBIT">Debita (−)</option>
            </select>
          </div>
          <div className="field">
            <label>Categoría</label>
            <select
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
            >
              <option value="BASE_SALARY">Salario base</option>
              <option value="OVERTIME">Hora extra</option>
              <option value="BONUS">Bono</option>
              <option value="LEGAL_DEDUCTION">Descuento de ley</option>
              <option value="OPTIONAL">Opcional</option>
              <option value="LOAN">Préstamo</option>
            </select>
          </div>
          <div className="field">
            <label>Tipo de cálculo</label>
            <select
              value={form.calc_type}
              onChange={(e) => setField('calc_type', e.target.value)}
            >
              <option value="PERCENT_SALARY">Porcentaje del salario</option>
              <option value="FIXED_AMOUNT">Monto fijo</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>
          <div className="field">
            <label>Valor de cálculo</label>
            <input
              type="number"
              step="0.0001"
              value={form.calc_value}
              onChange={(e) => setField('calc_value', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Automático</label>
            <select
              value={String(form.is_automatic)}
              onChange={(e) => setField('is_automatic', e.target.value === 'true')}
            >
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
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
                    setForm(empty);
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
              <th>Efecto</th>
              <th>Categoría</th>
              <th>Cálculo</th>
              <th>Activo</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.concept_id}>
                <td>{r.concept_id}</td>
                <td>{r.name}</td>
                <td>{effectLabel[r.effect] || r.effect}</td>
                <td>{categoryLabel[r.category] || r.category}</td>
                <td>
                  {calcLabel[r.calc_type] || r.calc_type} {r.calc_value ?? ''}
                </td>
                <td>{r.is_active ? 'Sí' : 'No'}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="secondary" onClick={() => startEdit(r)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => remove(r.concept_id)}
                    >
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
