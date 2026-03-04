import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {

 data: new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows all bot commands"),

 async execute(interaction) {

  const embed = new EmbedBuilder()

   .setTitle("⚙️ RÒH Bot Commands")

   .setColor("#f47fff")

   .addFields(

    {
     name: "🛡️ Moderation",
     value:
`/ban — Ban a user
/kick — Kick a user
/warn — Warn a user
/warnings — Show user warnings
/clearwarnings — Remove warnings
/clear — Delete messages
/timeout — Timeout a user
/slowmode — Set channel slowmode
/lock — Lock a channel
/unlock — Unlock a channel`
    },

    {
     name: "👮 Staff Management",
     value:
`/hire — Add staff member
/fire — Remove staff member
/promote — Promote staff
/demote — Demote staff
/staff — Show staff list
/setstaffroles — Configure staff roles`
    },

    {
     name: "🎫 Ticket System",
     value:
`/ticketpanel — Create ticket panel
/setticketchannel — Set ticket channel
/setticketlog — Set ticket log
/setticketstaff — Set ticket staff roles
/add — Add user to ticket
/remove — Remove user from ticket
/ticketlist — Show open tickets
/clearalltickets — Delete all tickets`
    },

    {
     name: "📢 Utility",
     value:
`/announce — Send announcement
/userinfo — Show user info
/role — Manage roles`
    }

   )

   .setFooter({
    text: "RÒH Bot • Moderation & Ticket System"
   });

  await interaction.reply({
   embeds: [embed],
   ephemeral: true
  });

 }

};
