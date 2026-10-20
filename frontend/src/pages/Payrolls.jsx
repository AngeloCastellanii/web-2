import { useEffect, useState } from 'react';
import { proccess } from '../api';

const empty = {
  start_date: '',
  end_date: '',
  pay_date: '',
  status: 'DRAFT',
  pay_frequency_id: '',
  notes: ''
};

export default function Payrolls() {
  const [rows, setRows] = useState([]);
  const [freqs, setFreqs] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const [p, f] = await Promise.all([
      proccess('Payroll', 'listPayrolls', []),
      proccess('PayFrequency', 'listPayFrequencies', [])
    ]);
    if (p.data) setRows(p.data);
    else setMsg(p.msg);
    if (f.data) setFreqs(f.data);
  }

  useEffect(() => {
    load();
  }, []);

  function setField(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');
    let r;
    if (editId) {
      r = await proccess('Payroll', 'updatePayroll', [
        editId,
        form.start_date,
        form.end_date,
        form.pay_date || null,
        form.status,
        Number(form.pay_frequency_id),
        form.notes
      ]);
    } else {
      r = await proccess('Payroll', 'insertPayroll', [
        form.start_date,
        form.end_date,
        form.pay_date || null,
        'DRAFT',
        Number(form.pay_frequency_id),
        form.notes
      ]);
    }
    setMsg(r.msg);
    if (!r.err) {
      setForm(empty);
      setEditId(null);
      load();
    }
  }

  function startEdit(row) {
    if (row.status !== 'DRAFT') {
      setMsg('Only DRAFT payrolls can be edited');
      return;
    }
    setEditId(row.payroll_id);
    setForm({
      start_date: String(row.start_date).slice(0, 10),
      end_date: String(row.end_date).slice(0, 10),
      pay_date: row.pay_date ? String(row.pay_date).slice(0, 10) : '',
      status: row.status,
      pay_frequency_id: row.pay_frequency_id,
      notes: row.notes || ''
    });
  }

  async function remove(id) {
    const r = await proccess('Payroll', 'deletePayroll', [id]);
    setMsg(r.msg);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <h2>Payrolls</h2>
      </div>
      <div className="panel">
        <form onSubmit={onSubmit} className="form-grid">
          <div className="field">
            <label>Start date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setField('start_date', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>End date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setField('end_date', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Pay date</label>
            <input
              type="date"
              value={form.pay_date}
              onChange={(e) => setField('pay_date', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Pay frequency</label>
            <select
              value={form.pay_frequency_id}
              onChange={(e) => setField('pay_frequency_id', e.target.value)}
              required
            >
              <option value="">Select…</option>
              {freqs.map((f) => (
                <option key={f.pay_frequency_id} value={f.pay_frequency_id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          {editId && (
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
                <option value="DRAFT">DRAFT</option>
                <option value="FINALIZED">FINALIZED</option>
              </select>
            </div>
          )}
          <div className="field">
            <label>Notes</label>
            <input value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <div className="actions">
              <button type="submit">{editId ? 'Update' : 'Create DRAFT'}</button>
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
              <th>Period</th>
              <th>Pay date</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Notes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.payroll_id}>
                <td>{r.payroll_id}</td>
                <td>
                  {String(r.start_date).slice(0, 10)} → {String(r.end_date).slice(0, 10)}
                </td>
                <td>{r.pay_date ? String(r.pay_date).slice(0, 10) : '—'}</td>
                <td>{r.pay_frequency_name}</td>
                <td>
                  <span className={`badge ${r.status === 'DRAFT' ? 'draft' : 'finalized'}`}>
                    {r.status}
                  </span>
                </td>
                <td>{r.notes}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="secondary" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => remove(r.payroll_id)}
                      disabled={r.status !== 'DRAFT'}
                    >
                      Delete
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
