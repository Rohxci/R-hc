import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "fs";

export default {

 data: new SlashCommandBuilder()
  .setName("staff")
  .setDescription("Show the staff team"),

 async execute(interaction) {

  await interaction.deferReply();

  const config = JSON.parse(
   fs.readFileSync("src/data/staffConfig.json")
  );

  const embed = new EmbedBuilder()
   .setTitle("Staff Team")
   .setColor("Blue");

  const guildMembers = await interaction.guild.members.fetch();

  for (let i = 0; i < config.hierarchy.length; i++) {

   const roleId = config.hierarchy[i];
   const role = interaction.guild.roles.cache.get(roleId);

   if (!role) continue;

   const members = guildMembers.filter(member => {

    if (!member.roles.cache.has(roleId)) return false;

    for (let j = 0; j < i; j++) {
     if (member.roles.cache.has(config.hierarchy[j])) {
      return false;
     }
    }

    return true;

   });

   const list = members.map(m => `<@${m.id}>`).join("\n");

   embed.addFields({
    name: role.name,
    value: list || "No members",
    inline: false
   });

  }

  await interaction.editReply({ embeds: [embed] });

 }

};
