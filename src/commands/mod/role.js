import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
 .setName("role")
 .setDescription("Add or remove a role from a user")

 .addSubcommand(subcommand =>
  subcommand
   .setName("add")
   .setDescription("Add a role to a user")
   .addUserOption(option =>
    option
     .setName("user")
     .setDescription("User to give the role to")
     .setRequired(true))
   .addRoleOption(option =>
    option
     .setName("role")
     .setDescription("Role to add")
     .setRequired(true))
 )

 .addSubcommand(subcommand =>
  subcommand
   .setName("remove")
   .setDescription("Remove a role from a user")
   .addUserOption(option =>
    option
     .setName("user")
     .setDescription("User to remove the role from")
     .setRequired(true))
   .addRoleOption(option =>
    option
     .setName("role")
     .setDescription("Role to remove")
     .setRequired(true))
 )

 .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction) {

 const user = interaction.options.getUser("user");
 const role = interaction.options.getRole("role");
 const member = interaction.guild.members.cache.get(user.id);

 if (!member) {
  return interaction.reply({
   content: "User not found.",
   ephemeral: true
  });
 }

 const subcommand = interaction.options.getSubcommand();

 try {

  if (subcommand === "add") {

   await member.roles.add(role);

   return interaction.reply({
    content: `✅ Added ${role} to ${user.tag}`
   });

  }

  if (subcommand === "remove") {

   await member.roles.remove(role);

   return interaction.reply({
    content: `❌ Removed ${role} from ${user.tag}`
   });

  }

 } catch (error) {

  console.error(error);

  return interaction.reply({
   content: "Error modifying role.",
   ephemeral: true
  });

 }

}
