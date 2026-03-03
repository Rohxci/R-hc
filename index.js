import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error("Mancano TOKEN o CLIENT_ID nelle variabili.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Risponde con Pong!")
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

async function registerCommands() {
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  console.log("Slash commands registrati.");
}

client.once("ready", () => {
  console.log(`Bot online come ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong 🏓");
  }
});

registerCommands()
  .then(() => client.login(token))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
