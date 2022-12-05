import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ApplicationCommand } from 'discord.js';
import { clientId, token } from './config.json';
const rest = new REST({ version: '10' }).setToken(token);

const commands = [
    new SlashCommandBuilder()
        .setName("ban")
        .setDescription("ban someone lol")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption(opt => opt
            .setName("user")
            .setDescription("user to ban lol")
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName("reason")
        ),
    
    new SlashCommandBuilder()
        .setName("soft-ban")
        .setDescription("soft ban someone lol")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addUserOption(opt => opt
            .setName("user")
            .setDescription("user to soft ban lol")
            .setRequired(true)
        )
        .addNumberOption(opt => opt
            .setName("days")
            .setDescription("messages sent by the user in the selected number of days will be removed")
            .setRequired(true)
            .setMinValue(1)
        )
        .addStringOption(opt => opt
            .setName("reason")
        ),

    new SlashCommandBuilder()
        .setName("kick")
        .setDescription("kick someone out of this server lol")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(opt => opt
            .setName("user")
            .setDescription("user to ban lol")
            .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("timeout someone lol")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(opt => opt
            .setName("user")
            .setDescription("user to timeout lol")
            .setRequired(true)
        )
        .addNumberOption(opt => opt
            .setName("seconds")
            .setDescription("seconds to timeout for")
            .setRequired(true)
            .setMinValue(5)
        ),

    new SlashCommandBuilder()
        .setName("purge")
        .setDescription("purge messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addNumberOption(opt => opt
            .setName("messages")
            .setDescription("number of messages to purge")
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(2)
        ),

    new SlashCommandBuilder()
        .setName("settings")
        .setDescription("global guild-wide settings")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addBooleanOption(opt => opt
            .setName("ephemeral-response")
            .setDescription("set whether my responses will be ephemeral")
            .setRequired(true)
        ),
].map(cmd => cmd.toJSON());


(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(Routes.applicationCommands(clientId), { body: commands }) as Array<ApplicationCommand>;
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();