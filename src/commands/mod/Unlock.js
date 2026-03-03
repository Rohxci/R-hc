import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock the channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: null }
    );

    const embed = new EmbedBuilder()
      .setColor(0x33ff99)
      .setTitle("🔓 Channel Unlocked")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
