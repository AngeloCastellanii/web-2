import { useEffect, useState } from 'react';
import { proccess } from '../api';

const empty = {
  employee_id: '',
  total_amount: '',
  remaining_balance: '',
  installment: '',
  start_date: '',
  status: 'ACTIVE'
};

export default function Loans() {
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const [l, e] = await Promise.all([
      proccess('Loan', 'listLoans', []),
      proccess('Employee', 'listEmployees', [])
    ]);
    if (l.data) setRows(l.data);
    else setMsg(l.msg);
    if (e.data) setEmployees(e.data.filter((x) => x.is_active !== false));
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
    let r;
    if (editId) {
      r = await proccess('Loan', 'updateLoan', [
        editId,
        Number(form.remaining_balance),
        Number(form.installment),
        form.status
      ]);
    } else {
      const total = Number(form.total_amount);
      const balance =
        form.remaining_balance === '' ? total : Number(form.remaining_balance);
      r = await proccess('Loan', 'insertLoan', [
        Number(form.employee_id),
        total,
        balance,
        Number(form.installment),
        form.start_date,
        'ACTIVE'
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
    setEditId(row.loan_id);
    setForm({
      employee_id: row.employee_id,
      total_amount: row.total_amount,
      remaining_balance: row.remaining_balance,
      installment: row.installment,
      start_date: String(row.start_date).slice(0, 10),
      status: row.status
    });
  }

  async function remove(id) {
    const r = await proccess('Loan', 'deleteLoan', [id]);
    setMsg(r.msg);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <h2>Loans</h2>
      </div>
      <div className="panel">
        <form onSubmit={onSubmit} className="form-grid">
          {!editId && (
            <div className="field">
              <label>Employee</label>
              <select
                value={form.employee_id}
                onChange={(e) => setField('employee_id', e.target.value)}
                required
              >
                <option value="">Select…</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!editId && (
            <div className="field">
              <label>Total amount</label>
              <input
                type="number"
                step="0.01"
                value={form.total_amount}
                onChange={(e) => setField('total_amount', e.target.value)}
                required
              />
            </div>
          )}
          <div className="field">
            <label>Remaining balance</label>
            <input
              type="number"
              step="0.01"
              value={form.remaining_balance}
              onChange={(e) => setField('remaining_balance', e.target.value)}
              required={!!editId}
            />
          </div>
          <div className="field">
            <label>Installment</label>
            <input
              type="number"
              step="0.01"
              value={form.installment}
              onChange={(e) => setField('installment', e.target.value)}
              required
            />
          </div>
          {!editId && (
            <div className="field">
              <label>Start date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setField('start_date', e.target.value)}
                required
              />
            </div>
          )}
          {editId && (
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAID">PAID</option>
              </select>
            </div>
          )}
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
              <th>Employee</th>
              <th>Total</th>
              <th>Balance</th>
              <th>Installment</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.loan_id}>
                <td>{r.loan_id}</td>
                <td>
                  {r.first_name} {r.last_name}
                </td>
                <td>{r.total_amount}</td>
                <td>{r.remaining_balance}</td>
                <td>{r.installment}</td>
                <td>{r.status}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="secondary" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => remove(r.loan_id)}>
                      Close
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
