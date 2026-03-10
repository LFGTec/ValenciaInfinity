import "./NouMestalla.css";

export default function NouMestalla() {
  return (
    <div className="stadium-container">
      <h1 className="stadium-title">
        Nou <span>Mestalla</span>
      </h1>

      <p className="stadium-subtitle">El futuro hogar del Valencia CF</p>

      <div className="stadium-grid">
        <div className="stadium-card">
          <h3>Capacidad</h3>
          <p>70,000+ espectadores</p>
        </div>

        <div className="stadium-card">
          <h3>Ubicación</h3>
          <p>Avenida Cortes Valencianas, Valencia</p>
        </div>

        <div className="stadium-card">
          <h3>Apertura prevista</h3>
          <p>Temporada 2027</p>
        </div>

        <div className="stadium-card">
          <h3>Sostenibilidad</h3>
          <p>Paneles solares y diseño eficiente energéticamente</p>
        </div>
      </div>

      <div className="stadium-description">
        <h2>El nuevo estadio</h2>

        <p>
          El Nou Mestalla será el nuevo estadio del Valencia CF y uno de los
          recintos futbolísticos más modernos de Europa. Tendrá más de 70,000
          asientos cubiertos, garantizando comodidad para todos los aficionados.
        </p>

        <p>
          El estadio contará con zonas VIP, áreas de hospitality premium, una
          fan zone exterior y espacios diseñados para eventos durante todo el
          año.
        </p>

        <p>
          Su cubierta translúcida permitirá proteger a los aficionados del sol y
          la lluvia mientras mejora la acústica del estadio y alberga un sistema
          de energía solar para reducir el impacto ambiental.
        </p>
      </div>
    </div>
  );
}
