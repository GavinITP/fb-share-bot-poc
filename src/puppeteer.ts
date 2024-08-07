import puppeteer from "puppeteer";
import dotenv from "dotenv";

import {
  login,
  clickShareButton,
  clickGroupButton,
  selectGroup,
  clickPostButton,
} from "./helpers/fbActions";
import { readYamlFile } from "./helpers/readFile";

dotenv.config();

export async function run(): Promise<void> {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.PUPPETEER_EXECUTEABLE_PATH || puppeteer.executablePath(),
    headless: false,
  });
  const page = await browser.newPage();

  const EMAIL = process.env.EMAIL || "";
  const PASSWORD = process.env.PASSWORD || "";

  if (!EMAIL || !PASSWORD) {
    throw new Error("Please provide email and password");
  }

  try {
    await page.setViewport({ width: 1200, height: 800 });
    await login(page, EMAIL, PASSWORD);

    const postUrlsFilePath = "src/configs/postUrls.yaml";
    const postUrls: string[] = readYamlFile(postUrlsFilePath);

    const groupNamesFilePath = "src/configs/groupNames.yaml";
    const groupNames: string[] = readYamlFile(groupNamesFilePath);

    for (const postUrl of postUrls) {
      for (const groupName of groupNames) {
        page.on("dialog", async (dialog) => {
          await dialog.accept();
        });

        await page.goto(postUrl);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        page.off("dialog");

        await clickShareButton(page);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        await clickGroupButton(page);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        await selectGroup(page, groupName);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        await clickPostButton(page);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log(`${postUrl} Posted to ${groupName}`);
      }
    }
  } catch (error) {
    console.log(`Error: ${(error as Error).message}`);
  } finally {
    await browser.close();
    console.log("Browser closed");
  }
}
