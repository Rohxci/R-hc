import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";
import path from "path";

export default {

 data: new SlashCommandBuilder()
  .setName("setticketconfig")
  .setDescription("Configure the ticket system")
  .addChannelOption(option =>
   option
    .setName("channel")
    .setDescription("Ticket channel")
    .setRequired(true)
  )
  .addChannelOption(option =>
   option
    .setName("logs")
    .setDescription("Ticket logs channel")
    .setRequired(true)
  )
  .addRoleOption(option =>
   option
    .setName("staff")
    .setDescription("Ticket staff role")
    .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

 async execute(interaction) {

  const ticketChannel = interaction.options.getChannel("channel");
  const logChannel = interaction.options.getChannel("logs");
  const staffRole = interaction.options.getRole("staff");

  const filePath = path.join("src", "data", "ticketConfig.json");

  let data = {};

  if (fs.existsSync(filePath)) {
   data = JSON.parse(fs.readFileSync(filePath));
  }

  data[interaction.guild.id] = {

   ticketChannel: ticketChannel.id,
   ticketLogs: logChannel.id,
   staffRoles: [staffRole.id]

  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  await interaction.reply({

   content:
`✅ Ticket system configured

Channel: ${ticketChannel}
Logs: ${logChannel}
Staff: ${staffRole}`,

   ephemeral: true

  });

 }

};
