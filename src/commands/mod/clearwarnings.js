import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { clearWarnings } from "../../utils/warningManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clearwarnings")
    .setDescription("Clear all warnings for a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("user");

    clearWarnings(interaction.guild.id, target.id);

    await interaction.reply({
      content: `All warnings cleared for ${target.tag}.`,
      ephemeral: true
    });
  }
};
