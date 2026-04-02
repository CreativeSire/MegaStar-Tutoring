export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return;
  }

  const requestUrl = new URL(request.url);
  if (origin === requestUrl.origin) {
    return;
  }

  const originUrl = new URL(origin);
  const loopbackHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
  const originIsLoopback = loopbackHosts.has(originUrl.hostname);
  const requestIsLoopback = loopbackHosts.has(requestUrl.hostname);
  const sameLoopbackPort = originUrl.port === requestUrl.port;

  if (originUrl.protocol === requestUrl.protocol && originIsLoopback && requestIsLoopback && sameLoopbackPort) {
    return;
  }

  if (origin !== requestUrl.origin) {
    throw new Error("Forbidden origin.");
  }
}

export async function readJsonBody(request: Request, maxBytes = 64_000) {
  const rawBody = await request.text();
  const byteLength = new TextEncoder().encode(rawBody).length;
  if (byteLength > maxBytes) {
    throw new Error("Request body too large.");
  }

  return rawBody ? JSON.parse(rawBody) : null;
}
