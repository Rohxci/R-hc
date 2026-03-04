import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("setticketstaff")
 .setDescription("Add a staff role for tickets")
 .addRoleOption(option =>
  option
   .setName("role")
   .setDescription("Staff role")
   .setRequired(true)
 )
 .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {

 const role = interaction.options.getRole("role");

 const filePath = path.join("src", "data", "ticketConfig.json");

 let data = {};

 if (fs.existsSync(filePath)) {
  data = JSON.parse(fs.readFileSync(filePath));
 }

 if (!data[interaction.guild.id]) {
  data[interaction.guild.id] = {};
 }

 if (!data[interaction.guild.id].staffRoles) {
  data[interaction.guild.id].staffRoles = [];
 }

 if (data[interaction.guild.id].staffRoles.includes(role.id)) {

  return interaction.reply({
   content: "❌ That role is already a ticket staff role.",
   ephemeral: true
  });

 }

 data[interaction.guild.id].staffRoles.push(role.id);

 fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

 await interaction.reply({
  content: `✅ ${role} added as ticket staff.`,
  ephemeral: true
 });

}
