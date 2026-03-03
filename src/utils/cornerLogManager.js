import fs from "fs";
import path from "path";

const filePath = path.resolve("src/data/cornerLog.json");

function readData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }

  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function setCornerChannel(guildId, channelId) {
  const data = readData();
  data[guildId] = channelId;
  writeData(data);
}

export function getCornerChannel(guildId) {
  const data = readData();
  return data[guildId];
}
