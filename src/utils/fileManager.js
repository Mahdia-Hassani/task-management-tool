import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "../data");

export function readData(fileName) {
  try {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf-8");
      return [];
    }
    const rawData = fs.readFileSync(filePath, "utf-8");
    return rawData.trim() ? JSON.parse(rawData) : [];
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error.message);
    return [];
  }
}

export function writeData(fileName, data) {
  try {
    const filePath = path.join(dataDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error.message);
    return false;
  }
}
