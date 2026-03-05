import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";

export default {

 data: new SlashCommandBuilder()
  .setName("staff")
  .setDescription("Show the staff team"),

 async execute(interaction) {

  const config = JSON.parse(
   fs.readFileSync("src/data/staffConfig.json")
  );

  if (!config.hierarchy || config.hierarchy.length === 0) {
   return interaction.reply("Staff hierarchy not configured.");
  }

  const embed = new EmbedBuilder()
   .setTitle("Staff Team")
   .setColor("Blue");

  for (const roleId of config.hierarchy) {

   const role = interaction.guild.roles.cache.get(roleId);
   if (!role) continue;

   const members = role.members.map(m => `<@${m.id}>`);

   embed.addFields({
    name: role.name,
    value: members.length ? members.join("\n") : "No members",
    inline: false
   });

  }

  await interaction.reply({ embeds: [embed] });

 }

};
