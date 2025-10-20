import axios from "axios";
import * as cheerio from "cheerio";
import * as yaml from "js-yaml";

  // Read the YAML file using Deno
const ymlContent = await Deno.readTextFile("../Application.yml");
  // Parse YAML
const config = yaml.load(ymlContent) as { website: { url: string } };
const web_url = config.website.url;

async function main() {
  const url = web_url;
  console.log("test")
  try {
    // Download HTML
    const { data } = await axios.get(url);

    // Load HTML into Cheerio
    const $ = cheerio.load(data);

    // Extract specific data
    const jsonLdScript = $('script[type="application/ld+json"]').html();

    if (jsonLdScript) {
      try {
        const jsonData = JSON.parse(jsonLdScript);
        console.log("Event Name:", jsonData.name);
      } catch {
      }
    }

    console.log("Links found:", jsonLdScript);
  } catch (error) {
    console.error("Error scraping:", error);
  }
}

main();
