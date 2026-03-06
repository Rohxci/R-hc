import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

const path = "src/data/staffConfig.json";

export default {

 data: new SlashCommandBuilder()
  .setName("setstaffroles")
  .setDescription("Configure staff roles hierarchy")

  .addRoleOption(o =>
   o.setName("staffrole")
    .setDescription("Base staff role")
    .setRequired(true)
  )

  .addRoleOption(o =>
   o.setName("role1")
    .setDescription("Highest staff role")
    .setRequired(true)
  )

  .addRoleOption(o =>
   o.setName("role2")
    .setDescription("Second staff role")
    .setRequired(true)
  )

  .addRoleOption(o =>
   o.setName("role3")
    .setDescription("Third staff role")
  )

  .addRoleOption(o =>
   o.setName("role4")
    .setDescription("Fourth staff role")
  )

  .addRoleOption(o =>
   o.setName("role5")
    .setDescription("Fifth staff role")
  )

  .addRoleOption(o =>
   o.setName("role6")
    .setDescription("Lowest staff role")
  )

  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

 async execute(interaction) {

  const staffRole = interaction.options.getRole("staffrole");

  const hierarchy = [
   interaction.options.getRole("role1"),
   interaction.options.getRole("role2"),
   interaction.options.getRole("role3"),
   interaction.options.getRole("role4"),
   interaction.options.getRole("role5"),
   interaction.options.getRole("role6")
  ].filter(Boolean);

  const data = {
   staffRole: staffRole.id,
   hierarchy: hierarchy.map(r => r.id)
  };

  fs.writeFileSync(path, JSON.stringify(data, null, 2));

  await interaction.reply("Staff roles configured.");

 }

};
