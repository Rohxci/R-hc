import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export default {

 data: new SlashCommandBuilder()
  .setName("ticketstatus")
  .setDescription("Show the ticket system configuration")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

 async execute(interaction) {

  const filePath = path.join("src", "data", "ticketConfig.json");

  if (!fs.existsSync(filePath)) {

   return interaction.reply({
    content: "❌ Ticket system not configured.",
    ephemeral: true
   });

  }

  const data = JSON.parse(fs.readFileSync(filePath));
  const config = data[interaction.guild.id];

  if (!config) {

   return interaction.reply({
    content: "❌ Ticket system not configured for this server.",
    ephemeral: true
   });

  }

  const ticketChannel = config.ticketChannel
   ? `<#${config.ticketChannel}>`
   : "Not set";

  const ticketLogs = config.ticketLogs
   ? `<#${config.ticketLogs}>`
   : "Not set";

  const ticketStaff = config.staffRoles
   ? config.staffRoles.map(id => `<@&${id}>`).join(", ")
   : "Not set";

  const embed = new EmbedBuilder()

   .setTitle("🎫 Ticket System Status")

   .setColor("#f47fff")

   .addFields(

    {
     name: "Ticket Channel",
     value: ticketChannel,
     inline: false
    },

    {
     name: "Ticket Logs",
     value: ticketLogs,
     inline: false
    },

    {
     name: "Ticket Staff",
     value: ticketStaff,
     inline: false
    }

   )

   .setFooter({
    text: "RÒH Bot Ticket System"
   });

  await interaction.reply({
   embeds: [embed],
   ephemeral: true
  });

 }

};
