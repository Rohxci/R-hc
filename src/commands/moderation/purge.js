import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {

 data: new SlashCommandBuilder()
  .setName("purge")
  .setDescription("Delete messages with optional filters")

  .addIntegerOption(option =>
   option.setName("amount")
    .setDescription("Number of messages to delete")
    .setRequired(true)
  )

  .addUserOption(option =>
   option.setName("user")
    .setDescription("Delete messages from a specific user")
  )

  .addBooleanOption(option =>
   option.setName("bots")
    .setDescription("Delete only bot messages")
  )

  .addBooleanOption(option =>
   option.setName("humans")
    .setDescription("Delete only human messages")
  )

  .addRoleOption(option =>
   option.setName("role")
    .setDescription("Delete messages from a specific role")
  )

  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

 async execute(interaction) {

  await interaction.deferReply({ ephemeral: true });

  const amount = interaction.options.getInteger("amount");
  const user = interaction.options.getUser("user");
  const bots = interaction.options.getBoolean("bots");
  const humans = interaction.options.getBoolean("humans");
  const role = interaction.options.getRole("role");

  const messages = await interaction.channel.messages.fetch({ limit: 100 });

  let filtered = messages;

  if (user) {
   filtered = filtered.filter(m => m.author.id === user.id);
  }

  if (bots) {
   filtered = filtered.filter(m => m.author.bot);
  }

  if (humans) {
   filtered = filtered.filter(m => !m.author.bot);
  }

  if (role) {
   filtered = filtered.filter(m =>
    m.member && m.member.roles.cache.has(role.id)
   );
  }

  filtered = filtered.first(amount);

  if (!filtered || filtered.length === 0) {
   return interaction.editReply("No messages found matching the filters.");
  }

  await interaction.channel.bulkDelete(filtered, true);

  await interaction.editReply(`Deleted ${filtered.length} messages.`);

 }

};
