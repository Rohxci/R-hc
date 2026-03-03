import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock the channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: false }
    );

    const embed = new EmbedBuilder()
      .setColor(0x6600ff)
      .setTitle("🔒 Channel Locked")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
