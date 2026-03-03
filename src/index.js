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

/* LOAD COMMANDS */

const commandsPath = path.join(__dirname, "commands");

const commandFolders = fs
  .readdirSync(commandsPath)
  .filter(file =>
    fs.statSync(path.join(commandsPath, file)).isDirectory()
  );

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);

  const commandFiles = fs
    .readdirSync(folderPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);

    const command = await import(`file://${filePath}`);
    const cmd = command.default ?? command;

    if (cmd.data && cmd.execute) {
      client.commands.set(cmd.data.name, cmd);
      console.log(`Loaded ${cmd.data.name}`);
    }
  }
}

/* REGISTER COMMANDS */

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const commands = client.commands.map(c => c.data.toJSON());

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  console.log("Slash commands registered.");
});

/* INTERACTIONS */

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
