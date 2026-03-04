import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("setticketstaff")
 .setDescription("Set the staff roles that can access tickets")

 .addRoleOption(option =>
  option
   .setName("role1")
   .setDescription("First staff role")
   .setRequired(true)
 )

 .addRoleOption(option =>
  option
   .setName("role2")
   .setDescription("Second staff role")
   .setRequired(false)
 )

 .addRoleOption(option =>
  option
   .setName("role3")
   .setDescription("Third staff role")
   .setRequired(false)
 )

 .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {

 const role1 = interaction.options.getRole("role1");
 const role2 = interaction.options.getRole("role2");
 const role3 = interaction.options.getRole("role3");

 const roles = [role1?.id, role2?.id, role3?.id].filter(Boolean);

 const filePath = path.join("src", "data", "ticketConfig.json");

 let data = {};

 if (fs.existsSync(filePath)) {
  data = JSON.parse(fs.readFileSync(filePath));
 }

 if (!data[interaction.guild.id]) {
  data[interaction.guild.id] = {};
 }

 data[interaction.guild.id].staffRoles = roles;

 fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

 await interaction.reply({
  content: "✅ Ticket staff roles updated.",
  ephemeral: true
 });

}
