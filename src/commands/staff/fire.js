import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { getStaffRoles } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("fire")
    .setDescription("Remove all staff roles from a user")
    .addUserOption(o =>
      o.setName("user").setDescription("User").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const roles = getStaffRoles(interaction.guild.id);

    if (!roles)
      return interaction.reply({ content: "Staff hierarchy not configured.", ephemeral: true });

    for (const roleId of roles) {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("🔴 Staff Removed")
      .setDescription(`${member.user.tag} is no longer staff.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
