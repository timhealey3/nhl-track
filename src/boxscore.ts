import axios from "axios";
import * as cheerio from "cheerio";
import * as yaml from "js-yaml";

export async function boxscore(url: string) {
    try {
    // Download HTML
    const { data } = await axios.get(url);

    // Load HTML into Cheerio
    const $new = cheerio.load(data);
    // display game name
    const title = $new('title').text().trim().split('&')[0].trim();
    console.clear();
    console.log(title);
    // display scores
    const homeTeam: string = $new('.gametracker-hud__score--home').text().trim();
    const awayTeam: string = $new('.gametracker-hud__score--away').text().trim();
    
    console.log(`${awayTeam} - ${homeTeam}`);
    $new('.gametracker-game-info__top').each((i, el) => {
        const period = $new(el).text().trim();
        const time = $new(el).next('div').text().trim();
        if (period && time) {
            console.log(`${period} period: ${time}`);
        }
      });
    } catch {
        console.log("webscrape failed")
        return false;
    }
    return true;
}