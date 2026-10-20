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
        <h2>Concepts</h2>
      </div>
      <div className="panel">
        <form onSubmit={onSubmit} className="form-grid">
          <div className="field">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Effect</label>
            <select value={form.effect} onChange={(e) => setField('effect', e.target.value)}>
              <option value="CREDIT">CREDIT (+)</option>
              <option value="DEBIT">DEBIT (−)</option>
            </select>
          </div>
          <div className="field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
            >
              <option value="BASE_SALARY">BASE_SALARY</option>
              <option value="OVERTIME">OVERTIME</option>
              <option value="BONUS">BONUS</option>
              <option value="LEGAL_DEDUCTION">LEGAL_DEDUCTION</option>
              <option value="OPTIONAL">OPTIONAL</option>
              <option value="LOAN">LOAN</option>
            </select>
          </div>
          <div className="field">
            <label>Calc type</label>
            <select
              value={form.calc_type}
              onChange={(e) => setField('calc_type', e.target.value)}
            >
              <option value="PERCENT_SALARY">PERCENT_SALARY</option>
              <option value="FIXED_AMOUNT">FIXED_AMOUNT</option>
              <option value="MANUAL">MANUAL</option>
            </select>
          </div>
          <div className="field">
            <label>Calc value</label>
            <input
              type="number"
              step="0.0001"
              value={form.calc_value}
              onChange={(e) => setField('calc_value', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Automatic</label>
            <select
              value={String(form.is_automatic)}
              onChange={(e) => setField('is_automatic', e.target.value === 'true')}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <div className="actions">
              <button type="submit">{editId ? 'Update' : 'Create'}</button>
              {editId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditId(null);
                    setForm(empty);
                  }}
                >
                  Cancel
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
              <th>Name</th>
              <th>Effect</th>
              <th>Category</th>
              <th>Calc</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.concept_id}>
                <td>{r.concept_id}</td>
                <td>{r.name}</td>
                <td>{r.effect}</td>
                <td>{r.category}</td>
                <td>
                  {r.calc_type} {r.calc_value ?? ''}
                </td>
                <td>{r.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="secondary" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => remove(r.concept_id)}
                    >
                      Deactivate
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
