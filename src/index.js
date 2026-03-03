import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
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

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = (await import(`file://${filePath}`)).default;

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  }
}

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "Error executing command.", ephemeral: true });
  }
});
import { REST, Routes } from "discord.js";

const commandsArray = client.commands.map(command => command.data.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.once(Events.ClientReady, async () => {
  try {
    console.log("Refreshing slash commands...");

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
client.login(process.env.TOKEN);
