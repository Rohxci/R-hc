import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

export default {

 data: new SlashCommandBuilder()
  .setName("promote")
  .setDescription("Promote a staff member")
  .addUserOption(o =>
   o.setName("user").setDescription("User").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

 async execute(interaction) {

  const member = interaction.options.getMember("user");

  const config = JSON.parse(
   fs.readFileSync("src/data/staffConfig.json")
  );

  if (!config.hierarchy || config.hierarchy.length === 0) {
   return interaction.reply("Staff hierarchy not configured.");
  }

  const roles = config.hierarchy;

  let currentIndex = -1;

  for (let i = 0; i < roles.length; i++) {
   if (member.roles.cache.has(roles[i])) {
    currentIndex = i;
    break;
   }
  }

  if (currentIndex === -1) {
   return interaction.reply("User is not staff.");
  }

  if (currentIndex === 0) {
   return interaction.reply("User is already highest rank.");
  }

  const newRole = interaction.guild.roles.cache.get(roles[currentIndex - 1]);
  const oldRole = interaction.guild.roles.cache.get(roles[currentIndex]);

  await member.roles.remove(oldRole);
  await member.roles.add(newRole);

  await interaction.reply(`${member} promoted to ${newRole.name}`);

 }

};
