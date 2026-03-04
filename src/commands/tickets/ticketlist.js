import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("ticketlist")
 .setDescription("Show all open tickets")
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {

 const threads = interaction.guild.channels.cache
  .filter(c => c.isThread() && c.name.startsWith("ticket-"));

 if (threads.size === 0) {

  return interaction.reply({
   content: "No open tickets.",
   ephemeral: true
  });

 }

 const list = threads.map(t => `${t}`).join("\n");

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle("🎫 Open Tickets")
  .setDescription(list)
  .setTimestamp();

 await interaction.reply({
  embeds: [embed],
  ephemeral: true
 });

}
