import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("removeticketstaff")
 .setDescription("Remove a ticket staff role")
 .addRoleOption(option =>
  option
   .setName("role")
   .setDescription("Staff role to remove")
   .setRequired(true)
 )
 .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {

 const role = interaction.options.getRole("role");

 const filePath = path.join("src", "data", "ticketConfig.json");

 if (!fs.existsSync(filePath)) {

  return interaction.reply({
   content: "Ticket system not configured.",
   ephemeral: true
  });

 }

 const data = JSON.parse(fs.readFileSync(filePath));
 const config = data[interaction.guild.id];

 if (!config || !config.staffRoles) {

  return interaction.reply({
   content: "No ticket staff roles configured.",
   ephemeral: true
  });

 }

 if (!config.staffRoles.includes(role.id)) {

  return interaction.reply({
   content: "That role is not a ticket staff role.",
   ephemeral: true
  });

 }

 config.staffRoles = config.staffRoles.filter(id => id !== role.id);

 fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

 await interaction.reply({
  content: `✅ ${role} removed from ticket staff.`,
  ephemeral: true
 });

}
