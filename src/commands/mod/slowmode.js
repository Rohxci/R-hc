import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode")
    .addIntegerOption(option =>
      option.setName("seconds").setDescription("Seconds").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger("seconds");

    await interaction.channel.setRateLimitPerUser(seconds);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🐢 Slowmode Updated")
      .setDescription(`Slowmode set to ${seconds} seconds.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
