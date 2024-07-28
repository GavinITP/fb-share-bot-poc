import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { run } from "./puppeteer";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("The API is running");
});

app.get("/run", async (_req: Request, res: Response) => {
  try {
    await run();

    res.status(200).send("Script executed successfully");
  } catch (error) {
    res.status(500).send(`Error executing script: ${(error as Error).message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
