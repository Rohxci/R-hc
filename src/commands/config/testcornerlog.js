import { SlashCommandBuilder } from "discord.js";
import fs from "fs";

export default {
 data: new SlashCommandBuilder()
  .setName("testcornerlog")
  .setDescription("Test the corner log system"),

 async execute(interaction) {

  const data = JSON.parse(fs.readFileSync("./src/data/cornerLog.json"));

  const channelId = data[interaction.guild.id];

  const channel = interaction.guild.channels.cache.get(channelId);

  if (!channel) {
   return interaction.reply("Corner log channel not found.");
  }

  await channel.send("✅ Corner log test message");

  await interaction.reply("Test message sent.");

 }
};
