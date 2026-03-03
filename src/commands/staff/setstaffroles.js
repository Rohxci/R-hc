import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { setStaffRoles } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setstaffroles")
    .setDescription("Set staff hierarchy (lowest → highest)")
    .addRoleOption(option =>
      option.setName("lowest")
        .setDescription("Lowest staff role")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("second")
        .setDescription("Second level role")
        .setRequired(true))
    .addRoleOption(option =>
      option.setName("third")
        .setDescription("Third level role")
        .setRequired(false))
    .addRoleOption(option =>
      option.setName("highest")
        .setDescription("Highest level role")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const roles = [];

    const lowest = interaction.options.getRole("lowest");
    const second = interaction.options.getRole("second");
    const third = interaction.options.getRole("third");
    const highest = interaction.options.getRole("highest");

    roles.push(lowest.id);
    roles.push(second.id);

    if (third) roles.push(third.id);
    if (highest) roles.push(highest.id);

    setStaffRoles(interaction.guild.id, roles);

    const embed = new EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle("✅ Staff Hierarchy Configured")
      .setDescription("Hierarchy saved successfully.\nOrder: Lowest → Highest")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
