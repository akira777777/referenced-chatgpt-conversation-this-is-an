import worker from "../dist/server/index.js";

export const config = {
  maxDuration: 15,
};

export default async function handler(req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = `${protocol}://${host}${req.url}`;

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (Array.isArray(val)) {
        for (const v of val) headers.append(key, v);
      } else if (val !== undefined) {
        headers.set(key, val);
      }
    }

    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await new Promise((resolve) => {
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
      });
    }

    // Convert HEAD to GET internally for SSR rendering if needed, but preserve HEAD status
    const isHead = req.method === "HEAD";
    const fetchMethod = isHead ? "GET" : req.method;

    const webRequest = new Request(url, {
      method: fetchMethod,
      headers,
      body,
    });

    const response = await worker.fetch(webRequest, {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    });

    res.statusCode = response.status;
    response.headers.forEach((val, key) => {
      // Avoid header duplication or invalid transfer encoding
      if (key.toLowerCase() !== "content-length" && key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, val);
      }
    });

    if (isHead) {
      res.end();
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    res.setHeader("Content-Length", arrayBuffer.byteLength);
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Vercel SSR Handler Error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
