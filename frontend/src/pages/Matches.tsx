import MatchesTable from "./MatchesTable";

function Matches() {
  return (
    <div className="matches-page">
      <h1 className="matches-page-title">
        Próximos <span>Partidos</span>
      </h1>

      <p className="matches-page-subtitle">
        Consulta el calendario de los próximos encuentros del Valencia CF.
      </p>

      <MatchesTable />
    </div>
  );
}

export default Matches;
