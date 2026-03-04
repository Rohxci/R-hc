import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("setticketlogs")
 .setDescription("Set the ticket log channel")
 .addChannelOption(option =>
  option
   .setName("channel")
   .setDescription("Channel where ticket logs will be sent")
   .setRequired(true)
 )
 .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {

 const channel = interaction.options.getChannel("channel");

 const filePath = path.join("src", "data", "ticketConfig.json");

 let data = {};

 if (fs.existsSync(filePath)) {
  data = JSON.parse(fs.readFileSync(filePath));
 }

 if (!data[interaction.guild.id]) {
  data[interaction.guild.id] = {};
 }

 data[interaction.guild.id].ticketLogs = channel.id;

 fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

 await interaction.reply({
  content: `✅ Ticket log channel set to ${channel}`,
  ephemeral: true
 });

}
