import RankingTable from "../components/RankingTable";
import Barraselect from "../components/avatar/Barraselect";

function FanZone() {
  return (
    <div>
      <h1 className="FanZone-title">Fan Ranking</h1>
      <RankingTable />

      <div className="barra-select">
        <Barraselect />
      </div>
    </div>
  );
}

export default FanZone;
