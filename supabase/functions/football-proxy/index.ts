import "@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  const API_KEY = Deno.env.get("FOOTBALL_API_KEY");
  if (!API_KEY) {
    console.error("[football-proxy] FOOTBALL_API_KEY secret not set");
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  let body: { path: string; params?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const { path, params } = body;

  const url = new URL(`https://api.football-data.org${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  console.log(`[football-proxy] → GET ${url.toString()}`);

  const res = await fetch(url.toString(), {
    headers: { "X-Auth-Token": API_KEY },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`[football-proxy] football-data.org responded ${res.status}:`, JSON.stringify(data));
  }

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
