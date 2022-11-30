import { ChannelType, Client, Events, GatewayIntentBits, GuildMember, Interaction, PermissionsBitField } from 'discord.js';
import { token } from './config.json';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildMessages] });


client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}!`);
});

client.on(Events.InteractionCreate,async (intr: Interaction) => {

    if (!intr.isChatInputCommand()) return;
    const cmdName = intr.commandName;

    switch(cmdName) {
        case "ban": {
            const user = intr.options.getUser("user");
            const guild = intr.guild;
            const reason = intr.options.getString("reason") || "no resaon provided";

            if (!user || !guild) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: true});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: true});
                return;
            }

            await guild.members.ban(user, {reason: reason});

            await user.send("u have been banned from "+guild.name+".```\n"+reason+"\n```");
            await intr.reply({ content: "banned that rascle 👍", ephemeral: true });
            break;
        }

        case "soft-ban": {
            const user = intr.options.getUser("user");
            const guild = intr.guild;
            const days = intr.options.getNumber("days");
            const reason = intr.options.getString("reason") || "no reason provided";

            if (!user || !guild || !days) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: true});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: true});
                return;
            }

            await guild.members.ban(user, {deleteMessageSeconds: days*24*60*60, reason: reason});
            await guild.members.unban(user);

            await user.send("u have been soft-banned from "+guild.name+".```\n"+reason+"\n```");
            await intr.reply({ content: "soft-banned that rascle 👍", ephemeral: true });
            break;
        }

        case "kick": {
            const user = intr.options.getUser("user");
            const guild = intr.guild;

            if (!user || !guild) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: true});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: true});
                return;
            }

            await guild.members.kick(user);
            
            await user.send("u have been kicked from.```\n"+guild.name+"\n```");
            await intr.reply({ content: "kicked that rascle 👍", ephemeral: true });
            break;
        }

        case "timeout": {
            const user = intr.options.getMember("user") as GuildMember;
            const guild = intr.guild;
            const sec = intr.options.getNumber("seconds");

            if (!user || !guild || !sec) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: true});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: true});
                return;
            }

            await user.timeout(sec*1000);

            await user.send("u have been timedout from "+guild.name+".");
            await intr.reply({ content: "timedout that rascle 👍", ephemeral: true });
            break;
        }

        case "purge": {
            const guild = intr.guild;
            const channel = intr.channel
            const msgnum = intr.options.getNumber("messages");

            if (!(channel?.type === ChannelType.GuildText) || !guild || !msgnum) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: true});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: true});
                return;
            }

            await channel.bulkDelete(msgnum);

            await intr.reply({ content: "timedout that rascle 👍", ephemeral: true });
            break;
        }

        default: {

        }
    }
});


client.login(token);