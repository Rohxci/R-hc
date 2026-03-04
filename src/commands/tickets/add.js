import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("add")
 .setDescription("Add a user to the ticket")
 .addUserOption(option =>
  option.setName("user")
   .setDescription("User to add")
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

  await interaction.channel.members.add(user.id);

  await interaction.reply({
   content: `✅ ${user} added to the ticket.`,
  });

 } catch {

  await interaction.reply({
   content: "❌ Could not add that user.",
   ephemeral: true
  });

 }

}
