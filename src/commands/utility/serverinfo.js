import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("serverinfo")
 .setDescription("Show information about the server");

export async function execute(interaction) {

 const guild = interaction.guild;

 const owner = await guild.fetchOwner();

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle(guild.name)
  .setThumbnail(guild.iconURL({ dynamic: true }))

  .addFields(
   { name: "Server ID", value: guild.id, inline: true },
   { name: "Owner", value: owner.user.tag, inline: true },
   { name: "Members", value: `${guild.memberCount}`, inline: true },
   { name: "Channels", value: `${guild.channels.cache.size}`, inline: true },
   { name: "Boost Level", value: `${guild.premiumTier}`, inline: true },
   { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` }
  )

  .setFooter({ text: `Requested by ${interaction.user.tag}` })
  .setTimestamp();

 await interaction.reply({ embeds: [embed] });

}
