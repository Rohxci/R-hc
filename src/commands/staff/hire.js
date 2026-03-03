import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { getStaffRoles } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("hire")
    .setDescription("Hire a user as staff (lowest role)")
    .addUserOption(o =>
      o.setName("user").setDescription("User to hire").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const roles = getStaffRoles(interaction.guild.id);

    if (!roles)
      return interaction.reply({ content: "Staff hierarchy not configured.", ephemeral: true });

    const lowestRole = roles[0];

    await member.roles.add(lowestRole);

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle("🟢 Staff Hired")
      .setDescription(`${member.user.tag} is now staff.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
