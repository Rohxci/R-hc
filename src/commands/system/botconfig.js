import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("botconfig")
 .setDescription("Show the bot configuration dashboard");

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

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle("⚙️ RÒH Bot Dashboard")

  .addFields(

   {
    name: "🎫 Ticket System Status",
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
Members: ${interaction.guild.memberCount}
Commands: ${interaction.client.commands.size}`,
    inline: false
   }

  )

  .setFooter({ text: "RÒH Bot Control Panel" })
  .setTimestamp();

 await interaction.reply({
  embeds: [embed],
  ephemeral: true
 });

}
