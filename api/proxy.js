// api/proxy.js
export default async function handler(req, res) {
  try {
    // ✅ Fetch your Framer website content
    const response = await fetch("https://exciting-shape-432647.framer.app" + req.url);
    let html = await response.text();

    // ✅ Remove unwanted Framer buttons, banners, and links
    html = html
      // Remove “Use for Free” (and nested elements)
      .replace(/<[^>]*>Use for Free<\/[^>]*>/gi, "")
      .replace(/Use for Free/gi, "")
      // Remove “Remix” buttons or text
      .replace(/<a[^>]*>Remix<\/a>/gi, "")
      .replace(/Remix/gi, "")
      // Remove "Made with Framer" and Framer promotional links
      .replace(/Made with Framer/gi, "")
      .replace(/<a[^>]*framer\.link[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/<a[^>]*framer\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      // Remove any Twitter links
      .replace(/<a[^>]*twitter\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      // Remove floating UI elements used by Framer
      .replace(/<div[^>]*framer-pointer-events-none[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*framer-IYKYh[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*framer-17vtrtf[^>]*>[\s\S]*?<\/div>/gi, "")
      // Remove specific nested elements you found (deep cleanup)
      .replace(/<p[^>]*class="[^"]*framer-1j5smt2[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "")
      .replace(/<div[^>]*class="[^"]*framer-4qch35[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*class="[^"]*framer-G2a6L[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

    // ✅ Inject favicon
    html = html.replace(
      "</head>",
      `<link rel="icon" type="image/png" href="/favicon.png" /></head>`
    );

    // ✅ Optional: Cache for 1 hour for faster reloads
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("Content-Type", "text/html");

    // ✅ Send the cleaned HTML
    res.status(200).send(html);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).send("Error fetching Framer site.");
  }
}
