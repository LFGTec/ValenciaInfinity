import { useState, useEffect } from "react";

const RSS_SOURCES = [
  { proxy: "/rss-marca/rss/futbol/valencia.xml", name: "Marca" },
  { proxy: "/rss-as/rss/tags/valencia_cf.xml", name: "AS" },
];

export type Categoria = "TODAS" | "EQUIPO" | "FICHAJES" | "PARTIDOS" | "CANTERA" | "CLUB";

export interface Noticia {
  titulo: string;
  descripcion: string;
  imagen: string | null;
  url: string;
  fechaPublicacion: string;
  fuente: string;
  categoria: Categoria;
}

const KEYWORDS: Record<Exclude<Categoria, "TODAS">, string[]> = {
  FICHAJES: ["fichaje", "contrato", "transferencia", "firma", "traspaso", "renovaci", "libre", "compra", "venta", "cesión"],
  PARTIDOS: ["partido", "gol", "victoria", "derrota", "empate", "liga", "copa", "champions", "resultado", "marcador", "jornada", "clasificación", "eliminatoria"],
  CANTERA: ["cantera", "juvenil", "filial", "mestalla", "sub-", "academia", "categoría inferior", "promesa"],
  EQUIPO: ["jugador", "plantilla", "entrenamiento", "entrenador", "técnico", "selección", "once", "alineación", "lesión", "regresa", "convocatoria"],
  CLUB: ["presidente", "directiva", "estadio", "afición", "temporada", "junta", "accionista", "ciudad deportiva", "patrocin"],
};

function detectarCategoria(titulo: string, descripcion: string): Categoria {
  const texto = (titulo + " " + descripcion).toLowerCase();
  for (const [cat, keywords] of Object.entries(KEYWORDS) as [Exclude<Categoria, "TODAS">, string[]][]) {
    if (keywords.some((kw) => texto.includes(kw))) return cat;
  }
  return "EQUIPO";
}

function getText(el: Element, tag: string): string {
  return el.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
}

function getImage(item: Element): string | null {
  const enclosure = item.getElementsByTagName("enclosure")[0];
  if (enclosure?.getAttribute("type")?.startsWith("image")) {
    return enclosure.getAttribute("url");
  }

  const mrssNS = "http://search.yahoo.com/mrss/";
  const mediaContent = item.getElementsByTagNameNS(mrssNS, "content")[0];
  if (mediaContent?.getAttribute("type")?.startsWith("image")) {
    return mediaContent.getAttribute("url");
  }
  if (mediaContent && !mediaContent.getAttribute("type")) {
    const url = mediaContent.getAttribute("url");
    if (url) return url;
  }

  const mediaThumbnail = item.getElementsByTagNameNS(mrssNS, "thumbnail")[0];
  if (mediaThumbnail) return mediaThumbnail.getAttribute("url");

  const desc = getText(item, "description");
  const match = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

async function fetchRSS(source: { proxy: string; name: string }): Promise<Noticia[]> {
  const res = await fetch(source.proxy);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");
  const items = Array.from(doc.getElementsByTagName("item")).slice(0, 15);

  return items.map((item) => {
    const titulo = getText(item, "title");
    const descripcion = getText(item, "description")
      .replace(/<[^>]*>/g, "")
      .slice(0, 200);
    return {
      titulo,
      descripcion,
      imagen: getImage(item),
      url: getText(item, "link"),
      fechaPublicacion: getText(item, "pubDate"),
      fuente: source.name,
      categoria: detectarCategoria(titulo, descripcion),
    };
  });
}

export function useNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function obtenerNoticias() {
      try {
        setCargando(true);
        setError(null);

        const resultados = await Promise.allSettled(RSS_SOURCES.map(fetchRSS));

        const todas: Noticia[] = resultados
          .filter((r): r is PromiseFulfilledResult<Noticia[]> => r.status === "fulfilled")
          .flatMap((r) => r.value);

        if (todas.length === 0) throw new Error("No se pudieron cargar noticias");

        todas.sort(
          (a, b) =>
            new Date(b.fechaPublicacion).getTime() -
            new Date(a.fechaPublicacion).getTime()
        );

        setNoticias(todas);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setCargando(false);
      }
    }

    obtenerNoticias();
  }, []);

  return { noticias, cargando, error };
}
