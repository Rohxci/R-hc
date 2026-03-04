import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("userinfo")
 .setDescription("Show information about a user")
 .addUserOption(option =>
  option
   .setName("user")
   .setDescription("User to check")
   .setRequired(false)
 );

export async function execute(interaction) {

 const user = interaction.options.getUser("user") || interaction.user;
 const member = interaction.guild.members.cache.get(user.id);

 const roles = member.roles.cache
  .filter(role => role.id !== interaction.guild.id)
  .map(role => role)
  .join(", ") || "None";

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle(`${user.tag}`)
  .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))

  .addFields(
   { name: "User ID", value: user.id, inline: true },
   { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
   { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
   { name: "Roles", value: roles }
  )

  .setFooter({ text: `Requested by ${interaction.user.tag}` })
  .setTimestamp();

 await interaction.reply({ embeds: [embed] });

}
