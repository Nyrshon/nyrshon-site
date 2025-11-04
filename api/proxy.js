export default async function handler(req, res) {
  try {
    const target = "https://exciting-shape-432647.framer.app" + req.url;
    const response = await fetch(target);
    let html = await response.text();

    // --- Remove promo UI but KEEP main framer runtime ---
    html = html
      // remove "Use for Free", "Remix", "Made with Framer" texts
      .replace(/Use for Free/gi, "")
      .replace(/Remix/gi, "")
      .replace(/Made with Framer/gi, "")
      // remove anchor tags linking to Framer or Twitter
      .replace(/<a[^>]*(framer\.com|framer\.link|twitter\.com)[^>]*>[\s\S]*?<\/a>/gi, "")
      // remove floating divs that contain those buttons
      .replace(/<div[^>]*class="[^"]*framer-[^"]*(IYKYh|17vtrtf|pointer-events-none)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
      // remove only the known editor / overlay scripts
      .replace(/<script[^>]*editor-bundle[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<script[^>]*framer\.com\/editor[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<script[^>]*remix-controls[^>]*>[\s\S]*?<\/script>/gi, "");

    // Inject favicon
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
