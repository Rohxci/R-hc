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
   return interaction.reply("Staff roles not configured.");
  }

  const guild = interaction.guild;
  const members = await guild.members.fetch();

  const embed = new EmbedBuilder()
   .setTitle("Staff Team")
   .setColor("Blue");

  for (let i = 0; i < config.hierarchy.length; i++) {

   const roleId = config.hierarchy[i];
   const role = guild.roles.cache.get(roleId);

   if (!role) continue;

   const list = [];

   members.forEach(member => {

    if (!member.roles.cache.has(config.staffRole)) return;

    const staffRoles = config.hierarchy.filter(r =>
     member.roles.cache.has(r)
    );

    if (staffRoles.length === 0) return;

    const highest = staffRoles[0];

    if (highest === roleId) {
     list.push(`<@${member.id}>`);
    }

   });

   embed.addFields({
    name: role.name,
    value: list.length ? list.join("\n") : "No members",
    inline: false
   });

  }

  await interaction.reply({ embeds: [embed] });

 }

};
