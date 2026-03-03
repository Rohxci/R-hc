import { Client, Collection, GatewayIntentBits, Events, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCornerChannel } from "./utils/cornerLogManager.js";

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

// ============================
// LOAD COMMANDS
// ============================

const commandsPath = path.join(__dirname, "commands");

function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith(".js")) {
      import(fullPath).then(command => {
        client.commands.set(command.default.data.name, command.default);
      });
    }
  }
}

loadCommands(commandsPath);

// ============================
// READY EVENT
// ============================

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Register Slash Commands
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  const commandsArray = client.commands.map(cmd => cmd.data.toJSON());

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsArray }
    );
    console.log("Slash commands registered.");
  } catch (error) {
    console.error(error);
  }

  // ============================
  // CORNER LOG SYSTEM
  // ============================

  const uptimeStart = Date.now();

  // Restart message
  client.guilds.cache.forEach(async (guild) => {
    const channelId = getCornerChannel(guild.id);
    if (!channelId) return;

    const channel = guild.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) return;

    channel.send("🔄 Bot Restarted and Online.");
  });

  // Every 10 minutes
  setInterval(() => {
    client.guilds.cache.forEach(async (guild) => {
      const channelId = getCornerChannel(guild.id);
      if (!channelId) return;

      const channel = guild.channels.cache.get(channelId);
      if (!channel || !channel.isTextBased()) return;

      const uptimeMs = Date.now() - uptimeStart;
      const uptimeMinutes = Math.floor(uptimeMs / 60000);
      const hours = Math.floor(uptimeMinutes / 60);
      const minutes = uptimeMinutes % 60;

      const message =
        `🟢 Bot Status: ONLINE\n` +
        `⏱ Uptime: ${hours}h ${minutes}m\n` +
        `🕒 Timestamp: <t:${Math.floor(Date.now() / 1000)}:F>`;

      channel.send(message);
    });
  }, 10 * 60 * 1000);
});

// ============================
// INTERACTION HANDLER
// ============================

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
client.on("messageDelete", async message => {

if (!message.guild) return;
if (!message.content) return;

const data = JSON.parse(fs.readFileSync("./src/data/modLog.json"));

const channelId = data[message.guild.id];
if (!channelId) return;

const logChannel = message.guild.channels.cache.get(channelId);
if (!logChannel) return;

logChannel.send(
`🗑️ **Message Deleted**

User: ${message.author}
Channel: ${message.channel}

Content:
${message.content}`
);

});


client.on("messageUpdate", async (oldMessage, newMessage) => {

if (!oldMessage.guild) return;
if (oldMessage.content === newMessage.content) return;

const data = JSON.parse(fs.readFileSync("./src/data/modLog.json"));

const channelId = data[oldMessage.guild.id];
if (!channelId) return;

const logChannel = oldMessage.guild.channels.cache.get(channelId);
if (!logChannel) return;

logChannel.send(
`✏️ **Message Edited**

User: ${oldMessage.author}
Channel: ${oldMessage.channel}

Before:
${oldMessage.content}

After:
${newMessage.content}`
);

});

client.login(process.env.TOKEN);
client.login(process.env.TOKEN);
