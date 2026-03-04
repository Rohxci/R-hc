import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {

 data: new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show all bot commands"),

 async execute(interaction) {

  const embed = new EmbedBuilder()

   .setTitle("RÒH BOT COMMANDS")

   .setColor("#f47fff")

   .addFields(

    {
     name: "🛡 Moderation",
     value:
`/ban
/kick
/timeout
/warn
/warnings
/clearwarnings
/clear
/slowmode
/lock
/unlock
/role`
    },

    {
     name: "👮 Staff Management",
     value:
`/hire
/fire
/promote
/demote
/staff
/setstaffroles`
    },

    {
     name: "🎫 Ticket System",
     value:
`/ticketpanel
/setticketconfig
/ticketstatus
/setticketchannel
/setticketstaff
/setticketlogs
/add
/remove
/ticketlist
/clearalltickets`
    },

    {
     name: "⚙ Utility",
     value:
`/announce
/userinfo
/help`
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
