import { Client, GatewayIntentBits, Collection, Events, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

/* =========================
   RECURSIVE COMMAND LOADER
========================= */

const commandsPath = path.join(__dirname, "commands");

function getCommandFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getCommandFiles(filePath));
    } else if (file.endsWith(".js")) {
      results.push(filePath);
    }
  }

  return results;
}

const commandFiles = getCommandFiles(commandsPath);

for (const filePath of commandFiles) {
  const command = (await import(`file://${filePath}`)).default;

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  }
}

/* =========================
   AUTO REGISTER SLASH
========================= */

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.once(Events.ClientReady, async () => {
  try {
    console.log("Refreshing slash commands...");

    const commandsArray = client.commands.map(cmd => cmd.data.toJSON());

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsArray }
    );

    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error(error);
  }

  console.log(`Logged in as ${client.user.tag}`);
});

/* =========================
   INTERACTION HANDLER
========================= */

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
