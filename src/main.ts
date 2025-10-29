import axios from "axios";
import * as cheerio from "cheerio";
import * as yaml from "js-yaml";
import { boxscore } from "./boxscore.ts";

  // Read the YAML file using Deno
const ymlContent = await Deno.readTextFile("../Application.yml");
  // Parse YAML
const config = yaml.load(ymlContent) as { website: { url: string } };
const web_url = config.website.url;

async function main() {
  while (true) {
  const games: string[] = [];
  const url = web_url;
  const currentDate: Date = new Date();
  console.log("NHL GAMES TODAY: " + currentDate.getMonth() + " - " + currentDate.getDate() + " - " + currentDate.getFullYear());
  try {
    // Download HTML
    const { data } = await axios.get(url);

    // Load HTML into Cheerio
    const $ = cheerio.load(data);

    let idk = $('script[data-name="liveScoringScript"]').html();
    if (!idk) return;
    const idkMatch = idk.match(/return\s+(\{[\s\S]*?\});/);
    const json = JSON.parse(idkMatch!![1]);
    json.gameAbbr.split('|').forEach(element => {
      games.push(element);
    });
    
    let gameCounter: number = 1;
    $('script[type="application/ld+json"]').each((_, el) => {
      let content = $(el).html();
  
      if (!content) return;
  
      // remove newlines
      content = content
        .replace(/(\r\n|\n|\r)/gm, "");
  
      // get all games for today
      try {
        const json = JSON.parse(content);
        if (json["@type"] === "SportsEvent") {
          console.log(`${gameCounter}: `, json.name);
          gameCounter++;
        }
      } catch (err) {
        console.error("JSON parse failed:", err.message);
      }
    });
    let selection: number | null = null;
    while (selection === null) {
      const input = (prompt("Input game >") || "").trim();
      const n = parseInt(input, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= games.length) {
        selection = n;
      }
    }
    const selectedGame: string = games[selection - 1];

    let base_url: string = `https://www.cbssports.com/nhl/gametracker/boxscore/${selectedGame}/`;

    while (await boxscore(base_url)) {
      let commands = prompt("> ");
      if (commands && (commands == "q" || commands == "quit")) {
        console.clear();
        break;
      }
      await sleep(15);
    }
  }
  catch {
    console.log("Webscrape failed");
  }
}
}

async function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

main();
