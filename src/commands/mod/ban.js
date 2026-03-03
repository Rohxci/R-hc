import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("The user to ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: "User not found in this server.", ephemeral: true });
    }

    if (target.id === interaction.user.id) {
      return interaction.reply({ content: "You cannot ban yourself.", ephemeral: true });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: "You cannot ban someone with an equal or higher role.", ephemeral: true });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: "I do not have permission to ban members.", ephemeral: true });
    }

    try {
      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("User Banned")
        .addFields(
          { name: "User", value: `${target.tag} (${target.id})` },
          { name: "Moderator", value: interaction.user.tag },
          { name: "Reason", value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "Failed to ban the user.", ephemeral: true });
    }
  }
};
