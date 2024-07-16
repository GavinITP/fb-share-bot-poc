import * as fs from "fs";
import * as yaml from "js-yaml";

export function readYamlFile(filePath: string): string[] {
  const contents = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(contents) as string[];

  if (!data) {
    throw new Error("Invalid or empty data in yaml file");
  }

  return data;
}
