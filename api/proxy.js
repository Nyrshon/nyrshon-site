// api/proxy.js
export default async function handler(req, res) {
  try {
    // ✅ Fetch Framer website
    const response = await fetch("https://exciting-shape-432647.framer.app" + req.url);
    let html = await response.text();

    // ✅ Remove unwanted elements robustly
    html = html
      // Remove anything with "Use for Free" inside (even deep inside divs)
      .replace(/<[^>]*>Use for Free<\/[^>]*>/gi, "")
      .replace(/Use for Free/gi, "")
      // Remove full "Remix" button structures
      .replace(/<a[^>]*>Remix<\/a>/gi, "")
      .replace(/Remix/gi, "")
      // Remove "Made with Framer" or any link to framer
      .replace(/<a[^>]*framer\.link[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/<a[^>]*framer\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      .replace(/Made with Framer/gi, "")
      // Remove Twitter links
      .replace(/<a[^>]*twitter\.com[^>]*>[\s\S]*?<\/a>/gi, "")
      // Remove known floating Framer UI divs by classes
      .replace(/<div[^>]*framer-pointer-events-none[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*framer-IYKYh[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*framer-17vtrtf[^>]*>[\s\S]*?<\/div>/gi, "")
      // Remove that specific deep class structure you found
      .replace(/<p[^>]*class="[^"]*framer-1j5smt2[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "")
      .replace(/<div[^>]*class="[^"]*framer-1j5smt2[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<div[^>]*class="[^"]*framer-4qch35[^"]*"[^>]*>[\s\S]
