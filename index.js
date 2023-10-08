const { Client, Interaction, GatewayIntentBits, Partials, Collection, AttachmentBuilder, Events, Random, Embed } = require("discord.js");
const { EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, StringSelectMenuBuilder, SelectMenuBuilder, PermissionsBitFlags, PermissionsBitField, TextInputBuilder, TextInputStyle, ModalBuilder, ApplicationCommandOptionType } = require('discord.js');
const Discord = require('discord.js')
const fs = require('fs');
const Canvas = require("canvas");

const { QuickDB } = require("quick.db");
//const db = new QuickDB();

const logs = require('discord-logs');
const mongoose = require('mongoose');
const { createTranscript } = require('discord-html-transcripts');



const memberJoin = require('./Schemas/memberJoinSchema');


const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
const { logging } = require('./Handlers/logging');



const {
  Guilds,
  GuildMembers,
  GuildMessages,
  GuildPresences,
  GuildVoiceStates,
  MessageContent,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel, Reaction} = Partials;
const client = new Client({
  intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildBans,
GatewayIntentBits.GuildEmojisAndStickers,
GatewayIntentBits.GuildIntegrations,
GatewayIntentBits.GuildInvites,
GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildMessageReactions,
GatewayIntentBits.GuildMessageTyping,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.GuildPresences,
GatewayIntentBits.GuildScheduledEvents,
GatewayIntentBits.GuildVoiceStates,
GatewayIntentBits.GuildWebhooks,
GatewayIntentBits.DirectMessages,
GatewayIntentBits.DirectMessageTyping,
GatewayIntentBits.DirectMessageReactions,
GatewayIntentBits.MessageContent
  ],
  partials: [User, Message, GuildMember, ThreadMember, GuildPresences, Partials.Channel, Partials.Reaction, Partials.Message],
});
const db = require('better-sqlite3')('wipo.db', {
busyTimeout: 100000,
})
client.db = db
db.prepare(`CREATE TABLE IF NOT EXISTS premium (guildID TEXT, authID TEXT)`).run()
db.prepare(`CREATE TABLE IF NOT EXISTS lockedCommands (Command TEXT, guildID TEXT)`).run()
db.prepare('CREATE TABLE IF NOT EXISTS logChannels (guildID TEXT PRIMARY KEY, channelID TEXT)').run()
db.prepare('CREATE TABLE IF NOT EXISTS warnings (guildID TEXT, userID TEXT, reason TEXT, issuerID TEXT, id TEXT)').run()
db.prepare(`CREATE TABLE IF NOT EXISTS welcomeing (guildID TEXT, channelID TEXT, embedTitle TEXT, embedDesc TEXT, canvas TEXT)`).run()
db.prepare(`CREATE TABLE IF NOT EXISTS level (guildID TEXT, userID TEXT, level INT(2) DEFAULT '0', xp INT DEFAULT '0', nextlvl INT DEFAULT '20', rank INT DEFAULT '0')`).run()
db.prepare(`CREATE TABLE IF NOT EXISTS leveling (guildID TEXT, excludedChannels VARCHAR[], restrictedChannels VARCHAR[], upChannel TEXT, xpMulti INT DEFAULT "1", rankMulti VARCHAR[], rankMulti2 VARCHAR[], upMessage TEXT, pupMessage TEXT)`).run()

client.commands = new Collection();
client.events = new Collection();
client.config = require("./config.json");
   
module.exports = client;



client.login(client.config.token).then(() => {
   loadEvents(client);
   loadCommands(client);
   logging(client);
    
logs(client, {
    debug: true
});
    
    
  
    
     // MODMAIL Код //



const moduses = require('./Schemas/modmailuses');
const modschema = require('./Schemas/modmailschema');
//const moduses = require('./Schemas/modmailuses');
    
client.on(Events.MessageCreate, async message => {
 
    //if (message.guild) return;
    if (message.author.bot) return;
    if (message.guild) return;
  
 
    const usesdata = await moduses.findOne({ User: message.author.id });
 
    if (!usesdata) {
 
        message.react('👋')
 
        const modselect = new EmbedBuilder()
        .setColor("#ecb6d3")
        .setFooter({ text: `📞 Выбор ModMail`})
        .setTimestamp()
        .setTitle('> Выберите сервер')
        .addFields({ name: `• Выберите Modmail`, value: `> Отправьте идентификатор(ID) сервера, к которому вы \n> пытаетесь подключиться, в модальном окне, отображаемом при \n> нажатии кнопки ниже!!!`})
        .addFields({ name: `• Как мне получить идентификатор(ID) сервера?`, value: `> Чтобы получить идентификатор(ID) сервера, вам необходимо включить \n> режим разработчика в настройках Discord, затем \n> вы можете получить идентификатор(ID) сервера, \n> щелкнув правой кнопкой мыши по значку сервера и нажав «Копировать сервер ID».".`})
 
        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('selectmodmail')
            .setLabel('• Выберите свой сервер')
            .setStyle(ButtonStyle.Secondary)
        )     
 
        const msg = await message.reply({ embeds: [modselect], components: [button] });
        const selectcollector = msg.createMessageComponentCollector();
 
        selectcollector.on('collect', async i => {
 
            if (i.customId === 'selectmodmail') {
 
                const selectmodal = new ModalBuilder()
                .setTitle('• Выбор modmail')
                .setCustomId('selectmodmailmodal')
 
                const serverid = new TextInputBuilder()
                .setCustomId('modalserver')
                .setRequired(true)
                .setLabel('• К какому серверу вы хотите подключиться?')
                .setPlaceholder('Пример: "1125147344069996578"')
                .setStyle(TextInputStyle.Short);
 
                const subject = new TextInputBuilder()
                .setCustomId('subject')
                .setRequired(true)
                .setLabel(`• Какова причина обращения к нам?`)
                .setPlaceholder(`Пример: "Я люблю Lioneta и очень хочу его"`)
                .setStyle(TextInputStyle.Paragraph);
 
                const serveridrow = new ActionRowBuilder().addComponents(serverid)
                const subjectrow = new ActionRowBuilder().addComponents(subject)
 
                selectmodal.addComponents(serveridrow, subjectrow)
 
                i.showModal(selectmodal)
 
            }else {
        console.log(error)
     }
        })
 // console.log(error) return;
    } else {
 
        //if (message.author.bot) return;
 
        const sendchannel = await client.channels.cache.get(usesdata.Channel);
        if (!sendchannel) {
 
            message.react('⚠')
            await message.reply('**Упс!** Ваш **modmail** кажется **поврежденным**, мы **закрыли** его для вас.')
            return await moduses.deleteMany({ User: usesdata.User });
 
        } else {
 
            const msgembed = new EmbedBuilder()
            .setColor("#ecb6d3")
            .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
            .setFooter({ text: `📞 Сообщение Modmail - ${message.author.id}`})
            .setTimestamp()
            .setDescription(`${message.content || `**Сообщение не предоставлено.**`}`)
 
            if (message.attachments.size > 0) {
 
                try {
                    msgembed.setImage(`${message.attachments.first()?.url}`);
                } catch (err) {
                    return message.react('❌')
                }
 
            }
 
            const user = await sendchannel.guild.members.cache.get(usesdata.User)
            if (!user) {
                message.react('⚠️')
                message.reply(`⚠️ Вы ушли **${sendchannel.guild.name}**, ваш **modmail** был **закрыт**!`)
                sendchannel.send(`⚠️ <@${message.author.id}> вышел, этот **modmail** **закрыт**.`)
                return await moduses.deleteMany({ User: usesdata.User })
            }
 
            try {
 
                await sendchannel.send({ embeds: [msgembed] });
 
            } catch (err) {
                return message.react('❌')
            }
 
            message.react('📧')
        }
    }
})
 
client.on(Events.InteractionCreate, async interaction => {
 
    if (!interaction.isModalSubmit()) return;
 
    if (interaction.customId === 'selectmodmailmodal') {
 
        const data = await moduses.findOne({ User: interaction.user.id });
        if (data) return await interaction.reply({ content: `Вы **уже** открыли **modmail**! \n> Выполните /modmail close**, чтобы закрыть его.`, ephemeral: true });
        else {
 
            const serverid = interaction.fields.getTextInputValue('modalserver');
            const subject = interaction.fields.getTextInputValue('subject');
 
            const server = await client.guilds.cache.get(serverid);
            if (!server) return await interaction.reply({ content: `**Упс!** Кажется, этого **сервера** не **существует**, или меня **нет** на нем!`, ephemeral: true });
 
            const executor = await server.members.cache.get(interaction.user.id);
            if (!executor) return await interaction.reply({ content: `Вы **должны** быть участником **${server.name}**, чтобы **открыть** там **modmail**.!`, ephemeral: true});
 
            const modmaildata = await modschema.findOne({ Guild: server.id });
            if (!modmaildata) return await interaction.reply({ content: `На указанном сервере система **modmail** **отключена**!`, ephemeral: true});
 
            const channel = await server.channels.create({
                name: `modmail-${interaction.user.id}`,
                parent: modmaildata.Category,
 
            }).catch(err => {
                return interaction.reply({ content: `Я **не смог** создать ваш **modmail**на **${server.name}**!`, ephemeral: true});
            })
 
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });
 
            const embed = new EmbedBuilder()
            .setColor("#ecb6d3")
            .setFooter({ text: `📞 Модмейл открыт`})
            .setTimestamp()
            .setTitle(`> ${interaction.user.username} | МодМейл`)
            .addFields({ name: `• Причина`, value: `> ${subject}`})
 
            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('deletemodmail')
                .setEmoji('❌')
                .setLabel('Удалить')
                .setStyle(ButtonStyle.Secondary),
 
                new ButtonBuilder()
                .setCustomId('closemodmail')
                .setEmoji('🔒')
                .setLabel('Закрыть')
                .setStyle(ButtonStyle.Secondary)
            )
 
            await moduses.create({
                Guild: server.id,
                User: interaction.user.id,
                Channel: channel.id
            })
 
           await interaction.reply({ content: `Ваш **modmail** был открыт на  **${server.name}**!`, ephemeral: true});
            const channelmsg = await channel.send({ embeds: [embed], components: [buttons] });
            channelmsg.createMessageComponentCollector();
 
        }
    }//else {
        //console.log(error)
     //}
})
 
client.on(Events.InteractionCreate, async interaction => {
 
    if (interaction.customId === 'deletemodmail') {
 
        const closeembed = new EmbedBuilder()
        .setColor("#ecb6d3")
        .setFooter({ text: `📞 Modmail закрыт`})
        .setTimestamp()
        .setTitle('> Ваш модмейл был закрыт')
        .addFields({ name: `• Сервер`, value: `> ${interaction.guild.name}`})
 
        const delchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
        const userdata = await moduses.findOne({ Channel: delchannel.id });
 
        await delchannel.send('❌ **Удаление** этого **модмейла**..')
 
        setTimeout(async () => {
 
            if (userdata) {
 
                const executor = await interaction.guild.members.cache.get(userdata.User)
                if (executor) {
                    await executor.send({ embeds: [closeembed] });
                    await moduses.deleteMany({ User: userdata.User });
                }
 
            }
 
            try {
                await delchannel.delete();
            } catch (err) {
                return;
            }
 
        }, 100)
 
    }
 
    if (interaction.customId === 'closemodmail') {
 
        const closeembed = new EmbedBuilder()
        .setColor("#ecb6d3")
        .setFooter({ text: `📞 Модмейл закрыт`})
        .setTimestamp()
        .setTitle('> Ваш модмейл был закрыт')
        .addFields({ name: `• Сервер`, value: `> ${interaction.guild.name}`})
 
        const clchannel = await interaction.guild.channels.cache.get(interaction.channel.id);
        const userdata = await moduses.findOne({ Channel: clchannel.id });
 
        if (!userdata) return await interaction.reply({ content: `🔒 Вы **уже** закрыли этот **modmail**.`, ephemeral: true})
 
        await interaction.reply('🔒 **Закрытие** этого **modmail**..')
 
        setTimeout(async () => {
 
            const executor = await interaction.guild.members.cache.get(userdata.User)
            if (executor) {
 
                try {
                    await executor.send({ embeds: [closeembed] });
                } catch (err) {
                    return;
                }
 
            }
 
            interaction.editReply(`🔒 **Закрыто!** <@${userdata.User}> не может **больше** просматривать этот **модмейл**, но вы можете!`)
 
            await moduses.deleteMany({ User: userdata.User });
 
        }, 100)
 
    }
})
 
client.on(Events.MessageCreate, async message => {
 
    if (message.author.bot) return;
    if (!message.guild) return;
 
    const data = await modschema.findOne({ Guild: message.guild.id });
    if (!data) return;
 
    const sendchanneldata = await moduses.findOne({ Channel: message.channel.id });
    if (!sendchanneldata) return;
 
    const sendchannel = await message.guild.channels.cache.get(sendchanneldata.Channel);
    const member = await message.guild.members.cache.get(sendchanneldata.User);
    if (!member) return await message.reply(`⚠ <@${sendchanneldata.User} **нет** на вашем **сервере**!`)
 
    const msgembed = new EmbedBuilder()
    .setColor("#ecb6d3")
    .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}`})
    .setFooter({ text: `📞 Мод-почта получена - ${message.author.id}`})
    .setTimestamp()
    .setDescription(`${message.content || `**Сообщение не предоставлено.**`}`)
 
    if (message.attachments.size > 0) {
 
        try {
            msgembed.setImage(`${message.attachments.first()?.url}`);
        } catch (err) {
            return message.react('❌')
        }
 
    }
 
    try {
        await member.send({ embeds: [msgembed] });
    } catch (err) {
        message.reply(`⚠ Я **не могу** отправить сообщение **<@${sendchanneldata.User}>**!`)
        return message.react('❌')
    }
 
    message.react('📧')
 
}); 
    
   
    
    //Ошибкусы
    process.on("unhandledRejection", (reason, p) => {
  const ChannelID = "1125714171082846278";
  console.error("Необработанное отклонение обещания:", reason, p);
  const Embed = new EmbedBuilder()
    .setColor("Random")
    .setTimestamp()
    .setFooter({ text: "⚠Антикраш-система" })
    .setTitle("Обнаружена ошибка");
  const Channel = client.channels.cache.get(ChannelID);
  if (!Channel) return;
  Channel.send({
    embeds: [
      Embed.setDescription(
        "**Необработанный отказ/поимка:\n\n** ```" + reason + "```"
      ),
    ],
  });
});
    
   
    // войс стата
    const VCStatsVC = require('./Schemas/vcstatsvc');



const updateChannels = async (guild) => {
  const voiceChannels = await VCStatsVC.findOne({ guildId: guild.id });
  if (!voiceChannels) return;

  const userCountChannel = guild.channels.cache.get(voiceChannels.userCountChannel);
  const memberCountChannel = guild.channels.cache.get(voiceChannels.memberCountChannel);
  const botCountChannel = guild.channels.cache.get(voiceChannels.botCountChannel);
  const roleCountChannel = guild.channels.cache.get(voiceChannels.roleCountChannel);
  const channelCountChannel = guild.channels.cache.get(voiceChannels.channelCountChannel);

  if (userCountChannel) userCountChannel.setName(`👪|Всех: ${guild.memberCount}`);
  if (memberCountChannel)
    memberCountChannel.setName(`😁|Участников: ${guild.members.cache.filter(m => !m.user.bot).size}`);
  if (botCountChannel)
    botCountChannel.setName(`🤖|Ботов: ${guild.members.cache.filter(m => m.user.bot).size}`);
  if (roleCountChannel) roleCountChannel.setName(`🏆|Ролей: ${guild.roles.cache.size}`);
  if (channelCountChannel) channelCountChannel.setName(`📢|Каналов: ${guild.channels.cache.size}`);
};

const setUpVoiceChannels = async (guild) => {
  const guildId = guild.id;

  try {
    let voiceChannels = await VCStatsVC.findOne({ guildId });
    if (!voiceChannels) {
      voiceChannels = new VCStatsVC({ guildId });
    }

  

    await voiceChannels.save(); 

    // Обновить каналы сразу после установки
    updateChannels(guild);

    // Запланируйте функцию обновления каналов каждую минуту (60000 миллисекунд).
    setInterval(() => {
      updateChannels(guild);
    }, 80000);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
    
    // бан
    const banschema = require(`./Schemas/bans`)
setInterval(async () => {
 
    const bans = await banschema.find();
    if(!bans) return;
    else {
        bans.forEach(async ban => {
 
            if (ban.Time > Date.now()) return;
 
            let server = await client.guilds.cache.get(ban.Guild);
            if (!server) {
                console.log('нема сервера')
                return await banschema.deleteMany({
                    Guild: server.id
                });
 
            }
 
            await server.bans.fetch().then(async bans => {
 
                if (bans.size === 0) {
                    console.log('банов было 0')
 
                    return await banschema.deleteMany({
                        Guild: server.id
                    });
 
 
 
                } else {
 
                    let user = client.users.cache.get(ban.User)
                    if (!user) {
                        console.log('пользователь не найден')
                        return await banschema.deleteMany({
                            User: ban.User,
                            Guild: server.id
                        });
                    }
 
                    await server.bans.remove(ban.User).catch(err => {
                        console.log('не смог разбанить')
                        return;
                    })
 
                    await banschema.deleteMany({
                        User: ban.User,
                        Guild: server.id
                    });
 
                }
            })
        })
    }
 
}, 30000);

    
    // idei yra
    
    //const Discord = require("discord.js");
//const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "sugestao" });

module.exports = {
  name: "sugestto.js"
};


client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const database = await db.get(interaction.message.id);
  if (!database) return;

  const member = interaction.guild.members.cache.get(interaction.user.id);
  if (!member) return;



  if (interaction.customId === 'sim') {
    if (!database.total.includes(interaction.user.id)) {

      await db.add(`${interaction.message.id}.positivo`, 1);
      await db.push(`${interaction.message.id}.total`, interaction.user.id);

      database.positivo += 1;

      const membro = await interaction.guild.members.cache.get(database.usuario);
      if (!membro) return;


      const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.guild} | Идея`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> **Комментарии:**
  > Только один голос на одного участника:`)
        .addFields({
          name: `Пользователь:`,
          value: `${membro.user.username} \`(${membro.user.id})\``,
          inline: false
        },
          {
            name: `Идея:`,
            value: `\`\`\`${database.sugestao}\`\`\``,
            inline: false
          })
        .setFooter({ text: `${interaction.user.username}`, iconURL: `${client.user.displayAvatarURL({ display: true, size: 4096 })}` })
        .setTimestamp()

      const botaoPositivo = new Discord.ButtonBuilder()
        .setLabel(`${database.positivo}`)
        .setCustomId("sim")
        .setEmoji("1138219908610662540")
        .setStyle(2)
        .setDisabled(false);

      const botaoNegativo = new Discord.ButtonBuilder()
        .setLabel(`${database.negativo}`)
        .setCustomId("nao")
        .setEmoji("1138219921998876682")
        .setStyle(2)
        .setDisabled(false);

      const botaoFinalizar = new Discord.ButtonBuilder()
        .setLabel(`Завершить`)
        .setCustomId("sfinalizar")
        .setStyle(1)
        .setDisabled(false);

      const row1 = new Discord.ActionRowBuilder()
        .addComponents(botaoPositivo, botaoNegativo, botaoFinalizar);

      await interaction.message.edit({ embeds: [embed], components: [row1] })
      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Ваш **положительный** голос успешно зарегистрирован.`)
        .setTimestamp()
      interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });

    } else {
      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Вы уже проголосовали и можете проголосовать только один раз!`)
        .setTimestamp()
      interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });

    }
  } else if (interaction.customId === 'nao') {
    if (!database.total.includes(interaction.user.id)) {
      //await interaction.deferUpdate()
      await db.add(`${interaction.message.id}.negativo`, 1);
      await db.push(`${interaction.message.id}.total`, interaction.user.id);

      database.negativo += 1;

      const membro = await interaction.guild.members.cache.get(database.usuario);
      if (!membro) return;

      const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.guild} | Идея`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> **Комментарии:**
  > Только один голос на одного участника:`)
        .addFields({
          name: `Пользователь:`,
          value: `${membro.user.username} \`(${membro.user.id})\``,
          inline: false
        },
          {
            name: `Идея:`,
            value: `\`\`\`${database.sugestao}\`\`\``,
            inline: false
          })

      const botaoPositivo = new Discord.ButtonBuilder()
        .setLabel(`${database.positivo}`)
        .setCustomId("sim")
        .setEmoji("1138219908610662540")
        .setStyle(2)
        .setDisabled(false);

      const botaoNegativo = new Discord.ButtonBuilder()
        .setLabel(`${database.negativo}`)
        .setCustomId("nao")
        .setEmoji("1138219921998876682")
        .setStyle(2)
        .setDisabled(false);
      const botaoFinalizar = new Discord.ButtonBuilder()
        .setLabel(`Завершить`)
        .setCustomId("sfinalizar")
        .setStyle(1)
        .setDisabled(false);

      const row1 = new Discord.ActionRowBuilder()
        .addComponents(botaoPositivo, botaoNegativo, botaoFinalizar);

      await interaction.message.edit({ embeds: [embed], components: [row1] })

      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Ваш **отрицательный** голос успешно зарегистрирован.`)
        .setTimestamp()
      interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });


    } else {
      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Вы уже проголосовали`)
        .setTimestamp()
      interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });

    }
  } else if (interaction.customId === 'sfinalizar') {

    const cargostaff = await db.get(`cargo_staff_${interaction.guild.id}`)

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.has(cargostaff)) { // cargo staff
      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Вы не сотрудник`)
        .setTimestamp()
      return interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });
    } else {

      const membro = await interaction.guild.members.cache.get(database.usuario);
      if (!membro) return;

      const embed = new Discord.EmbedBuilder()

        .setAuthor({ name: `${interaction.guild} | Идея`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> **Комментарии:**
  > Только один голос на одного участника:`)
        .addFields({
          name: `Пользователь:`,
          value: `${membro.user.username} \`(${membro.user.id})\``,
          inline: false
        },
          {
            name: `Идея:`,
            value: `\`\`\`${database.sugestao}\`\`\``,
            inline: false
          })

      const botaoPositivo = new Discord.ButtonBuilder()
        .setLabel(`${database.positivo}`)
        .setCustomId("sim")
        .setEmoji("1138219908610662540")
        .setStyle(2)
        .setDisabled(true);

      const botaoNegativo = new Discord.ButtonBuilder()
        .setLabel(`${database.negativo}`)
        .setCustomId("nao")
        .setEmoji("1138219921998876682")
        .setStyle(2)
        .setDisabled(true);
      const botaoFinalizar = new Discord.ButtonBuilder()
        .setLabel(`Завершить`)
        .setCustomId("sfinalizar")
        .setStyle(1)
        .setDisabled(true);


      const botaoaceitar = new Discord.ButtonBuilder()
        .setLabel(`Принять`)
        .setCustomId("cvoto")
        .setStyle(3)
        .setDisabled(false);


      const botaorecusar = new Discord.ButtonBuilder()
        .setLabel(`Отказать`)
        .setCustomId("nvoto")
        .setStyle(4)
        .setDisabled(false);

      const row1 = new Discord.ActionRowBuilder()
        .addComponents(botaoPositivo, botaoNegativo, botaoFinalizar);

      const row2 = new Discord.ActionRowBuilder()
        .addComponents(botaoaceitar, botaorecusar);

      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Это **предложение** закрыто, определите его исход!`)
        .setTimestamp()
      interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });


      await interaction.message.edit({ embeds: [embed], components: [row1, row2] })
    }

  } else if (interaction.customId === 'cvoto') {

    const cargostaff = await db.get(`cargo_staff_${interaction.guild.id}`)

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.has(cargostaff)) { // cargo staff
      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Вы не сотрудник`)
        .setTimestamp()
      return interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });
    } else {

      const membro = await interaction.guild.members.cache.get(database.usuario);
      if (!membro) return;

      const sugestaoaprovada = await db.get(`canal_logs_${interaction.guild.id}`)


      const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.guild} | Одобренное предложение`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> Это предложение одобрено и отправлено по одобренным каналам.`)
        .setFooter({ text: `Голосование окончено..` })


      const logs = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.guild} | Одобренное предложение`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> Это предложение было одобрено и скоро будет реализовано.\n**Некоторая информация приведена ниже:**`)
        .addFields({
          name: `Данные:`,
          value: `Пользователь: ${membro.user.username} \`(${membro.user.id})\`\n Идея: \`${database.sugestao}\``,
          inline: false
        },
          {
            name: `Информация о голосовании:`,
            value: `Голосование за: \`${database.positivo}\`\nОтрицательные голоса: \`${database.negativo}\``,
            inline: false
          })
      const afirmativo = new Discord.ButtonBuilder()
        .setCustomId("semnd")
        .setEmoji("1138219908610662540")
        .setStyle(2)
        .setDisabled(true);


      const row1 = new Discord.ActionRowBuilder()
        .addComponents(afirmativo);

      await client.channels.cache.get(sugestaoaprovada).send({ embeds: [logs], components: [row1] })

      const userdm = new Discord.EmbedBuilder()
        .setAuthor({ name: `${interaction.guild} | Одобренное предложение`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> Здравствуйте, ${membro.user}! Ваше предложение одобрено и скоро будет реализовано.\n**Вот некоторая информация ниже:**`)
        .addFields({
          name: `Данные:`,
          value: `Идея: \`${database.sugestao}\``,
          inline: false
        },
          {
            name: `Информация о голосовании:`,
            value: `Голосование за: \`${database.positivo}\`\nОтрицательные голоса: \`${database.negativo}\``,
            inline: false
          })


      await membro.user.send({ embeds: [userdm], components: [row1] })

      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Предложение принято, участнику было отправлено благодарственное письмо и отправлено в <#${sugestaoaprovada}>`)
        .setTimestamp()
      interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });


      await interaction.message.edit({ embeds: [embed], components: [] }).then((msg) => {

        setTimeout(() => msg.delete(), 999999999);
      })


    }

  } else if (interaction.customId === 'nvoto') {

    const cargostaff = await db.get(`cargo_staff_${interaction.guild.id}`)

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.has(cargostaff)) { // cargo staff
      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Вы не сотрудник`)
        .setTimestamp()
      return interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });
    } else {

      const membro = await interaction.guild.members.cache.get(database.usuario);
      if (!membro) return;


      const sugestaorecusada = await db.get(`canal_logs_${interaction.guild.id}`)

      const embed = new Discord.EmbedBuilder()

        .setAuthor({ name: `${interaction.guild} | Предложение отклонено`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> Это предложение было отклонено голосованием`)
        .setFooter({ text: `Голосование окончено..` })


      const logs = new Discord.EmbedBuilder()

        .setAuthor({ name: `${interaction.guild} | Предложение отклонено`, iconURL: interaction.guild.iconURL() })
        .setDescription(`> Это предложение было отклонено, поскольку из-за большего количества отрицательных голосов мы решили отказаться! (Или просто идея такая себе)`)
        .addFields({
          name: `Данные:`,
          value: `Пользователь: ${membro.user.username} \`(${membro.user.id})\`\n Идея: \`${database.sugestao}\``,
          inline: false
        },
          {
            name: `Информация о голосовании:`,
            value: `Голосование за: \`${database.positivo}\`\nОтрицательные голоса: \`${database.negativo}\``,
            inline: false
          })
      const negativo = new Discord.ButtonBuilder()
        .setCustomId("semnd")
        .setEmoji("1138219921998876682")
        .setStyle(2)
        .setDisabled(true);


      const row1 = new Discord.ActionRowBuilder()
        .addComponents(negativo);

      await client.channels.cache.get(sugestaorecusada).send({ embeds: [logs], components: [row1] })

      let callzin = new Discord.EmbedBuilder()
        .setDescription(`Предложение отклонено и отправлено в <#${sugestaorecusada}>`)
        .setTimestamp()
      interaction.reply({
        embeds: [callzin],
        ephemeral: true,
      });


      await interaction.message.edit({ embeds: [embed], components: [] }).then((msg) => {

        setTimeout(() => msg.delete(), 999999999);
      })

    }
  }
})
 
    // Джоин пинг систем епта//
const pingschema = require('./Schemas/joinping');

client.on(Events.GuildMemberAdd, async (member, err) => {

    const pingdata = await pingschema.findOne({ Guild: member.guild.id });

    if (!pingdata) return;
    else {

        await Promise.all(pingdata.Channel.map(async data => {

            const pingchannels = await client.channels.fetch(data);
            const message = await pingchannels.send(`${member}`).catch(err);
            
            setTimeout(() => {
                
                try {
                    message.delete();
                } catch (err) {
                    return;
                }

            }, 1000)
        }));
    }
}) 
    
// remind aaaaa
 const remindSchema = require("./Schemas/remindSchema");
setInterval(async () => {

    const reminders = await remindSchema.find();
    if(!reminders) return;
    else {
        reminders.forEach(async reminder => {


            if (reminder.Time > Date.now()) return;
            
            const user = await client.users.fetch(reminder.User);

            user.send({
                content: `${user}, Вы просили меня напомнить вам о: \`${reminder.Remind}\``
            }).catch(err => {
                return;
            });

            await remindSchema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind
            });
        })
    }
}, 1000 * 5);

    
    
    /// Тикет Система //
const ticketSchema = require("./Schemas/ticketSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "ticket") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });

      if (!data) return await interaction.reply({ content: "Система тикетов не настроена на этом сервере.", ephemeral: true })
      const role = guild.roles.cache.get(data.Role)
      const cate = data.Category;


      await interaction.guild.channels.create({
        name: `билетик-${interaction.user.username}`,
        parent: cate,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["ViewChannel"]
          },
          {
            id: role.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: interaction.member.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          
        ],
      }).then(async (channel) => {
        const openembed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Билет открыт!")
          .setDescription(`Добро пожаловать в ваш билет ${interaction.user.username}\n Нажмите 🔒, чтобы закрыть тикет`)
          .setThumbnail(interaction.guild.iconURL())
          .setTimestamp()
          .setFooter({ text: `${interaction.guild.name} билет` })

          const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Закрыть')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒'),
            new ButtonBuilder()
            .setCustomId("claim")
            .setLabel("Взять")
            .setEmoji("<:command:1143991645273067520>")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("lock")
            .setLabel("Заблокировать")
            .setEmoji("<:krest:1143930216788525207>")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setLabel("Разблокировать")
            .setCustomId("unlock")
            .setEmoji("<:emoji_5:1140607910678908938>")
            .setStyle(ButtonStyle.Success)
          )

          await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })

          const openedTicket = new EmbedBuilder()
          .setDescription(`Билет создан в <#${channel.id}>`)

          await interaction.reply({ embeds: [openedTicket], ephemeral: true })
      })
    }

    if (customId === "claim") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: "Ты не можешь этого сделать!!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setTitle("Билет взят.")
        .addFields(
            {name: "Модератор:", value: `<@${interaction.user.id}>`, inline: true}
        )
        .setColor("Green")
        .setTimestamp()

        await interaction.channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed]});

        await interaction.reply({ content: "**Вы взяли** канал **в свои руки!**", ephemeral: true});
    }

    if (customId === "lock") {
        await interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: "Ты не можешь сделать это!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setDescription(`Этот канал **ЗАБЛОКИРОВАН** пользователем <@${interaction.user.id}>!`)
        .setColor("Red")
        
        await interaction.channel.send({ embeds: [embed]})

        await interaction.reply({ content: "**закрыт** канал **успешно!**", ephemeral: true});
    }

    if (customId === "unlock") {
        await interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({content: "Ты не можешь сделать это!", ephemeral: true});

        const embed = new EmbedBuilder()
        .setDescription(`Этот канал **РАЗБЛОКИРОВАН** пользователем <@${interaction.user.id}>!`)
        .setColor("Green")
        
        await interaction.channel.send({ embeds: [embed]});

        await interaction.reply({ content: "**разблокирован** канал **успешно!**", ephemeral: true});
    }

    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
      .setDescription('🔒 Вы уверены, что хотите закрыть этот тикет?')
      .setColor('Red')

      const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('yesclose')
        .setLabel('Да')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('✅'),

        new ButtonBuilder()
        .setCustomId('nodont')
        .setLabel('Нет')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
      )

      await interaction.reply({ embeds: [closingEmbed], components: [buttons], ephemeral: true })
    }

    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `билетик-${interaction.user.username}.html`,
      });

      const transcriptEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.guild.name}| Стенограммы`, iconURL: guild.iconURL() })
      .addFields(
        {name: `Закрыт:`, value: `${interaction.user.tag}`}
      )
      .setColor('Red')
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.guild.name} Билет` })

      const processEmbed = new EmbedBuilder()
      .setDescription(` Закрытие билета через 10 секунд...`)
      .setColor('Red')

      await interaction.reply({ embeds: [processEmbed] })

      await guild.channels.cache.get(data.Logs).send({
        embeds: [transcriptEmbed],
        files: [transcript],
      });

      setTimeout(() => {
        interaction.channel.delete()
      }, 10000);
     }

     if (customId === "nodont") {
        const noEmbed = new EmbedBuilder()
        .setDescription('🔒 Закрытие билета отменено')
        .setColor('Red')
  
        await interaction.reply({ embeds: [noEmbed], ephemeral: true })
     }
  }
})

    
// афк

      
    
// велком log

client.on(Events.GuildMemberAdd, async (member) => {

   const Data = await memberJoin.findOne({ Guild: member.guild.id});
 
   if (!member.user.bot) {
 
     const currentTime = new Date();
     const accountAgeInDays = (currentTime - member.user.createdAt) / (1000 * 60 * 60 * 24);
     let riskScale = 10 - Math.floor(accountAgeInDays / 30);
     if (riskScale < 1) riskScale = 1;
 
     let riskEmoji = "";
     if (riskScale >= 10) riskEmoji = "😡";
     else if (riskScale >= 9) riskEmoji = "😠";
     else if (riskScale >= 8) riskEmoji = "😤";
     else if (riskScale >= 7) riskEmoji = "😒";
     else if (riskScale >= 6) riskEmoji = "🙁";
     else if (riskScale >= 5) riskEmoji = "😕";
     else if (riskScale >= 4) riskEmoji = "🙂";
     else if (riskScale >= 3) riskEmoji = "😊";
     else if (riskScale >= 2) riskEmoji = "😄";
     else riskEmoji = "😁";
 
       const embed = new EmbedBuilder()
       .setColor("Green")
       .setAuthor({
           name: member.user.username,
           iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }),
         })
       .setThumbnail(member.user.avatarURL())
       .setDescription(`**Новый участник зашёл! | ${member}**`)
       .addFields({name:"Создал Дискорд:",value:`<t:${parseInt(member.user.createdAt/1000)}:f>\n (<t:${parseInt(member.user.createdAt/1000)}:R>)`,inline:true})
       .addFields({name:"Шкала рисков",value:`${riskScale}/10 ${riskEmoji}`,inline:true})
       .setFooter({ text: `ID: ${member.id}`})
       .setTimestamp()
 
       const banEmbed = new EmbedBuilder()
       .setColor("Red")
       .setAuthor({
           name: member.user.username,
           iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }),
         })
       .setThumbnail(member.user.avatarURL())
       .setDescription(`Причина бана ${member}`)
       .setFooter({ text: `ID: ${member.id}`})
       .setTimestamp()
 
       const kickEmbed = new EmbedBuilder()
       .setColor('Grey')
       .setAuthor({
           name: member.user.username,
           iconURL: member.user.avatarURL({ dynamic: true, size: 1024 }),
         })
       .setThumbnail(member.user.avatarURL())
       .setDescription(`Причина кика ${member}`)
       .setFooter({ text: `ID: ${member.id}`})
       .setTimestamp()
 
       if (Data) {
 
         const channel1 = client.channels.cache.get(Data.Channel);
 
           const kickRow = new ActionRowBuilder()
             .addComponents(
               new StringSelectMenuBuilder()
                 .setCustomId('kickselect')
                 .setMaxValues(1)
                 .setPlaceholder('Причина кика')
                 .addOptions(
                   {
                     label: 'Молодой возраст учетной записи',
                     value: 'Учетная запись слишком новая для присоединения.',
                   },
                   {
                     label: 'Подозрительное использование учетной записи',
                     value: 'Ваша учетная запись была кикнута за подозрительное использование.',
                   },
                   {
                     label: 'Неподходящее имя пользователя',
                     value: 'Вас выгнали из-за нарушения нашей политики использования имен пользователей.',
                   },
                   {
                     label: 'Неприемлемый контент',
                     value: 'Ваша учетная запись была кикнута из-за нарушения нашей политики NSFW.',
                   },
                 ),
             );
 
             const banRow = new ActionRowBuilder()
             .addComponents(
               new StringSelectMenuBuilder()
                 .setCustomId('banselect')
                 .setMaxValues(1)
                 .setPlaceholder('Причина бана')
                 .addOptions(
                  {
                     label: 'Молодой возраст учетной записи',
                     value: 'Учетная запись слишком новая для присоединения.',
                   },
                   {
                     label: 'Подозрительное использование учетной записи',
                     value: 'Ваша учетная запись была заблокирована за подозрительное использование.',
                   },
                   {
                     label: 'Неподходящее имя пользователя',
                     value: 'Вас забанили из-за нарушения нашей политики использования имен пользователей.',
                   },
                   {
                     label: 'Неприемлемый контент',
                     value: 'Ваша учетная запись была заблокирована из-за нарушения нашей политики NSFW.',
                   },
                 ),
             );
 
         const button = new ActionRowBuilder()
         .addComponents(
             new ButtonBuilder()
             .setCustomId(`kick`)
             .setLabel(`🗑️ Кик`)
             .setStyle(ButtonStyle.Secondary),
 
             new ButtonBuilder()
             .setCustomId(`ban`)
             .setLabel(`🛠️ Бан`)
             .setStyle(ButtonStyle.Danger),
         )
 
         const message = await channel1.send({ embeds: [embed], components: [button] });
         const collector = await message.createMessageComponentCollector();
 
         collector.on('collect', async i => {
             
             if (i.customId === 'kick') {
 
               const newMessage = await i.reply({ embeds: [kickEmbed], components: [kickRow] });
               const collector2 = newMessage.createMessageComponentCollector();
 
                collector2.on('collect',  async interaction => {
       
                 let choices;
             
                 if (interaction.customId === 'kickselect') {
 
                   if (!member) return interaction.reply({ content: "Этого участника нет на сервере.", ephemeral: true });
                   if (interaction.member === member) return interaction.reply({ content: "Ты не можешь кикнуть себя.", ephemeral: true });
                   if (!member.kickable) return interaction.reply({ content: "Вы не можете кикнуть этого человека", ephemeral: true });
                   
                   choices = interaction.values;
 
                   const memberKickEmbed = new EmbedBuilder()
                   .setColor('Grey')
                   .setTitle(`:white_check_mark: Участник кикнут | ${member.user.tag}`)
                   .addFields(
                       { name: 'Юзер', value: `${member}`, inline: true },
                       { name: 'Модератор', value: `${interaction.member}`, inline: true },
                       { name: 'Причина', value: `${choices}`, inline: false },
                   )
                   .setFooter({ text: `ID: ${member.id}`})
                   .setTimestamp()
 
                   const embed = new EmbedBuilder()
                   .setColor("Blue")
                   .setDescription(`:white_check_mark:  ${member} был **кикнут** | ${choices}`)
 
                   const dmEmbed = new EmbedBuilder()
                   .setColor("Grey")
                   .setDescription(`:white_check_mark:  Тебя **выгнали** из **${interaction.guild.name}** | ${choices}`)
               
                     await channel1.send({ embeds: [memberKickEmbed]})
               
                   interaction.reply({ embeds: [embed] });
 
                   await member.send({ embeds: [dmEmbed] }).catch(err => {
                     return ({ content: `${member} у них не открыты ЛС, и они могут там не получить кик ЛС.`, ephemeral: true })
                 })
 
                    member.kick({ reason: choices.join(' ') }).catch(err => {
                     return ({ content: `${member} нельзя было кикать.`, ephemeral: true })
                 })
                 collector2.stop();
                 }
       
                })
 
           }
           if (i.customId === 'ban') {
 
             const newMessage = await i.reply({ embeds: [banEmbed], components: [banRow] });
             const collector2 = newMessage.createMessageComponentCollector();
 
              collector2.on('collect',  async interaction => {
     
               let choices;
           
               if (interaction.customId === 'banselect') {
 
                 if (!member) return interaction.reply({ content: "Этого участника нет на сервере.", ephemeral: true });
                 if (interaction.member === member) return interaction.reply({ content: "Вы не можете забанить себе.", ephemeral: true });
                 if (!member.kickable) return interaction.reply({ content: "Вы не можете дать бан этому человеку.", ephemeral: true });
                 
                 choices = interaction.values;
 
                 const memberBanEmbed = new EmbedBuilder()
                 .setColor('Red')
                 .setTitle(`:white_check_mark: Участник забанен | ${member.user.tag}`)
                 .addFields(
                     { name: 'Юзер', value: `${member}`, inline: true },
                     { name: 'Модератор', value: `${interaction.member}`, inline: true },
                     { name: 'Причина', value: `${choices}`, inline: false },
                 )
                 .setFooter({ text: `ID: ${member.id}`})
                 .setTimestamp()
 
                 const embed = new EmbedBuilder()
                 .setColor("Red")
                 .setDescription(`:white_check_mark:  ${member} был **забанен** | ${choices}`)
 
                 const dmEmbed = new EmbedBuilder()
                 .setColor("Red")
                 .setDescription(`:white_check_mark:  Вам дали **бан** на сервере **${interaction.guild.name}** | ${choices}`)
 
                   await channel1.send({ embeds: [memberBanEmbed]})
             
                 interaction.reply({ embeds: [embed] });
 
                 await member.send({ embeds: [dmEmbed] }).catch(err => {
                   return ({ content: `${member} у него не открыты их ЛС, и они могут там не получить бан ЛС.`, ephemeral: true })
               })
 
               member.ban({ reason: choices.join(' ') }).catch(err => {
                   return ({ content: `${member} не мог быть забанен.`, ephemeral: true }) 
               })
 
               collector2.stop();
               }
     
              })
 
         }
           }
         )
         
     }
   }
 })


// уровень 

const levelSchema = require("./Schemas/level");
const levelChannel = require("./Schemas/xpChannel");
const levelRole = require("./Schemas/xp-roles");
const levelschema = require('./Schemas/levelsetup')

client.on(Events.MessageCreate, async (message) => {
    const leveldata = await levelschema.findOne({ Guild: message.guild.id });

    if (!leveldata || leveldata.Disabled === 'disabled') return;
    let multiplier = 1;
    
    multiplier = Math.floor(leveldata.Multi);
    
    const { guild, author } = message;

    if (!guild || author.bot) return;

    levelSchema.findOne({
        Guild: guild.id,
        User: author.id
    }, async (err, data) => {

        if (err) throw err;

        if (!data) {
            levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0
            })
        }
    })

    let amount;
    const dataAmount = await levelAmount.findOne({
        Guild: message.guild.id,
    });

    if (dataAmount) {
        amount = dataAmount.XP
    } else {
        amount = 5
    }

    const dataChannel = await levelChannel.findOne({ Guild: message.guild.id });

   const give = amount;

    const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});

    if (!data) return;

    const requiredXP = data.Level * data.Level * 10 * 10;

    if (data.XP + give >= requiredXP) {
        data.XP += give;
        data.Level +=1;
        await data.save();

        const roleData = await levelRole.findOne({
            Level: data.Level,
            Guild: message.guild.id
        })

        if (roleData) {
            const targetMember = message.member;
            const role = message.guild.roles.cache.get(roleData.Role)
            if (role) {
                await targetMember.roles.add(role).catch(err => {console.log(err)});
            }
        }

        const embed = new EmbedBuilder()
        .setColor("Purple")
        .setDescription(`${author} вы достигли **${data.Level} уровня**!`)
        .addFields(
            {name: "XP:", value: `${data.XP}`, inline: true},
            {name: "Уровень:", value: `${data.Level}`, inline: true}
        )
        .setFooter({ text: "Повышение!"})
        .setTimestamp()
        .setThumbnail(author.displayAvatarURL())

        if (dataChannel) {
            const i = await client.channels.cache.get(`${dataChannel.Channel}`);
            await i.send({ embeds: [embed], content: `<@${message.author.id}>`, ephemeral: true });
        } else if (!dataChannel) {
            await message.reply({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
        }
      data.XP += give * multiplier;
        } data.XP += give;
        data.save();
    //} else {
        //data.XP += give;
       // data.save();
    //}
})
    
const levelSchema = require('./Schemas/level'); 
const levelRoleSchema = require('./Schemas/levelRoleSchema');
const disabled = require("./Schemas/Panel/Systems/xp");
const levelschema = require('./Schemas/levelsetup')
    
client.on(Events.MessageCreate, async (message, interaction) => {
    
   
    const {guild, author} = message;
    if (message.guild === null) return;
    const leveldata = await levelschema.findOne({ Guild: message.guild.id });

    if (!leveldata || leveldata.Disabled === 'disabled') return;
    let multiplier = 1;
    
    multiplier = Math.floor(leveldata.Multi);
    

    if (!guild || author.bot) return;

    const data = await levelSchema.findOne({Guild: guild.id, User: author.id});           
    const roleData = await levelRoleSchema.findOne({ GuildID: guild.id });

    if (!data) {
        levelSchema.create({
            Guild: guild.id,
            User: author.id,
            XP: 0,
            Level: 0,
        })
    }

    
    const channel = message.channel;
    
    const give = 1;

    if (!data) return;
    
    const requiredXP = data.Level * data.Level * 20 + 20;
    
    if (data.XP + give >= requiredXP) {
        
        data.XP += give;
        data.Level += 1;
        await data.save();
        
        if (!channel) return;

        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🎉 Поздравляю')
        .setDescription(`${author} Вы подняли свой уровень до ${data.Level}!`)
        
        
        if (roleData) {
            for (const item of roleData.LevelRoleData) {
                const level = item.level;
                const roleId = item.roleId;
        if (!message.member.roles.cache.has(roleId) && data.Level > level) {
                    message.member.roles.add(roleId)
                }
                if (data.Level === level) {
                    const role = guild.roles.cache.get(roleId)
                    message.member.roles.add(role).catch(err => {})
                    embed.setDescription(`${author}, вы достигли ${data.Level} уровень и получили роль <@&${roleId}>!`)
                }
            }
        }
        
        channel.send({ embeds: [embed] });
    } else {

        if(message.member.roles.cache.find(r => r.id === leveldata.Role)) {
            data.XP += give * multiplier;
        } data.XP += give;
        data.save();
    }//else {

    //data.XP += give;

    //data.save()

    //} 
    
    
})

// урааа бота на серв добавили 



client.on('guildCreate', guild => {
  const topChannel = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).sort((a, b) => a.rawPosition - b.rawPosition || a.id - b.id).first();
 
  try {
    const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Спасибо за приглашение Lionet!")
        .setDescription(`**Я Продвинутый  бот Discord с множеством удивительных высокофункциональных функций, таких как модерация, розыгрыши, система тикетов и многое другое **`)
        .addFields({ name: `❓┇ Рекомендации`, value: `\n > • **Я выполняю только команды с Slash (/) **. \n> • Найдёте все мои команды, используя команду </help:1124966124057014282>`})
        .addFields({ name: `☎️┇ Мне нужна помощь, что теперь?`, value: `\n Вы можете присоединиться к [[Сервер поддержки]](https://discord.gg/x8TkTbZ9YN) `})
        .addFields({ name: `📨┆Пригласите бота!`, value: `\n [[Кликните сюда]](https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot)` })
        .setTimestamp()
    topChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error(error);
  }
});


// аппликатион чооо

const StaffMessages = require('./Schemas/staffMessages');
const StaffSchema = require('./Schemas/staffSchema');
const ms = require('ms');

const cooldowns = new Map();

client.on(Events.InteractionCreate, async i => {
  if (i.isButton()) {
      if (i.customId === 'staffButton') {
          const embed = new EmbedBuilder()
              .setColor('Green')
              .setDescription('Ваше приложение запущено в ваших ЛС. Пожалуйста, ответьте на них как можно быстрее.');

          const member = i.member;

          const ongoingApplication = await StaffMessages.findOne({ User: member.id, inProgress: true });

          if (ongoingApplication) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('У вас уже есть действующее приложение. Пожалуйста, заполните его, прежде чем начинать новый..');

            return i.reply({ embeds: [embed], ephemeral: true });
        }

          if (cooldowns.has(member.id)) {
            const cooldownTime = ms('10h');
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - cooldowns.get(member.id);
    
            if (timeDifference < cooldownTime) {

              const remainingTimeInSeconds = Math.ceil((cooldownTime - timeDifference) / 1000);
              const remainingHours = Math.floor(remainingTimeInSeconds / 3600);
              const remainingMinutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
              const remainingSeconds = remainingTimeInSeconds % 60;
    
              const remainingTime = `${remainingHours} часов, ${remainingMinutes} минут, ${remainingSeconds} секунд`;
  
              return await i.reply({ content: `Вы должны подождать ${remainingTime} перед запуском нового процесса приложения.`, ephemeral: true });
            }
          }

          cooldowns.set(member.id, new Date().getTime());

          i.reply({ embeds: [embed], ephemeral: true });

          member.send({ content: `Благодарим вас за интерес к тому, чтобы стать сотрудником нашего сервера. Чтобы начать процесс подачи заявки на персонал, ответьте на это сообщение «да». Если вы хотите отменить заявку в любое время’.` });

          const missingQuestionNumber = await StaffMessages.find({ QuestionNumber: { $exists: false } });

          for (const doc of missingQuestionNumber) {
              doc.QuestionNumber = 1;
              await doc.save();
          }

          const staffMessage = await StaffMessages.create({
              Guild: i.guild.id,
              User: member.id,
              Messages: '',
              QuestionNumber: 0,
              inProgress: true              
          });
          await staffMessage.save();
      }
  }
});

client.on(Events.MessageCreate, async message => {
  if (message.channel.type == ChannelType.DM) {

    const member = message.author

      const staffMessage = await StaffMessages.findOne({ User: member.id });
      
      if (staffMessage) {

        if (message.content.toLowerCase() === 'да') {
        } else if (staffMessage.QuestionNumber === 0) {
          member.send({ content: `Ваше заявление о приеме на работу было отменено.` });
          await StaffMessages.deleteMany({ User: member.id });
          return;
        }

        const questioning = await StaffMessages.findOne({ Guild: staffMessage.Guild });

        const question1 = questioning.Question1
        const question2 = questioning.Question2
        const question3 = questioning.Question3
        const question4 = questioning.Question4
        const question5 = questioning.Question5
        const question6 = questioning.Question6
        const question7 = questioning.Question7
        const question8 = questioning.Question8
        const question9 = questioning.Question9
        const question10 = questioning.Question10

        let questions = [
          question1,
          question2,
          question3,
          question4,
          question5,
          question6,
          question7,
          question8,
          question9,
          question10
        ].filter((question) => question !== undefined && question !== null);

          staffMessage.Messages += `${message.content}\n`;
          staffMessage.QuestionNumber += 1;
          await staffMessage.save();

          if (staffMessage.QuestionNumber <= questions.length) {
            let currentQuestion = questions[staffMessage.QuestionNumber - 1];
            if (currentQuestion !== undefined && currentQuestion !== null) {
              member.send({ content: `**Вопрос ${staffMessage.QuestionNumber}**:\n${currentQuestion}` });
            }
          } else {

            let messages = staffMessage.Messages.split('\n');

            let appQuestion1 = messages[1];
            let appQuestion2 = messages[2];
            let appQuestion3 = messages[3];
            let appQuestion4 = messages[4];
            let appQuestion5 = messages[5];
            let appQuestion6 = messages[6];
            let appQuestion7 = messages[7];
            let appQuestion8 = messages[8];
            let appQuestion9 = messages[9];
            let appQuestion10 = messages[10];

            const applicationsEmbed = new EmbedBuilder()
            .setColor(0x18e1ee)
            .setTitle(`Заявка`)
            .setDescription(`Заявка от ${member.username}`)
            .addFields(
              { name: 'Дискорд Ник', value: `${member.tag} - ${member}`, inline: true },
              { name: 'Дискорд ID', value: `${member.id}`, inline: true },
              { name: "Зарегистрировался в Дискорд",value:`<t:${parseInt(member.createdAt/1000)}:f>\n (<t:${parseInt(member.createdAt/1000)}:R>)`,inline:true},
              { name: '\u200B\n', value: '\u200B\n', inline: false }
            );
              
              

             
              if (appQuestion1) {
                applicationsEmbed.addFields({ name: `Вопрос 1`, value: appQuestion1, inline: true });
              }
              if (appQuestion2) {
                applicationsEmbed.addFields({ name: 'Вопрос 2', value: appQuestion2, inline: true });
              }
              if (appQuestion3) {
                applicationsEmbed.addFields({ name: 'Вопрос 3', value: appQuestion3, inline: true });
              }
              if (appQuestion4) {
                applicationsEmbed.addFields({ name: 'Вопрос 4', value: appQuestion4, inline: true });
              }
              if (appQuestion5) {
                applicationsEmbed.addFields({ name: 'Вопрос 5', value: appQuestion5, inline: true });
              }
              if (appQuestion6) {
                applicationsEmbed.addFields({ name: 'Вопрос 6', value: appQuestion6, inline: true });
              }
              if (appQuestion7) {
                applicationsEmbed.addFields({ name: 'Вопрос 7', value: appQuestion7, inline: true });
              }
              if (appQuestion8) {
                applicationsEmbed.addFields({ name: 'Вопрос 8', value: appQuestion8, inline: true });
              }
              if (appQuestion9) {
                applicationsEmbed.addFields({ name: 'Вопрос 9', value: appQuestion9, inline: true });
              }
              if (appQuestion10) {
                applicationsEmbed.addFields({ name: 'Вопрос 10', value: appQuestion10, inline: true });
              }
          
      
          applicationsEmbed.setTimestamp();

          const staffSchema = await StaffSchema.findOne({ GuildID: staffMessage.Guild });

          const channel = client.channels.cache.get(staffSchema.Transcripts);

          const embed = new EmbedBuilder()
          .setColor('Green')
          .setTitle('Заявка завершена :white_check_mark:')
          .setDescription('Ваша заявка отправлена и будет рассмотрена модераторами.')

          channel.send({ embeds: [applicationsEmbed] })
            member.send({ embeds: [embed] });
              await StaffMessages.deleteMany({ User: member.id });
          }
      }
  }
});

 




// боьа добавилм ураааа




client.on("guildCreate", async guild => {
  const logchannelid = "1139237053519892500";
  let theowner = "970423203891666954"; //ur id
  await guild.fetchOwner().then(({ user }) => { theowner = user; }).catch(() => {});
  let embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle(`__**Присоединился к новому серверу**__`)
    .setDescription(`${guild.name} пригласил Lionet на свой сервер ураааа, спс`)
    .addFields(
      { name: "Информация о норм таком серве", value: `>>> **${guild.name} (${guild.id})**` },
      { name: "Информация о крутом владельце", value: `>>> **${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}**` },
      { name: "Количество участников", value: `>>> **${guild.memberCount}**`},
      { name: 'Сервер создан', value: `>>> <t:${Math.floor(guild.createdTimestamp / 1000)}:R>` },
      { name: "Теперь серверов", value: `>>> **${client.guilds.cache.size}**` }
    )
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({ text: `Lionet ${client.guilds.cache.size}`, iconURL: 'https://cdn.discordapp.com/avatars/1119215878895042631/398186e3ccc01b067a79f099e4f1c872.webp?size=2048' })
    .setTimestamp();

  const LogChannel = client.channels.cache.get(logchannelid) || await client.channels.fetch(logchannelid).catch(() => {}) || false;
  if (LogChannel) LogChannel.send({ embeds: [embed] }).catch(console.warn);
});


// бота выгнали(((




client.on("guildDelete", async guild => {
  const logchannelid = "1139237053519892500";
  let theowner = "970423203891666954";
  await guild.fetchOwner().then(({ user }) => { theowner = user; }).catch(() => {});
  let embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle(`__**Покинул сервер**__`)
    .setDescription(`${guild.name} выкинул/забанил Lionet со своего сервера!`)
    .addFields(
      { name: "Информация о сервере", value: `>>> **${guild.name} (${guild.id})**`},
      { name: "Информация о овнере", value: `>>> **${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}**` },
      { name: "Количество участников", value: `>>> **${guild.memberCount}**` },
      { name: 'Сервер создан', value: `>>> <t:${Math.floor(guild.createdTimestamp / 1000)}:R>` },
      { name: "Теперь серверов", value: `>>> **${client.guilds.cache.size}**` }
    )
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({ text: `Lionet ${client.guilds.cache.size}`, iconURL: 'https://cdn.discordapp.com/avatars/1119215878895042631/398186e3ccc01b067a79f099e4f1c872.webp?size=2048' })
    .setTimestamp();

    const LogChannel = client.channels.cache.get(logchannelid) || await client.channels.fetch(logchannelid).catch(() => {}) || false;
  if (LogChannel) LogChannel.send({ embeds: [embed] }).catch(console.warn);
});

    
//Бота добавили он пишет в лс//

client.on('guildCreate', async (guild) => {
  try {
    const owner = await guild.members.fetch(guild.ownerId);


          
      
    if (owner) {
        const link = `https://discord.gg/fex28jsV8G`;
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(link)
          .setEmoji("1140623975597232148")
          .setLabel("Сервер поддержки")
          .setStyle(ButtonStyle.Link)
      );
        
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Спасибо, что добавил меня!!')
        .setDescription(`<:heart:1151514138066034810> Большое спасибо, что добавили Lionet на ваш сервер!

<:emoji_38:1151513977151561728> Вот некоторые основные команды:

Просмотр всех доступных команд: **/help**

Включить/выключить команды: **/panel-commands**

Включить/выключить/изменить систему уровней: **/levelling**

Множество других важных и нужных команд: **/help -> Сервер**

<:emoji_38:1151513977151561728> Наш официальный дискорд сервер: https://discord.gg/fex28jsV8G`)
         
          // Add more fields as needed
        
      owner.send({ embeds: [embed], components: [buttons] });
      console.log(`Отправил письмо с благодарностью ${owner.user.tag}`);
    }
  } catch (error) {
    console.error(`Ошибка отправки сообщения с благодарностью: ${error.message}`);
  }
});

//Бот кик он пишет в лс//

client.on('guildDelete', async (guild) => {
  try {
    const owner = await guild.members.fetch(guild.ownerId);

    if (owner) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('До свидания!')
        .setDescription(`<:nerdrage:1151515167901884486>Меня удалили с вашего сервера, ${owner.user.username}. <:emoji_38:1151513977151561728> КИКНУЛИ МЕНЯ ПО ОШИБКЕ?, Здесь вы можете [Добавить меня](https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot).`);

      owner.send({ embeds: [embed] });
      console.log(`Отправил прощальное послание ${owner.user.tag}`);
    }
  } catch (error) {
    console.error(`Ошибка отправки прощального сообщения: ${error.message}`);
  }
});

    
    // лог команды!!!
    
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.inGuild()) return;
        if (!interaction.isCommand()) return;
        const channel = await client.channels.cache.get('1125714189105758278');
        const server = interaction.guild.name;
        const user = interaction.user.username;
        const userID = interaction.user.id;

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle('🌐 Используемая команда чата')
            .addFields({ name: 'Сервер', value: `${server}` })
            .addFields({ name: 'Команда', value: `${interaction}` })
            .addFields({ name: 'Участник', value: `${user} / ${userID}` })
           .addFields({ name: `Канал`, value: `${interaction.channel.name}`})
          .addFields({ name: `Ссылка`, value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`})
            .setTimestamp()
            .setFooter({ text: 'Используемая команда чата' });

        await channel.send({ embeds: [embed] });
    });


    
  });