import { Client, Collection, GatewayIntentBits, Events, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

async function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await loadCommands(filePath);
      continue;
    }

    if (!file.endsWith(".js")) continue;

    const command = await import(`file://${filePath}`);

    if (!command.data || !command.execute) continue;

    client.commands.set(command.data.name, command);
  }
}

await loadCommands(commandsPath);

client.once(Events.ClientReady, async () => {

  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  const commandsArray = client.commands.map(cmd => cmd.data.toJSON());

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


/*
MESSAGE DELETE LOG
*/

client.on("messageDelete", async message => {

  if (!message.guild) return;
  if (!message.content) return;

  const data = JSON.parse(fs.readFileSync("./src/data/modLog.json"));

  const channelId = data[message.guild.id];
  if (!channelId) return;

  const logChannel = message.guild.channels.cache.get(channelId);
  if (!logChannel) return;

  logChannel.send(
`🗑️ Message Deleted

User: ${message.author}
Channel: ${message.channel}

Content:
${message.content}`
  );

});


/*
MESSAGE EDIT LOG
*/

client.on("messageUpdate", async (oldMessage, newMessage) => {

  if (!oldMessage.guild) return;
  if (oldMessage.content === newMessage.content) return;

  const data = JSON.parse(fs.readFileSync("./src/data/modLog.json"));

  const channelId = data[oldMessage.guild.id];
  if (!channelId) return;

  const logChannel = oldMessage.guild.channels.cache.get(channelId);
  if (!logChannel) return;

  logChannel.send(
`✏️ Message Edited

User: ${oldMessage.author}
Channel: ${oldMessage.channel}

Before:
${oldMessage.content}

After:
${newMessage.content}`
  );

});

client.login(process.env.TOKEN);
