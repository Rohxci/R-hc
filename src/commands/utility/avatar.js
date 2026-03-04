import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("avatar")
 .setDescription("Show a user's avatar")
 .addUserOption(option =>
  option
   .setName("user")
   .setDescription("User to show the avatar of")
   .setRequired(false)
 );

export async function execute(interaction) {

 const user = interaction.options.getUser("user") || interaction.user;

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle(`${user.tag}'s Avatar`)
  .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
  .setFooter({ text: `Requested by ${interaction.user.tag}` });

 await interaction.reply({
  embeds: [embed]
 });

}
