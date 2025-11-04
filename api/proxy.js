// api/proxy.js
export default async function handler(req, res) {
  try {
    // Fetch Framer site
    const response = await fetch("https://exciting-shape-432647.framer.app" + req.url);
    let html = await response.text();

    // Remove unwanted Framer UI
    html = html
      // Remove “Use for Free” and Remix buttons
      .replace(/<a[^>]*>Use for Free<\/a>/gi, "")
      .replace(/<a[^>]*>Remix<\/a>/gi, "")
      // Remove Framer promotional links
      .replace(/<a[^>]*framer\.link[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/<a[^>]*framer\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      // Remove Twitter links
      .replace(/<a[^>]*twitter\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      // Remove floating Framer divs by common classes
      .replace(/<div[^>]*framer-pointer-events-none[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*framer-IYKYh[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*framer-17vtrtf[^>]*>[\s\S]*?<\/div>/gi, "")
      // Remove "Made with Framer" text
      .replace(/Made with Framer/gi, "");

    // Inject your favicon
    html = html.replace(
      "</head>",
      `<link rel="icon" type="image/png" href="/favicon.png" /></head>`
    );

    // Set cache for performance (1 hour)
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

    // Send the modified HTML
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Error fetching Framer site.");
  }
}
