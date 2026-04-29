import "@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCES: Record<string, string> = {
  marca: "https://e00-marca.uecdn.es/rss/futbol/valencia.xml",
  as: "https://as.com/rss/tags/valencia_cf.xml",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  const { source } = await req.json();

  if (!source || !SOURCES[source]) {
    return new Response(JSON.stringify({ error: "Invalid source" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const res = await fetch(SOURCES[source]);
  const xml = await res.text();

  return new Response(JSON.stringify({ xml }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
