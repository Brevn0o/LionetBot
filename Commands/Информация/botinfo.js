const { SlashCommandBuilder, EmbedBuilder, Collection, ChatInputCommand, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Discord = require('discord.js')
const os = require('os') //npm i os
const cpuStat = require('cpu-stat') //npm i cpu-stat
//const wait = require('node:timers/promises').setTimeout;


module.exports = {

    data: new SlashCommandBuilder()

        .setName('botinfo')
        .setDescription("Это позволит получить некоторую информацию о боте"),


    async execute(interaction, client) {
if (!interaction.isChatInputCommand()) return
        const { guild } = interaction;
        const { ownerId } = guild;
        const owner = await guild.members.fetch(ownerId);
         await client.user.fetch();

            await client.application.fetch()
        //const message = await interaction.deferReply({ fetchReply: true, ephemeral: false });
   //await interaction.deferUpdate();

        cpuStat.usagePercent(function (error, percent) {
            if (error) return console.log(error)

            function formatBytes(a, b) {
                let c = 1024
                d = b || 2
                e = ['B', 'KB', 'MB', 'GB', 'TB']
                f = Math.floor(Math.log(a) / Math.log(c))

                return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
            }

            //const test = os.type()
            const operatingSystem = os.version()
            const osArch = os.arch()
            const memoryUsage = formatBytes(process.memoryUsage().heapUsed)
            CPU = percent.toFixed(2)
            const CPUModel = os.cpus()[0].model
            const cores = os.cpus().length / 2

            const embed = new EmbedBuilder()
                .setTitle(`\`\`\`
${client.user.username}|Информация
\`\`\``)
                .setColor(0x003c64)
                .setThumbnail(client.user.displayAvatarURL())
                .setAuthor({ url: `https://cdn.discordapp.com/avatars/1119215878895042631/4118ecd9ca74d6f754869457846f1e8b.webp?size=2048`, iconURL: client.user.displayAvatarURL(), name: client.user.username })
                .addFields({ name: " ", value: ` \`\`\`
Здесь вы найдете всю необходимую информацию о Lionet в Discord.
\`\`\` `, inline: false })

                .addFields({ name: '<:developerig:1143983253288660992> Разработчик', value: ` \`\`\`yaml
➡️ ${client.application.owner.tag}
\`\`\``, inline: false })
               .addFields({ name: '<:servsr:1143996233548058624> Серверов', value: ` 
\`\`\`yaml
➡️ ${client.guilds.cache.size}
\`\`\` `, inline: false})

               .addFields({ name: '<:emoji_7:1140571053618368563> Участников', value:
` \`\`\`yaml
➡️ ${client.users.cache.size}
\`\`\`\ `, inline: false})
                .addFields({ name: '<:ping:1143989504290603038> API Задержка ', value: ` \`\`\`yaml
➡️ ${client.ws.ping}мс
\`\`\``, inline: false })
                .addFields({ name: '<:ping:1143989504290603038> BOT Задержка ', value: ` \`\`\`yaml
➡️ ${client.createdTimestamp - interaction.createdTimestamp}
\`\`\` `, inline: false })
                .addFields({ name: '<:command:1143991645273067520> Команд ', value: ` \`\`\`yaml
➡️ ${client.commands.size}
\`\`\` `, inline: false })
                .addFields({ name: '<:lionetik:1143985368874614915> # ', value: ` \`\`\`yaml
➡️ ${client.user.discriminator}
\`\`\` `, inline: false })
                .addFields({ name: '<:djs:1143984123803869244> Дискорд.js версия ', value: ` 

\`\`\`yaml
➡️ V${Discord.version}
\`\`\` `, inline: false })
                .addFields({ name: '<:jsjs:1143983937908133942> Node Версия ', value: ` \`\`\`yaml
➡️ V${process.versions.node}
\`\`\` `, inline: false })
                .addFields({ name: "<:botid:1143993630026121376> БОТ ID ", value: ` \`\`\`yaml
➡️ ${client.user.id}
\`\`\` `, inline: false })
                .addFields({ name: '<:cpu:1143987056985518122> CPU модель ', value: `\`\`\`yaml
➡️ ${CPUModel}
\`\`\` `, inline: false })
                .addFields({ name: '<:cpu:1143987056985518122> CPU ', value: ` \`\`\`yaml
➡️ ${CPU} %
\`\`\``, inline: false })
                .addFields({ name: '<:cpu:1143987056985518122> CPU Основной ', value: ` \`\`\`yaml
➡️ ${cores}
\`\`\``, inline: false })
                .addFields({ name: '<:memory:1143986555816530082> Память ', value: `\`\`\`yaml
➡️ ${memoryUsage}
\`\`\` `, inline: false })
                .addFields({ name: '<:windows:1143993187321532476> Операционная система  ', value: ` \`\`\`yaml
➡️ ${operatingSystem} ${osArch}
\`\`\` `, inline: false })
                .addFields({ name: '<:uptime:1143991145840525453> Работает', value: ` \`\`\`yaml
➡️ ${Math.round(client.uptime / (1000 * 60 * 60)) + "ч " + (Math.round(client.uptime / (1000 * 60)) % 60) + "м " + (Math.round(client.uptime / 1000) % 60) + "с "}
\`\`\` `, inline: false })
                .setFooter({ iconURL: client.user.displayAvatarURL(), text: `Лев | © 2023 всё защищено на львиных правах.` })
                .setTimestamp()

          const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Сервер поддержки')
            .setEmoji("1151514138066034810")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/fex28jsV8G"),

            new ButtonBuilder()
            .setLabel('Добавить бота')
            .setEmoji("1151514138066034810")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot")
            
)       
                  
             interaction.reply ({ embeds: [embed], components: [button] });
        })
       // await interaction.deferReply({ fetchReply: true, ephemeral: false });
    }
    
}