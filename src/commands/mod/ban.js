import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User to ban").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("🔨 User Banned")
      .addFields(
        { name: "User", value: member.user.tag },
        { name: "Moderator", value: interaction.user.tag },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
