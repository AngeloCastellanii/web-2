import { useEffect, useMemo, useState } from 'react';
import { proccess } from '../api';

export default function Permissions() {
  const [profiles, setProfiles] = useState([]);
  const [methods, setMethods] = useState([]);
  const [granted, setGranted] = useState(() => new Set());
  const [profileId, setProfileId] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    Promise.all([
      proccess('Profile', 'listProfiles', []),
      proccess('Permission', 'listMethods', [])
    ]).then(([profilesRes, methodsRes]) => {
      if (profilesRes.data) setProfiles(profilesRes.data);
      else setMsg(profilesRes.msg || 'Error');
      if (methodsRes.data) setMethods(methodsRes.data);
      else setMsg(methodsRes.msg || 'Error');
    });
  }, []);

  async function loadGranted(id) {
    const r = await proccess('Permission', 'listPermissionsByProfile', [Number(id)]);
    if (r.err || !r.data) {
      setMsg(r.msg || 'Error');
      setGranted(new Set());
      return;
    }
    setGranted(new Set(r.data.map((row) => row.method_id)));
  }

  function onProfile(e) {
    const id = e.target.value;
    setProfileId(id);
    setMsg('');
    if (id) loadGranted(id);
    else setGranted(new Set());
  }

  async function toggle(methodId, has) {
    const method = has ? 'revokePermission' : 'grantPermission';
    const r = await proccess('Permission', method, [Number(profileId), methodId]);
    setMsg(r.msg || '');
    if (!r.err) loadGranted(profileId);
  }

  const groups = useMemo(() => {
    const map = new Map();
    methods.forEach((method) => {
      if (!map.has(method.object_de)) map.set(method.object_de, []);
      map.get(method.object_de).push(method);
    });
    return [...map.entries()];
  }, [methods]);

  return (
    <div>
      <div className="page-header">
        <h2>Permisos</h2>
      </div>
      <div className="panel">
        <div className="field">
          <label htmlFor="profile">Perfil</label>
          <select id="profile" value={profileId} onChange={onProfile}>
            <option value="">Seleccione</option>
            {profiles.map((profile) => (
              <option key={profile.profile_id} value={profile.profile_id}>
                {profile.name}
              </option>
            ))}
          </select>
        </div>
        {msg && <div className="msg">{msg}</div>}
      </div>
      {profileId &&
        groups.map(([objectDe, rows]) => (
          <div className="panel table-wrap" key={objectDe}>
            <h3>{objectDe}</h3>
            <table>
              <thead>
                <tr>
                  <th>Método</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((method) => {
                  const has = granted.has(method.method_id);
                  return (
                    <tr key={method.method_id}>
                      <td>{method.method_de}</td>
                      <td>
                        <button
                          type="button"
                          className={has ? 'danger' : undefined}
                          onClick={() => toggle(method.method_id, has)}
                        >
                          {has ? 'Quitar' : 'Otorgar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
