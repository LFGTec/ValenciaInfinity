function Game() {
  return (
    <div className="game-page">
      <h1 className="game-title">
        Valencia <span>Infinity Game</span>
      </h1>

      <p className="game-subtitle">
        Juega y gana recompensas para tu colección digital del Valencia CF.
      </p>

      <div className="game-container">
        {/* Aquí cargamos el juego con un iframe */}
        <iframe
          src="../unityGame/Build2GL/index.html"
          title="Unity Game"
          width="100%"
          height="600px"
          style={{ border: "none" }}
        />
      </div>

      <div className="game-info">
        <h2>Cómo jugar</h2>
        <ul>
          <li>Evita obstáculos en la calle.</li>
          <li>Recoge cartas del Valencia CF.</li>
          <li>Consigue la mayor puntuación posible.</li>
        </ul>
      </div>
    </div>
  );
}

export default Game;
