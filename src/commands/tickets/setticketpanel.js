import {
 SlashCommandBuilder,
 PermissionFlagsBits,
 EmbedBuilder,
 ActionRowBuilder,
 ButtonBuilder,
 ButtonStyle
} from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("setticketpanel")
 .setDescription("Create the ticket panel")

 .addChannelOption(option =>
  option
   .setName("channel")
   .setDescription("Channel where the panel will be sent")
   .setRequired(true)
 )

 .addStringOption(option =>
  option.setName("button1").setDescription("First ticket button").setRequired(true)
 )

 .addStringOption(option =>
  option.setName("button2").setDescription("Second ticket button").setRequired(false)
 )

 .addStringOption(option =>
  option.setName("button3").setDescription("Third ticket button").setRequired(false)
 )

 .addStringOption(option =>
  option.setName("button4").setDescription("Fourth ticket button").setRequired(false)
 )

 .addStringOption(option =>
  option.setName("button5").setDescription("Fifth ticket button").setRequired(false)
 )

 .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {

 const channel = interaction.options.getChannel("channel");

 const buttons = [
  interaction.options.getString("button1"),
  interaction.options.getString("button2"),
  interaction.options.getString("button3"),
  interaction.options.getString("button4"),
  interaction.options.getString("button5")
 ].filter(Boolean);

 const embed = new EmbedBuilder()
  .setColor("#ff69b4")
  .setTitle("🎫 Support Center")
  .setDescription("Click a button below to open a ticket.")
  .setTimestamp();

 const row = new ActionRowBuilder();

 buttons.forEach((name, index) => {

  row.addComponents(
   new ButtonBuilder()
    .setCustomId(`ticket_${index}`)
    .setLabel(name)
    .setStyle(ButtonStyle.Primary)
  );

 });

 await channel.send({
  embeds: [embed],
  components: [row]
 });

 await interaction.reply({
  content: "✅ Ticket panel created.",
  ephemeral: true
 });

}
