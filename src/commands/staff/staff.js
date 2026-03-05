import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";

export default {

 data: new SlashCommandBuilder()
  .setName("staff")
  .setDescription("Show the staff list"),

 async execute(interaction) {

  const config = JSON.parse(fs.readFileSync("src/data/staffConfig.json"));

  const embed = new EmbedBuilder()
   .setTitle("Staff Team")
   .setColor("Blue");

  for (const roleId of config.hierarchy) {

   const role = interaction.guild.roles.cache.get(roleId);

   if (!role) continue;

   const members = role.members.map(m => `<@${m.id}>`);

   if (members.length === 0) continue;

   embed.addFields({
    name: role.name,
    value: members.join("\n"),
    inline: false
   });

  }

  if (embed.data.fields?.length === 0) {

   embed.setDescription("No staff members found.");

  }

  await interaction.reply({ embeds: [embed] });

 }

};
