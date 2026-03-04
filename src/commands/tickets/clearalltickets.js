import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("clearalltickets")
 .setDescription("Delete all ticket threads in the server")
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {

 await interaction.reply({
  content: "🧹 Clearing all tickets...",
  ephemeral: true
 });

 let count = 0;

 const threads = interaction.guild.channels.cache.filter(c =>
  c.isThread() && c.name.startsWith("ticket-")
 );

 for (const thread of threads.values()) {

  try {
   await thread.delete();
   count++;
  } catch {}

 }

 await interaction.followUp({
  content: `✅ Deleted ${count} tickets.`,
  ephemeral: true
 });

}
