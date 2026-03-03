import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "..", "data", "staffConfig.json");

function readData() {
  const raw = fs.readFileSync(dataPath);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export function setStaffRoles(guildId, rolesArray) {
  const data = readData();
  data[guildId] = {
    roles: rolesArray
  };
  writeData(data);
}

export function getStaffRoles(guildId) {
  const data = readData();
  if (!data[guildId]) return null;
  return data[guildId].roles;
}

export function getNextRole(guildId, currentRoleId) {
  const roles = getStaffRoles(guildId);
  if (!roles) return null;

  const index = roles.indexOf(currentRoleId);
  if (index === -1 || index === roles.length - 1) return null;

  return roles[index + 1];
}

export function getPreviousRole(guildId, currentRoleId) {
  const roles = getStaffRoles(guildId);
  if (!roles) return null;

  const index = roles.indexOf(currentRoleId);
  if (index <= 0) return null;

  return roles[index - 1];
}
