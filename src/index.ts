import { ChannelType, Client, Events, GatewayIntentBits, GuildMember, Interaction, PermissionsBitField } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { token } from './config.json';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildMessages] });
const prisma = new PrismaClient();


client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}!`);
});

client.on(Events.InteractionCreate,async (intr: Interaction) => {

    if (!intr.isChatInputCommand()) return;
    
    const guild = intr.guild;
    const channel = intr.channel;
    const author = intr.user;
    if (!guild || !(channel?.type === ChannelType.GuildText) || !author) {
        await intr.reply({ content: "failed. malformed command or permission.", ephemeral: false});
        return;
    }

    let DBguild = await prisma.guild.findFirst({
        where: {
            gid: guild.id
        }
    });
    if (!DBguild) {
        DBguild = await prisma.guild.create({
            data: {
                gid: guild.id,
                mEph: false
            }
        });
    }

    switch(intr.commandName.toLowerCase()) {
        case "ban": {
            const user = intr.options.getUser("user");
            const reason = intr.options.getString("reason") || "no resaon provided";

            if (!user) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: DBguild.mEph});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: DBguild.mEph});
                return;
            }

            await guild.members.ban(user, {reason: reason});

            await user.send("u have been banned from "+guild.name+".```\n"+reason+"\n```");
            await intr.reply({ content: "banned that rascle 👍", ephemeral: DBguild.mEph });
            break;
        }

        case "soft-ban": {
            const user = intr.options.getUser("user");
            const days = intr.options.getNumber("days");
            const reason = intr.options.getString("reason") || "no reason provided";

            if (!user || !days) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: DBguild.mEph});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: DBguild.mEph});
                return;
            }

            await guild.members.ban(user, {deleteMessageSeconds: days*24*60*60, reason: reason});
            await guild.members.unban(user);

            await user.send("u have been soft-banned from "+guild.name+".```\n"+reason+"\n```");
            await intr.reply({ content: "soft-banned that rascle 👍", ephemeral: DBguild.mEph });
            break;
        }

        case "kick": {
            const user = intr.options.getUser("user");

            if (!user) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: DBguild.mEph});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.KickMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: DBguild.mEph});
                return;
            }

            await guild.members.kick(user);
            
            await user.send("u have been kicked from.```\n"+guild.name+"\n```");
            await intr.reply({ content: "kicked that rascle 👍", ephemeral: DBguild.mEph });
            break;
        }

        case "timeout": {
            const user = intr.options.getMember("user") as GuildMember;
            const sec = intr.options.getNumber("seconds");

            if (!user || !sec) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: DBguild.mEph});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: DBguild.mEph});
                return;
            }

            await user.timeout(sec*1000);

            await user.send("u have been timedout from "+guild.name+".");
            await intr.reply({ content: "timedout that rascle 👍", ephemeral: DBguild.mEph });
            break;
        }

        case "purge": {
            const msgnum = intr.options.getNumber("messages");

            if (!msgnum) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: DBguild.mEph});
                return;
            }

            if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                await intr.reply({ content: "i need `Administrator` permission", ephemeral: DBguild.mEph});
                return;
            }

            await channel.bulkDelete(msgnum);

            await intr.reply({ content: "timedout that rascle 👍", ephemeral: DBguild.mEph });
            break;
        }

        case "settings": {
            const ephBool = intr.options.getBoolean("ephemeral-response");

            if (ephBool === null) {
                await intr.reply({ content: "failed. malformed command or permission.", ephemeral: DBguild.mEph});
                return;
            }

            if (DBguild.mEph !== ephBool) {
                DBguild = await prisma.guild.update({
                    where: {
                        gid: guild.id
                    },
                    data: {
                        mEph: ephBool
                    }
                });
            }

            await intr.reply({ content: "settings saved 👍", ephemeral: DBguild.mEph });
            break;
        }

        default: {
            await intr.reply({ content: "failed. command does not exist.", ephemeral: DBguild.mEph});
            return;
        }
    }
});


client.login(token);