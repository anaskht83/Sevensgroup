const DATA_API = "https://alhareef-skyland-sales.anas-kht.chatgpt.site/api/sales";

export default async function handler(request, response) {
  if (!["GET", "POST", "DELETE"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST, DELETE");
    return response.status(405).json({ error: "Method not allowed" });
  }
  try {
    const headers = {};
    if (request.headers["x-viewer-pin"]) headers["x-viewer-pin"] = request.headers["x-viewer-pin"];
    if (request.headers["x-admin-pin"]) headers["x-admin-pin"] = request.headers["x-admin-pin"];
    if (request.method === "POST") headers["content-type"] = "application/json";
    const query = request.url.includes("?") ? request.url.slice(request.url.indexOf("?")) : "";
    const upstream = await fetch(DATA_API + query, { method: request.method, headers, body: request.method === "POST" ? JSON.stringify(request.body) : undefined });
    const text = await upstream.text();
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
    return response.status(upstream.status).send(text);
  } catch (error) {
    console.error("Alhareef sales proxy failed", error);
    return response.status(502).json({ error: "تعذر الاتصال ببيانات المبيعات مؤقتاً" });
  }
}
