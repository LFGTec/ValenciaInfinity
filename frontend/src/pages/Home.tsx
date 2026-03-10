import NewsList from "../components/NewList";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Bienvenido a <span>Valencia Infinity</span>
      </h1>

      <p className="home-subtitle">
        La comunidad donde los fans viven el fútbol del Valencia CF.
      </p>

      <NewsList />
    </div>
  );
}

export default Home;
