import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { setStaffRoles } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setstaffroles")
    .setDescription("Set staff hierarchy (lowest → highest)")
    .addStringOption(option =>
      option
        .setName("roles")
        .setDescription("Mention roles in order separated by space (lowest → highest)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {

    const input = interaction.options.getString("roles");

    // Extract role IDs from mentions
    const roleIds = [...input.matchAll(/<@&(\d+)>/g)].map(match => match[1]);

    if (roleIds.length < 2) {
      return interaction.reply({
        content: "You must mention at least 2 roles in order.",
        ephemeral: true
      });
    }

    // Validate roles exist in guild
    const validRoles = roleIds.filter(id => interaction.guild.roles.cache.has(id));

    if (validRoles.length !== roleIds.length) {
      return interaction.reply({
        content: "One or more mentioned roles are invalid.",
        ephemeral: true
      });
    }

    setStaffRoles(interaction.guild.id, validRoles);

    const embed = new EmbedBuilder()
      .setColor(0x00ffff)
      .setTitle("✅ Staff Hierarchy Configured")
      .setDescription(
        `Hierarchy saved successfully.\n\n` +
        `Order (Lowest → Highest):\n` +
        validRoles
          .map(id => `<@&${id}>`)
          .join(" → ")
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
