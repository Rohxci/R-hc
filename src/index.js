import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
 Client,
 Collection,
 GatewayIntentBits,
 Events,
 REST,
 Routes
} from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
 intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commands = [];
const commandsPath = path.join(__dirname, "commands");

const folders = fs.readdirSync(commandsPath);

for (const folder of folders) {

 const folderPath = path.join(commandsPath, folder);

 if (!fs.statSync(folderPath).isDirectory()) continue;

 const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

 for (const file of files) {

  const filePath = path.join(folderPath, file);

  const imported = await import(`file://${filePath}`);

  const command = imported.default ?? imported;

  if (!command.data) continue;

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());

  console.log(`Loaded command: ${command.data.name}`);
 }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.once(Events.ClientReady, async () => {

 console.log(`Logged in as ${client.user.tag}`);

 await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
 );

 console.log("Slash commands registered");
});

client.on(Events.InteractionCreate, async interaction => {

 if (!interaction.isChatInputCommand()) return;

 const command = client.commands.get(interaction.commandName);
 if (!command) return;

 try {
  await command.execute(interaction);
 } catch (error) {

  console.error(error);

  await interaction.reply({
   content: "Error executing command.",
   ephemeral: true
  });
 }
});

client.login(process.env.TOKEN);
