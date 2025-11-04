export default async function handler(req, res) {
  try {
    const target = "https://exciting-shape-432647.framer.app" + req.url;
    const response = await fetch(target);
    let html = await response.text();

    // Remove every Framer promo / UI element we can find
    html = html
      .replace(/Use for Free/gi, "")
      .replace(/Remix/gi, "")
      .replace(/Made with Framer/gi, "")
      .replace(/twitter\.com/gi, "")
      // remove any a-tags that link to framer
      .replace(/<a[^>]*(framer\.com|framer\.link)[^>]*>[\s\S]*?<\/a>/gi, "")
      // remove floating divs Framer uses
      .replace(/<div[^>]*framer-[^>]*>[\s\S]*?<\/div>/gi, "")
      // ⚡️ remove script tags that pull in editor UI
      .replace(/<script[^>]*(framer\.com|framerstatic|framerapp)[^>]*>[\s\S]*?<\/script>/gi, "")
      // ⚡️ remove inline scripts that mention "framer"
      .replace(/<script[^>]*>[\s\S]*?framer[\s\S]*?<\/script>/gi, "");

    // Inject your favicon
    html = html.replace(
      "</head>",
      `<link rel="icon" type="image/png" href="/favicon.png" /></head>`
    );

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Error fetching Framer site.");
  }
}
