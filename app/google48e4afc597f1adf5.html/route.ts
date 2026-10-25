export function GET() {
  return new Response('google-site-verification: google48e4afc597f1adf5.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

