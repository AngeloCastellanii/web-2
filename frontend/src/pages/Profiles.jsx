import { useEffect, useState } from 'react';
import { proccess } from '../api';

export default function Profiles() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    proccess('Profile', 'listProfiles', []).then((r) => {
      if (r.data) setRows(r.data);
      else setMsg(r.msg || 'Error');
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Perfiles</h2>
      </div>
      {msg && (
        <div className="panel">
          <div className="msg">{msg}</div>
        </div>
      )}
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.profile_id}>
                <td>{r.profile_id}</td>
                <td>{r.name}</td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
