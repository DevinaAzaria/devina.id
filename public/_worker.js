const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
};

function withSecurityHeaders(response, requestUrl) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value);
  }

  if (requestUrl.hostname.endsWith('.pages.dev')) {
    headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.devina.id') {
      url.hostname = 'devina.id';
      return Response.redirect(url.toString(), 301);
    }

    const assetResponse = await env.ASSETS.fetch(request);

    if (
      assetResponse.status === 404 &&
      (request.method === 'GET' || request.method === 'HEAD')
    ) {
      const archiveUrl = new URL(request.url);
      archiveUrl.protocol = 'https:';
      archiveUrl.hostname = 'archive.devina.id';
      archiveUrl.port = '';
      return Response.redirect(archiveUrl.toString(), 301);
    }

    return withSecurityHeaders(assetResponse, url);
  },
};
