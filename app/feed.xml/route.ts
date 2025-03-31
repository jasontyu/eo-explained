// Redirect from /feed.xml to /rss.xml for compatibility
export async function GET() {
  return new Response(null, {
    status: 307, // Temporary redirect
    headers: {
      Location: "/rss.xml",
    },
  })
}

