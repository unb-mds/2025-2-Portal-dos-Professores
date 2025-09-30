

export default function ProfessorCard({ professor }) {
  return (
    <div className="card-professor" style={{ border: '1px solid #ddd', padding: '1rem', margin: '0.5rem', borderRadius: '8px' }}>
      <img
        src={professor.foto_url}
        alt={`Foto de ${professor.nome}`}
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        className="professor-foto"
      />
      <div className="card-info">
        <h3>{professor.nome}</h3>
        <p>{professor.departamento}</p>
        <a
          href={professor.pagina_sigaa_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver página no SIGAA
        </a>
      </div>
    </div>
  );
}