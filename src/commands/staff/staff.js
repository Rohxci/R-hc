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

  for (let i = 0; i < config.hierarchy.length; i++) {

   const roleId = config.hierarchy[i];
   const role = interaction.guild.roles.cache.get(roleId);

   if (!role) continue;

   const members = role.members.map(member => `<@${member.id}>`);

   embed.addFields({
    name: role.name,
    value: members.length ? members.join("\n") : "No members",
    inline: false
   });

  }

  await interaction.reply({ embeds: [embed] });

 }

};
