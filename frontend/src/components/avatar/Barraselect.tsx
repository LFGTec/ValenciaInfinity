import { useState } from "react";
import AvatarPreview3D from "./AvatarPreview3D";
import "./Barraselect.css";

const skinTones = [
  "#F6E7D3",
  "#E8D2BC",
  "#D9AE7A",
  "#C98D4D",
  "#A8682D",
  "#7A431D",
];

const hairStyles = [
  "Corto",
  "Largo",
  "Rapado",
  "Rizado",
  "Liso",
  "Ondulado",
  "Afro",
  "Calvo",
];

const hairColors = [
  "#2C1B12",
  "#5A3A22",
  "#8B5E3C",
  "#B57A50",
  "#D6B08C",
  "#111111",
];

const shirts = ["Local", "Visitante", "Tercera"];

function Barraselect() {
  const [selectedSkin, setSelectedSkin] = useState(skinTones[2]);
  const [selectedHair, setSelectedHair] = useState("Corto");
  const [selectedHairColor, setSelectedHairColor] = useState(hairColors[1]);
  const [selectedShirt, setSelectedShirt] = useState("Visitante");

  return (
    <div className="barra-page">
      <div className="barra-container">
        <div className="barra-grid">
          <div className="preview-panel">
            <h2 className="preview-title">Avatar</h2>

            <AvatarPreview3D
              skinColor={selectedSkin}
              hairStyle={selectedHair}
              hairColor={selectedHairColor}
              shirtType={selectedShirt}
            />
          </div>

          <div className="controls-panel">
            <h3>Tono de piel</h3>

            <div className="skin-grid">
              {skinTones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedSkin(tone)}
                  className="skin-button"
                  style={{ backgroundColor: tone }}
                />
              ))}
            </div>

            <h3>Estilo de cabello</h3>

            <div className="hair-grid">
              {hairStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedHair(style)}
                  className="hair-button"
                >
                  {style}
                </button>
              ))}
            </div>

            <h3>Color de cabello</h3>

            <div className="haircolor-grid">
              {hairColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedHairColor(color)}
                  className="haircolor-button"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <h3>Playera</h3>

            <div className="shirt-grid">
              {shirts.map((shirt) => (
                <button
                  key={shirt}
                  onClick={() => setSelectedShirt(shirt)}
                  className="shirt-button"
                >
                  {shirt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Barraselect;
