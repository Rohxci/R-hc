import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { setCornerChannel } from "../../utils/cornerLogManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("setcornerlog")
    .setDescription("Set the channel where the bot will send status logs")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Select the channel")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    if (!channel.isTextBased()) {
      return interaction.reply({
        content: "You must select a text channel.",
        ephemeral: true
      });
    }

    setCornerChannel(interaction.guild.id, channel.id);

    const embed = new EmbedBuilder()
      .setColor(0x00ffcc)
      .setTitle("📡 Corner Log Channel Set")
      .setDescription(`Corner logs will now be sent in ${channel}.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
