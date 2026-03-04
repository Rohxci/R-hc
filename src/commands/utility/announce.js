import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("announce")
 .setDescription("Send an announcement")
 .addChannelOption(option =>
  option
   .setName("channel")
   .setDescription("Channel to send the announcement")
   .setRequired(true)
 )
 .addStringOption(option =>
  option
   .setName("title")
   .setDescription("Announcement title")
   .setRequired(true)
 )
 .addStringOption(option =>
  option
   .setName("message")
   .setDescription("Announcement message")
   .setRequired(true)
 )
 .addRoleOption(option =>
  option
   .setName("ping")
   .setDescription("Role to ping")
   .setRequired(false)
 )
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction) {

 const channel = interaction.options.getChannel("channel");
 const title = interaction.options.getString("title");
 const message = interaction.options.getString("message");
 const role = interaction.options.getRole("ping");

 const embed = new EmbedBuilder()
  .setColor("#ff69b4")
  .setTitle(title)
  .setDescription(message)
  .setFooter({ text: "Announcement" })
  .setTimestamp();

 try {

  await channel.send({
   content: role ? `${role}` : null,
   embeds: [embed]
  });

  await interaction.reply({
   content: "✅ Announcement sent.",
   ephemeral: true
  });

 } catch (error) {

  console.error(error);

  await interaction.reply({
   content: "❌ Failed to send announcement.",
   ephemeral: true
  });

 }

}
