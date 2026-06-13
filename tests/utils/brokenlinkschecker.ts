import { APIRequestContext, Page } from "@playwright/test";
import * as fs from "fs";

export async function checkBrokenLinks(
  page: Page,
  request: APIRequestContext,
  url: string,
  outputFile: string
): Promise<void> {

  await page.goto(url);

  // Extract all href links
  const links = await page.$$eval("a[href]", (anchors) =>
    anchors.map(a => (a as HTMLAnchorElement).href)
  );

  console.log(`Total links found on ${url}: ${links.length}`);

  const brokenLinks: string[] = [];
  brokenLinks.push(`Broken links found on ${url}:\n`);
  for (const link of links) {
    try {
      const response = await request.get(link);
      
      if (!response.ok()) {
        console.log(`❌ Broken: ${link} — Status: ${response.status()}`);
        brokenLinks.push(`${link} — Status: ${response.status()}`);
      } else {
        console.log(`✔ OK: ${link}`);
      }

    } catch (err) {
      console.log(`❌ Error requesting: ${link}`);
      brokenLinks.push(`${link} — Error`);
    }
  }

  // Write broken links to output file
  fs.writeFileSync(outputFile, brokenLinks.join("\n"));

  console.log(`Broken links written to ${outputFile}`);
}
