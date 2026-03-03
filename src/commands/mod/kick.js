import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User to kick").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!member)
      return interaction.reply({ content: "User not found.", ephemeral: true });

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor(0xff8800)
      .setTitle("👢 User Kicked")
      .addFields(
        { name: "User", value: member.user.tag },
        { name: "Moderator", value: interaction.user.tag },
        { name: "Reason", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
