import { Events, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import fs from "fs";
import path from "path";

export default {
 name: Events.InteractionCreate,

 async execute(interaction) {

  if (!interaction.isButton()) return;

  const id = interaction.customId;

  const filePath = path.join("src", "data", "ticketConfig.json");

  let config = null;

  if (fs.existsSync(filePath)) {

   const data = JSON.parse(fs.readFileSync(filePath));
   config = data[interaction.guild.id];

  }

  /* ========================
     CLOSE TICKET
  ======================== */

  if (id === "ticket_close") {

   await interaction.reply({
    content: "🔒 Ticket closed.",
    ephemeral: true
   });

   if (config?.ticketLogs) {

    const logChannel = interaction.guild.channels.cache.get(config.ticketLogs);

    if (logChannel) {

     logChannel.send({
      content:
`🔒 **Ticket Closed**

Ticket: ${interaction.channel}
Closed by: ${interaction.user}`
     }).catch(() => {});

    }

   }

   try {
    await interaction.channel.setArchived(true);
   } catch {}

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

   if (config?.ticketLogs) {

    const logChannel = interaction.guild.channels.cache.get(config.ticketLogs);

    if (logChannel) {

     logChannel.send({
      content:
`🗑 **Ticket Deleted**

Ticket: ${interaction.channel}
Deleted by: ${interaction.user}`
     }).catch(() => {});

    }

   }

   setTimeout(() => {
    interaction.channel.delete().catch(() => {});
   }, 2000);

   return;
  }

  /* ========================
     OPEN TICKET
  ======================== */

  if (!id.startsWith("ticket_")) return;

  if (!config || !config.ticketChannel) {

   return interaction.reply({
    content: "❌ Ticket system not configured.",
    ephemeral: true
   });

  }

  const ticketChannel = interaction.guild.channels.cache.get(config.ticketChannel);

  if (!ticketChannel) {

   return interaction.reply({
    content: "❌ Ticket channel not found.",
    ephemeral: true
   });

  }

  /* CHECK EXISTING TICKET */

  const existing = interaction.guild.channels.cache.find(c =>
   c.name === `ticket-${interaction.user.id}`
  );

  if (existing) {

   return interaction.reply({
    content: "❌ You already have an open ticket.",
    ephemeral: true
   });

  }

  /* CREATE THREAD */

  const thread = await ticketChannel.threads.create({
   name: `ticket-${interaction.user.id}`,
   type: ChannelType.PublicThread
  });

  await thread.members.add(interaction.user.id);

  /* ADD STAFF */

  if (config.staffRoles) {

   for (const roleId of config.staffRoles) {

    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) continue;

    role.members.forEach(member => {
     thread.members.add(member.id).catch(() => {});
    });

   }

  }

  /* BUTTONS */

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

  /* ========================
     TICKET LOG
  ======================== */

  if (config.ticketLogs) {

   const logChannel = interaction.guild.channels.cache.get(config.ticketLogs);

   if (logChannel) {

    logChannel.send({

     content:
`🎫 **Ticket Created**

User: ${interaction.user}
Ticket: ${thread}
User ID: ${interaction.user.id}`

    }).catch(() => {});

   }

  }

 }
};
