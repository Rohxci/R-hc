import { Events, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import fs from "fs";
import path from "path";

export default {
 name: Events.InteractionCreate,

 async execute(interaction) {

  if (!interaction.isButton()) return;

  const id = interaction.customId;

  /* ========================
     CLOSE TICKET
  ======================== */

  if (id === "ticket_close") {

   await interaction.reply({
    content: "🔒 Ticket closed.",
    ephemeral: true
   });

   await interaction.channel.setLocked(true);

   return;

  }

  /* ========================
     DELETE TICKET
  ======================== */

  if (id === "ticket_delete") {

   await interaction.reply({
    content: "🗑 Deleting ticket...",
    ephemeral: true
   });

   setTimeout(() => {
    interaction.channel.delete().catch(() => {});
   }, 2000);

   return;

  }

  /* ========================
     OPEN TICKET
  ======================== */

  if (!id.startsWith("ticket_")) return;

  const filePath = path.join("src", "data", "ticketConfig.json");

  if (!fs.existsSync(filePath)) return;

  const data = JSON.parse(fs.readFileSync(filePath));
  const config = data[interaction.guild.id];

  if (!config || !config.ticketChannel) {

   return interaction.reply({
    content: "❌ Ticket system not configured.",
    ephemeral: true
   });

  }

  const ticketChannel = interaction.guild.channels.cache.get(config.ticketChannel);

  const existing = interaction.guild.channels.cache.find(c =>
   c.name === `ticket-${interaction.user.id}`
  );

  if (existing) {

   return interaction.reply({
    content: "❌ You already have an open ticket.",
    ephemeral: true
   });

  }

  const thread = await ticketChannel.threads.create({
   name: `ticket-${interaction.user.username}`,
   type: ChannelType.PrivateThread,
   invitable: false
  });

  await thread.members.add(interaction.user.id);

  if (config.staffRoles) {

   for (const roleId of config.staffRoles) {

    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) continue;

    role.members.forEach(member => {
     thread.members.add(member.id).catch(() => {});
    });

   }

  }

  const row = new ActionRowBuilder().addComponents(

   new ButtonBuilder()
    .setCustomId("ticket_close")
    .setLabel("Close Ticket")
    .setStyle(ButtonStyle.Secondary),

   new ButtonBuilder()
    .setCustomId("ticket_delete")
    .setLabel("Delete Ticket")
    .setStyle(ButtonStyle.Danger)

  );

  await thread.send({
   content: `Hello ${interaction.user}

Please explain your issue. A staff member will assist you shortly.`,
   components: [row]
  });

  await interaction.reply({
   content: `✅ Ticket created: ${thread}`,
   ephemeral: true
  });

 }
};
