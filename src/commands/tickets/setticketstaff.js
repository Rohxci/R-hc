import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("setticketstaff")
 .setDescription("Set the staff roles that can access tickets")

 .addRoleOption(option => option.setName("role1").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role2").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role3").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role4").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role5").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role6").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role7").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role8").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role9").setDescription("Staff role").setRequired(false))
 .addRoleOption(option => option.setName("role10").setDescription("Staff role").setRequired(false))

 .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {

 const roles = [
  interaction.options.getRole("role1"),
  interaction.options.getRole("role2"),
  interaction.options.getRole("role3"),
  interaction.options.getRole("role4"),
  interaction.options.getRole("role5"),
  interaction.options.getRole("role6"),
  interaction.options.getRole("role7"),
  interaction.options.getRole("role8"),
  interaction.options.getRole("role9"),
  interaction.options.getRole("role10")
 ]
 .filter(Boolean)
 .map(role => role.id);

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
