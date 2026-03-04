import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export const data = new SlashCommandBuilder()
 .setName("ticketstaff")
 .setDescription("Show ticket staff roles");

export async function execute(interaction) {

 const filePath = path.join("src", "data", "ticketConfig.json");

 if (!fs.existsSync(filePath)) {

  return interaction.reply({
   content: "Ticket system not configured.",
   ephemeral: true
  });

 }

 const data = JSON.parse(fs.readFileSync(filePath));
 const config = data[interaction.guild.id];

 if (!config || !config.staffRoles || config.staffRoles.length === 0) {

  return interaction.reply({
   content: "No ticket staff roles configured.",
   ephemeral: true
  });

 }

 const roles = config.staffRoles
  .map(id => `<@&${id}>`)
  .join("\n");

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle("🎫 Ticket Staff")
  .setDescription(roles)
  .setTimestamp();

 await interaction.reply({
  embeds: [embed]
 });

}
