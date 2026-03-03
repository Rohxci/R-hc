import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true))
    .addIntegerOption(option =>
      option.setName("minutes").setDescription("Minutes").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const minutes = interaction.options.getInteger("minutes");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    await member.timeout(minutes * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle("⏳ User Timed Out")
      .addFields(
        { name: "User", value: member.user.tag },
        { name: "Duration", value: `${minutes} minutes` },
        { name: "Moderator", value: interaction.user.tag },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
