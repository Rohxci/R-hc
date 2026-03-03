import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getStaffRoles } from "../../utils/staffManager.js";

export default {
  data: new SlashCommandBuilder()
    .setName("staff")
    .setDescription("Show all staff members"),

  async execute(interaction) {
    const roles = getStaffRoles(interaction.guild.id);

    if (!roles)
      return interaction.reply({ content: "Staff hierarchy not configured.", ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(0x9966ff)
      .setTitle("👥 Staff Members")
      .setTimestamp();

    for (const roleId of roles) {
      const role = interaction.guild.roles.cache.get(roleId);
      if (!role) continue;

      const members = role.members.map(m => m.user.tag).join("\n") || "None";

      embed.addFields({
        name: role.name,
        value: members,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
