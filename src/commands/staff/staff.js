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

  const embed = new EmbedBuilder()
   .setTitle("Staff Team")
   .setColor("Blue");

  const processed = new Set();

  for (const roleId of config.hierarchy) {

   const role = interaction.guild.roles.cache.get(roleId);
   if (!role) continue;

   const members = role.members
    .filter(member => !processed.has(member.id))
    .map(member => {
      processed.add(member.id);
      return `<@${member.id}>`;
    });

   embed.addFields({
    name: role.name,
    value: members.length ? members.join("\n") : "No members",
    inline: false
   });

  }

  await interaction.reply({ embeds: [embed] });

 }

};
