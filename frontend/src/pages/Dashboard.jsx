export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <div className="panel">
        <p style={{ margin: 0, color: 'var(--muted)' }}>
          MVP de nómina con arquitectura CursoNode (Session + Security + /proccess).
          Usa el menú para gestionar departamentos, empleados, conceptos, nóminas DRAFT y
          préstamos.
        </p>
      </div>
    </div>
  );
}
