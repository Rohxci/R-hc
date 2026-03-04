import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("help")
 .setDescription("Show all bot commands");

export async function execute(interaction) {

 const embed = new EmbedBuilder()
  .setColor("#ffffff")
  .setTitle("RÒH Bot Commands")

  .addFields(
   {
    name: "🛡️ Moderation",
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
/role`,
    inline: false
   },
   {
    name: "👮 Staff Management",
    value:
`/hire
/fire
/promote
/demote
/staff
/setstaffroles`,
    inline: false
   },
   {
    name: "🎫 Ticket System",
    value:
`/setticketchannel
/setticketstaff
/setticketlogs
/setticketpanel`,
    inline: false
   },
   {
    name: "⚙️ Configuration",
    value:
`/setmodlog`,
    inline: false
   },
   {
    name: "🔧 Utility",
    value:
`/ping
/userinfo
/avatar
/serverinfo
/botinfo
/announce
/help`,
    inline: false
   }
  )

  .setFooter({ text: "RÒH Bot" })
  .setTimestamp();

 await interaction.reply({ embeds: [embed] });

}
