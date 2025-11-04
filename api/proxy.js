// api/proxy.js
export default async function handler(req, res) {
  try {
    // ✅ Fetch the Framer website content
    const response = await fetch("https://exciting-shape-432647.framer.app" + req.url);
    let html = await response.text();

    // ✅ Remove unwanted buttons or links
    html = html
      // Remove "Use for Free" button and similar anchors
      .replace(/<a[^>]*>Use for Free<\/a>/gi, "")
      // Remove any Framer footer or promotion links
      .replace(/<a[^>]*framer\.link[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/<a[^>]*framer\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      // Remove Twitter references
      .replace(/<a[^>]*twitter\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      // Remove hidden floating Framer divs (by common class names)
      .replace(/<div[^>]*framer-pointer-events-none[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*framer-IYKYh[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/Made with Framer/gi, "");

    // ✅ Inject your custom favicon
    html = html.replace(
      "</head>",
      `<link rel="icon" type="image/png" href="/favicon.png" /></head>`
    );

    // ✅ Return cleaned HTML
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Framer site.");
  }
}
