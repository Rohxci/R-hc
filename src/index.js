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

/* ========================
   LOAD COMMANDS
======================== */

const commandsPath = path.join(__dirname, "commands");

const folders = fs
 .readdirSync(commandsPath)
 .filter(f => fs.statSync(path.join(commandsPath, f)).isDirectory());

for (const folder of folders) {

 const folderPath = path.join(commandsPath, folder);

 const files = fs
  .readdirSync(folderPath)
  .filter(file => file.endsWith(".js"));

 for (const file of files) {

  const filePath = path.join(folderPath, file);

  const imported = await import(`file://${filePath}`);
  const command = imported.default ?? imported;

  if (!command.data || !command.execute) continue;

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());

  console.log(`Loaded command: ${command.data.name}`);
 }

}

/* ========================
   LOAD EVENTS
======================== */

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {

 const eventFiles = fs
  .readdirSync(eventsPath)
  .filter(file => file.endsWith(".js"));

 for (const file of eventFiles) {

  const filePath = path.join(eventsPath, file);

  const event = (await import(`file://${filePath}`)).default;

  if (event.once) {
   client.once(event.name, (...args) => event.execute(...args));
  } else {
   client.on(event.name, (...args) => event.execute(...args));
  }

  console.log(`Loaded event: ${event.name}`);

 }

}

/* ========================
   REGISTER COMMANDS
======================== */

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.once(Events.ClientReady, async () => {

 console.log(`Logged in as ${client.user.tag}`);

 try {

  await rest.put(
   Routes.applicationGuildCommands(
    process.env.CLIENT_ID,
    process.env.GUILD_ID
   ),
   { body: commands }
  );

  console.log("Slash commands registered.");

 } catch (error) {

  console.error(error);

 }

});

/* ========================
   INTERACTION HANDLER
======================== */

client.on(Events.InteractionCreate, async interaction => {

 if (!interaction.isChatInputCommand()) return;

 const command = client.commands.get(interaction.commandName);

 if (!command) return;

 try {

  await command.execute(interaction);

 } catch (error) {

  console.error(error);

  if (interaction.replied || interaction.deferred) {

   await interaction.followUp({
    content: "Error executing command.",
    ephemeral: true
   });

  } else {

   await interaction.reply({
    content: "Error executing command.",
    ephemeral: true
   });

  }

 }

});

/* ========================
   LOGIN
======================== */

client.login(process.env.TOKEN);
