import { SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("setcornerlog")
 .setDescription("Set the corner log channel")
 .addChannelOption(option =>
  option
   .setName("channel")
   .setDescription("Channel for corner logs")
   .setRequired(true)
 );

export async function execute(interaction) {

 const channel = interaction.options.getChannel("channel");

 const filePath = path.join("src", "data", "cornerLog.json");

 let data = {};

 if (fs.existsSync(filePath)) {
  data = JSON.parse(fs.readFileSync(filePath));
 }

 data[interaction.guild.id] = channel.id;

 fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

 await interaction.reply({
  content: `Corner log set to ${channel}`,
  ephemeral: true
 });

}
