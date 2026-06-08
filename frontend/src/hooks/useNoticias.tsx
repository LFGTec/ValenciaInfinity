import { useState, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CACHE_KEY = "vcf_noticias_v1";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

interface CacheEntry {
  noticias: Noticia[];
  ts: number;
}

function leerCache(): Noticia[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.noticias;
  } catch {
    return null;
  }
}

function guardarCache(noticias: Noticia[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ noticias, ts: Date.now() }));
  } catch {
    // ignore — quota exceeded u otros errores de storage
  }
}

const RSS_SOURCES = [
  { key: "marca", name: "Marca" },
  { key: "as", name: "AS" },
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

function decodeEntities(text: string): string {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.body.textContent ?? text;
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

async function fetchRSS(source: { key: string; name: string }): Promise<Noticia[]> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/rss-proxy`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source: source.key }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();

  const parser = new DOMParser();
  const doc = parser.parseFromString(data.xml, "application/xml");
  const items = Array.from(doc.getElementsByTagName("item")).slice(0, 15);

  return items.map((item) => {
    const titulo = decodeEntities(getText(item, "title"));
    const descripcion = decodeEntities(
      getText(item, "description").replace(/<[^>]*>/g, "")
    ).slice(0, 200);
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
    const cached = leerCache();
    if (cached) {
      setNoticias(cached);
      setCargando(false);
      return;
    }

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

        guardarCache(todas);
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
