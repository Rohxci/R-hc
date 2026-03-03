import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { getWarnings } from "../../utils/warningManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View warnings of a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const warnings = getWarnings(interaction.guild.id, target.id);

    if (!warnings.length) {
      return interaction.reply({
        content: "This user has no warnings.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xffcc00)
      .setTitle(`Warnings for ${target.tag}`)
      .setTimestamp();

    warnings.forEach((w, index) => {
      embed.addFields({
        name: `Warning ${index + 1}`,
        value: `Moderator: ${w.moderator}\nReason: ${w.reason}\nDate: ${w.date}`
      });
    });

    await interaction.reply({ embeds: [embed] });
  }
};
