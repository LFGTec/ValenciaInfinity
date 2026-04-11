// src/components/VRExperience.tsx
import React, { useEffect, useRef } from "react";
import "./VRExperience.css";

interface VRExperienceProps {
  buildUrl: string; // Ruta al build de Unity (WebGL)
  width?: string; // Opcional: ancho del canvas
  height?: string; // Opcional: alto del canvas
}

const VRExperience: React.FC<VRExperienceProps> = ({
  buildUrl,
  width = "100%",
  height = "600px",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Limpiar build anterior si existe
    containerRef.current.innerHTML = "";

    // Crear iframe para el build WebGL de Unity
    const iframe = document.createElement("iframe");
    iframe.src = `${buildUrl}/index.html`; // Asegúrate de que Unity exporte el index
    iframe.width = width;
    iframe.height = height;
    iframe.style.border = "none";
    iframe.allowFullscreen = true;

    containerRef.current.appendChild(iframe);

    return () => {
      containerRef.current?.removeChild(iframe);
    };
  }, [buildUrl, width, height]);

  return <div ref={containerRef} className="vr-experience-container"></div>;
};

export default VRExperience;
