import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

export default {
 data: new SlashCommandBuilder()
  .setName("hire")
  .setDescription("Hire a staff member")
  .addUserOption(o =>
   o.setName("user").setDescription("User").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

 async execute(interaction) {

  const member = interaction.options.getMember("user");

  const config = JSON.parse(fs.readFileSync("src/data/staffConfig.json"));

  const staffRole = interaction.guild.roles.cache.get(config.staffRole);
  const lowestRole = interaction.guild.roles.cache.get(config.hierarchy[config.hierarchy.length - 1]);

  await member.roles.add(staffRole);
  await member.roles.add(lowestRole);

  await interaction.reply(`${member} hired to staff`);

 }
};
