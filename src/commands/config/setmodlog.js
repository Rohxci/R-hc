import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

export const data = new SlashCommandBuilder()
.setName("setmodlog")
.setDescription("Set the moderation log channel")
.addChannelOption(option =>
    option.setName("channel")
    .setDescription("Channel for mod logs")
    .setRequired(true)
)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {

const channel = interaction.options.getChannel("channel");

let data = {};

try {
data = JSON.parse(fs.readFileSync("./src/data/modLog.json"));
} catch {
data = {};
}

data[interaction.guild.id] = channel.id;

fs.writeFileSync("./src/data/modLog.json", JSON.stringify(data, null, 2));

await interaction.reply({
content: `✅ Mod log set to ${channel}`,
ephemeral: true
});

}
