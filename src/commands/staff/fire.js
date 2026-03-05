import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

export default {
 data: new SlashCommandBuilder()
  .setName("fire")
  .setDescription("Remove staff member")
  .addUserOption(o =>
   o.setName("user").setDescription("User").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

 async execute(interaction) {

  const member = interaction.options.getMember("user");

  const config = JSON.parse(fs.readFileSync("src/data/staffConfig.json"));

  const roles = [config.staffRole, ...config.hierarchy];

  for (const id of roles) {

   const role = interaction.guild.roles.cache.get(id);

   if (role && member.roles.cache.has(id)) {
    await member.roles.remove(role);
   }

  }

  await interaction.reply(`${member} removed from staff`);

 }
};
