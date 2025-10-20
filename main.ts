import axios from "axios";
import * as cheerio from "cheerio";
import * as yaml from "js-yaml";

  // Read the YAML file using Deno
const ymlContent = await Deno.readTextFile("Application.yml");
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

    // Extract links
    const links: string[] = [];
    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("/nhl/game/_/gameId/")) {
        links.push(href);
      }
    });

    const texts: string[] = [];
    $("a").each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        texts.push(text);
      }
    });

    console.log("Links found:", links);
    texts.forEach(element => {
      console.log(element);
    });
  } catch (error) {
    console.error("Error scraping:", error);
  }
}

main();
