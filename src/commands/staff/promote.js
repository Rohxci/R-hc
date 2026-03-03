import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { getStaffRoles, getNextRole } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("promote")
    .setDescription("Promote a staff member")
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

    const nextRole = getNextRole(interaction.guild.id, currentRole);
    if (!nextRole)
      return interaction.reply({ content: "User already at highest role.", ephemeral: true });

    await member.roles.remove(currentRole);
    await member.roles.add(nextRole);

    const embed = new EmbedBuilder()
      .setColor(0x3399ff)
      .setTitle("🔼 Staff Promoted")
      .setDescription(`${member.user.tag} has been promoted.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { getStaffRoles, getNextRole } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("promote")
    .setDescription("Promote a staff member")
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

    const nextRole = getNextRole(interaction.guild.id, currentRole);
    if (!nextRole)
      return interaction.reply({ content: "User already at highest role.", ephemeral: true });

    await member.roles.remove(currentRole);
    await member.roles.add(nextRole);

    const embed = new EmbedBuilder()
      .setColor(0x3399ff)
      .setTitle("🔼 Staff Promoted")
      .setDescription(`${member.user.tag} has been promoted.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
