import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("remove")
 .setDescription("Remove a user from the ticket")
 .addUserOption(option =>
  option.setName("user")
   .setDescription("User to remove")
   .setRequired(true)
 )
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {

 const user = interaction.options.getUser("user");

 if (!interaction.channel.isThread()) {
  return interaction.reply({
   content: "❌ This command can only be used inside a ticket.",
   ephemeral: true
  });
 }

 try {

  await interaction.channel.members.remove(user.id);

  await interaction.reply({
   content: `✅ ${user} removed from the ticket.`,
  });

 } catch {

  await interaction.reply({
   content: "❌ Could not remove that user.",
   ephemeral: true
  });

 }

}
