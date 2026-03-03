import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { addWarning } from "../../utils/warningManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User to warn").setRequired(true))
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (target.bot)
      return interaction.reply({ content: "You cannot warn a bot.", ephemeral: true });

    const total = addWarning(
      interaction.guild.id,
      target.id,
      interaction.user.tag,
      reason
    );

    const embed = new EmbedBuilder()
      .setColor(0xffaa00)
      .setTitle("User Warned")
      .addFields(
        { name: "User", value: `${target.tag}` },
        { name: "Moderator", value: interaction.user.tag },
        { name: "Reason", value: reason },
        { name: "Total Warnings", value: total.toString() }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
