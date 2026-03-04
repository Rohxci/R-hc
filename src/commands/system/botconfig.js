import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("botstatus")
 .setDescription("Show bot status and configuration");

export async function execute(interaction) {

 const filePath = path.join("src", "data", "ticketConfig.json");

 let ticketChannel = "Not set";
 let ticketLogs = "Not set";
 let ticketStaff = "None";

 if (fs.existsSync(filePath)) {

  const data = JSON.parse(fs.readFileSync(filePath));
  const config = data[interaction.guild.id];

  if (config) {

   if (config.ticketChannel) {
    ticketChannel = `<#${config.ticketChannel}>`;
   }

   if (config.ticketLogs) {
    ticketLogs = `<#${config.ticketLogs}>`;
   }

   if (config.staffRoles && config.staffRoles.length > 0) {
    ticketStaff = config.staffRoles.map(id => `<@&${id}>`).join("\n");
   }

  }

 }

 let ticketStatus = "❌ Not configured";

 if (ticketChannel !== "Not set" && ticketLogs !== "Not set") {
  ticketStatus = "✅ Configured";
 }

 const uptime = Math.floor(process.uptime());

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle("📊 RÒH Bot Status")

  .addFields(

   {
    name: "🎫 Ticket System",
    value: ticketStatus,
    inline: false
   },

   {
    name: "📂 Ticket Channel",
    value: ticketChannel,
    inline: true
   },

   {
    name: "📄 Ticket Logs",
    value: ticketLogs,
    inline: true
   },

   {
    name: "👮 Ticket Staff",
    value: ticketStaff,
    inline: false
   },

   {
    name: "🤖 Server Info",
    value:
`Server: ${interaction.guild.name}
Members: ${interaction.guild.memberCount}`,
    inline: false
   },

   {
    name: "⚙️ Bot Info",
    value:
`Commands loaded: ${interaction.client.commands.size}
Uptime: ${uptime} seconds`,
    inline: false
   }

  )

  .setFooter({ text: "RÒH Bot Dashboard" })
  .setTimestamp();

 await interaction.reply({
  embeds: [embed],
  ephemeral: true
 });

}
