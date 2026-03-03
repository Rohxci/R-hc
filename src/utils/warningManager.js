import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "..", "data", "warnings.json");

function readData() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export function addWarning(guildId, userId, moderator, reason) {
  const data = readData();

  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][userId]) data[guildId][userId] = [];

  data[guildId][userId].push({
    moderator,
    reason,
    date: new Date().toISOString()
  });

  writeData(data);
  return data[guildId][userId].length;
}

export function getWarnings(guildId, userId) {
  const data = readData();
  if (!data[guildId] || !data[guildId][userId]) return [];
  return data[guildId][userId];
}

export function clearWarnings(guildId, userId) {
  const data = readData();
  if (data[guildId] && data[guildId][userId]) {
    delete data[guildId][userId];
    writeData(data);
  }
}
