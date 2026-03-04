import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("botinfo")
 .setDescription("Show information about the bot");

export async function execute(interaction) {

 const uptime = process.uptime();

 const hours = Math.floor(uptime / 3600);
 const minutes = Math.floor((uptime % 3600) / 60);
 const seconds = Math.floor(uptime % 60);

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle("Bot Information")

  .addFields(
   { name: "Bot Name", value: interaction.client.user.tag, inline: true },
   { name: "Ping", value: `${interaction.client.ws.ping}ms`, inline: true },
   { name: "Servers", value: `${interaction.client.guilds.cache.size}`, inline: true },
   { name: "Uptime", value: `${hours}h ${minutes}m ${seconds}s`, inline: true },
   { name: "Node Version", value: process.version, inline: true }
  )

  .setFooter({ text: `Requested by ${interaction.user.tag}` })
  .setTimestamp();

 await interaction.reply({ embeds: [embed] });

}
