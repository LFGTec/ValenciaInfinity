import CardsList from "./CardList";

function Team() {
  return (
    <div className="team-page">
      <h1 className="team-title">
        Equipo - <span>Álbum de Jugadores</span>
      </h1>

      <CardsList />
    </div>
  );
}

export default Team;
