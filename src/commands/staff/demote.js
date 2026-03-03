import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { getStaffRoles, getPreviousRole } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("demote")
    .setDescription("Demote a staff member")
    .addUserOption(o =>
      o.setName("user").setDescription("User").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const roles = getStaffRoles(interaction.guild.id);

    if (!roles)
      return interaction.reply({ content: "Staff hierarchy not configured.", ephemeral: true });

    const currentRole = roles.find(r => member.roles.cache.has(r));
    if (!currentRole)
      return interaction.reply({ content: "User is not staff.", ephemeral: true });

    const prevRole = getPreviousRole(interaction.guild.id, currentRole);
    if (!prevRole)
      return interaction.reply({ content: "User already at lowest role.", ephemeral: true });

    await member.roles.remove(currentRole);
    await member.roles.add(prevRole);

    const embed = new EmbedBuilder()
      .setColor(0xff9900)
      .setTitle("🔽 Staff Demoted")
      .setDescription(`${member.user.tag} has been demoted.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
