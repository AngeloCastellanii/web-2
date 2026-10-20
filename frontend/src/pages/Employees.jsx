import { useEffect, useState } from 'react';
import { proccess } from '../api';

const empty = {
  person_id: '',
  first_name: '',
  last_name: '',
  national_id: '',
  hire_date: '',
  pay_modality: 'FIXED',
  base_salary: '',
  pay_frequency_id: '',
  department_id: '',
  position_id: ''
};

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [persons, setPersons] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [freqs, setFreqs] = useState([]);
  const [form, setForm] = useState(empty);
  const [mode, setMode] = useState('new-person'); // new-person | existing-person
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    const [e, p, d, pos, f] = await Promise.all([
      proccess('Employee', 'listEmployees', []),
      proccess('Person', 'listPersons', []),
      proccess('Department', 'listDepartments', []),
      proccess('Position', 'listPositions', []),
      proccess('PayFrequency', 'listPayFrequencies', [])
    ]);
    if (e.data) setRows(e.data);
    else setMsg(e.msg);
    if (p.data) setPersons(p.data);
    if (d.data) setDepartments(d.data.filter((x) => x.is_active !== false));
    if (pos.data) setPositions(pos.data.filter((x) => x.is_active !== false));
    if (f.data) setFreqs(f.data);
  }

  useEffect(() => {
    load();
  }, []);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');

    if (editId) {
      const r = await proccess('Employee', 'updateEmployee', [
        editId,
        form.hire_date,
        form.pay_modality,
        Number(form.base_salary),
        Number(form.pay_frequency_id),
        Number(form.department_id),
        Number(form.position_id)
      ]);
      setMsg(r.msg);
      if (!r.err) {
        setEditId(null);
        setForm(empty);
        load();
      }
      return;
    }

    let personId = form.person_id;
    if (mode === 'new-person') {
      const pr = await proccess('Person', 'insertPerson', [
        form.first_name,
        form.last_name,
        form.national_id,
        null
      ]);
      if (pr.err || !pr.data) {
        setMsg(pr.msg || 'Error creating person');
        return;
      }
      personId = pr.data.person_id;
    }

    const r = await proccess('Employee', 'insertEmployee', [
      Number(personId),
      form.hire_date,
      form.pay_modality,
      Number(form.base_salary),
      Number(form.pay_frequency_id),
      Number(form.department_id),
      Number(form.position_id)
    ]);
    setMsg(r.msg);
    if (!r.err) {
      setForm(empty);
      load();
    }
  }

  function startEdit(row) {
    setEditId(row.employee_id);
    setMode('existing-person');
    setForm({
      ...empty,
      person_id: row.person_id,
      hire_date: row.hire_date?.slice?.(0, 10) || row.hire_date,
      pay_modality: row.pay_modality,
      base_salary: row.base_salary,
      pay_frequency_id: row.pay_frequency_id,
      department_id: row.department_id,
      position_id: row.position_id
    });
  }

  async function remove(id) {
    const r = await proccess('Employee', 'deleteEmployee', [id]);
    setMsg(r.msg);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <h2>Employees</h2>
      </div>
      <div className="panel">
        <form onSubmit={onSubmit}>
          {!editId && (
            <div className="field">
              <label>Person source</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="new-person">Create new person</option>
                <option value="existing-person">Use existing person</option>
              </select>
            </div>
          )}
          <div className="form-grid">
            {!editId && mode === 'new-person' && (
              <>
                <div className="field">
                  <label>First name</label>
                  <input
                    value={form.first_name}
                    onChange={(e) => setField('first_name', e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Last name</label>
                  <input
                    value={form.last_name}
                    onChange={(e) => setField('last_name', e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>National ID</label>
                  <input
                    value={form.national_id}
                    onChange={(e) => setField('national_id', e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            {!editId && mode === 'existing-person' && (
              <div className="field">
                <label>Person</label>
                <select
                  value={form.person_id}
                  onChange={(e) => setField('person_id', e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  {persons.map((p) => (
                    <option key={p.person_id} value={p.person_id}>
                      {p.first_name} {p.last_name} ({p.national_id})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="field">
              <label>Hire date</label>
              <input
                type="date"
                value={form.hire_date}
                onChange={(e) => setField('hire_date', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Pay modality</label>
              <select
                value={form.pay_modality}
                onChange={(e) => setField('pay_modality', e.target.value)}
              >
                <option value="FIXED">FIXED</option>
                <option value="HOURLY">HOURLY</option>
              </select>
            </div>
            <div className="field">
              <label>Base salary / rate</label>
              <input
                type="number"
                step="0.01"
                value={form.base_salary}
                onChange={(e) => setField('base_salary', e.target.value)}
                required
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
            <div className="field">
              <label>Department</label>
              <select
                value={form.department_id}
                onChange={(e) => setField('department_id', e.target.value)}
                required
              >
                <option value="">Select…</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Position</label>
              <select
                value={form.position_id}
                onChange={(e) => setField('position_id', e.target.value)}
                required
              >
                <option value="">Select…</option>
                {positions.map((p) => (
                  <option key={p.position_id} value={p.position_id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="actions" style={{ marginTop: '0.75rem' }}>
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
        </form>
        {msg && <div className="msg">{msg}</div>}
      </div>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Modality</th>
              <th>Salary</th>
              <th>Dept</th>
              <th>Position</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.employee_id}>
                <td>{r.employee_id}</td>
                <td>
                  {r.first_name} {r.last_name}
                </td>
                <td>{r.pay_modality}</td>
                <td>{r.base_salary}</td>
                <td>{r.department_name}</td>
                <td>{r.position_name}</td>
                <td>{r.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="secondary" onClick={() => startEdit(r)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => remove(r.employee_id)}
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
