const DATA_API = "https://vista-skyland-sales.anas-kht.chatgpt.site/api/sales";

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const headers = {};
    if (request.headers["x-viewer-pin"]) headers["x-viewer-pin"] = request.headers["x-viewer-pin"];
    if (request.headers["x-admin-pin"]) headers["x-admin-pin"] = request.headers["x-admin-pin"];
    if (request.method === "POST") headers["content-type"] = "application/json";

    const upstream = await fetch(DATA_API, {
      method: request.method,
      headers,
      body: request.method === "POST" ? JSON.stringify(request.body) : undefined,
    });
    const text = await upstream.text();
    response.setHeader("Cache-Control", "no-store");
    response.status(upstream.status);
    response.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
    return response.send(text);
  } catch (error) {
    console.error("Skyland sales proxy failed", error);
    return response.status(502).json({ error: "تعذر الاتصال ببيانات المبيعات مؤقتاً" });
  }
}
