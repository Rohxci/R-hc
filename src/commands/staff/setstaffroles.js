import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

const file = "src/data/staffConfig.json";

export default {
 data: new SlashCommandBuilder()
  .setName("setstaffroles")
  .setDescription("Set staff role and hierarchy")
  .addRoleOption(option =>
   option.setName("staffrole")
    .setDescription("Main staff role")
    .setRequired(true)
  )
  .addRoleOption(option =>
   option.setName("role1")
    .setDescription("Highest role")
    .setRequired(true)
  )
  .addRoleOption(option =>
   option.setName("role2")
    .setDescription("Second role")
    .setRequired(true)
  )
  .addRoleOption(option =>
   option.setName("role3")
    .setDescription("Third role")
  )
  .addRoleOption(option =>
   option.setName("role4")
    .setDescription("Fourth role")
  )
  .addRoleOption(option =>
   option.setName("role5")
    .setDescription("Fifth role")
  )
  .addRoleOption(option =>
   option.setName("role6")
    .setDescription("Lowest role")
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

 async execute(interaction) {

  const staffRole = interaction.options.getRole("staffrole");

  const roles = [
   interaction.options.getRole("role1"),
   interaction.options.getRole("role2"),
   interaction.options.getRole("role3"),
   interaction.options.getRole("role4"),
   interaction.options.getRole("role5"),
   interaction.options.getRole("role6")
  ].filter(Boolean);

  const config = {
   staffRole: staffRole.id,
   hierarchy: roles.map(r => r.id).reverse()
  };

  fs.writeFileSync(file, JSON.stringify(config, null, 2));

  await interaction.reply("Staff hierarchy configured successfully.");

 }
};
