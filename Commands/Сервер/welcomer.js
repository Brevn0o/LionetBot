const { SlashCommandBuilder, PermissionsBitField, ChannelType, EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('welcome')
            .setDescription('Установка приветствуется!')
            .addSubcommand(subcommand => subcommand
                .setName('setup')
                .setDescription('Включите систему приветствия!')
                
                .addChannelOption(option => option
                    .setName('канал')
                    .setDescription('Канал для настройки')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('заголовок')
                    .setDescription('Название вставки, вы можете использовать %member% и %server%')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('описание')
                    .setDescription('Описание вставки, вы можете использовать  %member%, %server% и %memberCount%')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('изображение')
                    .setDescription('Вы хотите, чтобы изображение было отправлено?')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Да', value: 'yes' },
				        { name: 'Нет', value: 'no' },
                    )
                 )
            )
            .addSubcommand(subcommand => subcommand
                .setName('disable')
                .setDescription('Отключить систему приветствия!')
            ),
async execute(interaction, client) {
        let db = client.db
        //let group = interaction.options.getSubcommandGroup()
        let subcommand = interaction.options.getSubcommand()
        
//case 'welcome':
                switch(subcommand) {
                    case 'setup':
                        let channel = interaction.options.getChannel("канал")
                        let embedTitle = interaction.options.getString("заголовок")
                        let embedDesc = interaction.options.getString("описание")
                        let canvas = interaction.options.getString("изображение")
                        let data = client.db.prepare('SELECT * FROM welcomeing WHERE guildID = ?').get(interaction.guild.id)
                        if(!data) {
                            if(channel.type !== ChannelType.GuildText) return interaction.reply({ content: 'Канал должен быть текстовым!', ephemeral: true })
                            client.db.prepare(`INSERT INTO welcomeing (guildID, channelID, embedTitle, embedDesc, canvas) VALUES (?, ?, ?, ?, ?)`).run(interaction.guild.id, channel.id, embedTitle, embedDesc, canvas)
                            interaction.reply({embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${client.eyes} Успешно настроено Приветствие!`)
                                    .setDescription(`Ваша система приветствия настроена, и теперь она будет приветствовать игроков в **<#${channel.id}>**.\nВаши настройки перечислены ниже.:`)
                                    .addFields(
                                        {name: "Заголовок", value: embedTitle, inline: true},
                                        {name: "Описание", value: embedDesc, inline: true},
                                        {name: "Отправить изображение?", value: canvas.replace("y", "Y").replace("n", "N"), inline: true}
                                    )
                                ]
                            })

                        } else {
                            if(channel.type !== ChannelType.GuildText) return interaction.reply({ content: 'Канал должен быть текстовым.!', ephemeral: true })
                            client.db.prepare(`UPDATE welcomeing SET channelID = ?, embedTitle = ?, embedDesc = ?, canvas = ? WHERE guildID = ?`).run(channel.id, embedTitle, embedDesc, canvas, interaction.guild.id)
                            interaction.reply({embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${client.eyes} Успешно настроено Приветствие!`)
                                    .setDescription(`Ваша система приветствия настроена, и теперь она будет приветствовать новых пользователей в **<#${channel.id}>**.\nВаши настройки перечислены ниже.:`)
                                    .addFields(
                                        {name: "Заголовок", value: embedTitle.replace("%member%", "John Doe").replace("%server%", interaction.guild.name), inline: true},
                                        {name: "Описание", value: embedDesc.replace("%member%", "John Doe").replace("%server%", interaction.guild.name).replace("%memberCount%", interaction.guild.memberCount), inline: true},
                                        {name: "Отправить изображение?", value: canvas.replace("y", "Y").replace("n", "N"), inline: true}
                                    )
                                    .setTimestamp(new Date)
                                ]
                            })
                        }
                
                    break;

                    case "disable":
                        client.db.prepare(`DELETE * welcomeing WHERE guildID = ?`).run(interaction.guild.id)
                        interaction.reply({ embeds:[
                            new EmbedBuilder()
                                    .setTitle(`${client.eyes} Успешно отключена система пртветствий`)
                                    .setDescription("Новые пользователи не получат приветственное сообщение")
                                    .setTimestamp(new Date)
                        ]
                        });

                   // break;
               //}
              
    }
 },
};