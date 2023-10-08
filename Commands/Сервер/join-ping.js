const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ChannelType } = require('discord.js');
const pingschema = require('../../Schemas/joinping');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('join-ping')
    .setDescription('Настройте систему проверки связи присоединения.')
    .addSubcommand(command => command.setName('add').setDescription('Пользователь получит специальный пинг').addChannelOption(option => option.setName('канал').setDescription('Пользователь получит пинг в указанном канале.').setRequired(true).addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)))
    .addSubcommand(command => command.setName('remove').setDescription('Пользователь перестанет получать пинги от определенного канала при присоединении.').addChannelOption(option => option.setName('канал').setDescription('Указанный канал больше не будет использовать систему проверки связи присоединения.').setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)))
    .addSubcommand(command => command.setName('disable').setDescription('Отключает все пинги присоединения. Используйте с осторожностью.')),
    async execute(interaction, err) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: '**У вас нет разрешений на использование этой команды**', ephemeral: true})
        const sub = interaction.options.getSubcommand();
        const executer = await interaction.user.id;
        const pingdata = await pingschema.findOne({ Guild: interaction.guild.id });
        const channel = await interaction.options.getChannel('канал');

        switch (sub) {
            case 'add':

            const pingadded = new EmbedBuilder()
            .setColor('DarkRed')
            .setAuthor({ name: `🔔 Система пингов`})
            .setFooter({ text: `🔔 Присоедение пинга добавлен`})
            .addFields({ name: `• Пинг добавлен`, value: `> Ваш канал (${channel}) теперь \n> будет проверяемым каналом для \n> любые новые участники.`})
            .setTimestamp()
            .setTitle('> Пинг добавлен')
    
            if (!pingdata) {

                await pingschema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id
                })

                await interaction.reply({ embeds: [pingadded] });

            } else {

                if (pingdata.Channel.includes(channel.id)) return await interaction.reply({ content: `У вас **уже** есть пинг ${channel}!`, ephemeral: true});
                else {
                    await pingschema.updateOne({ Guild: interaction.guild.id }, { $push: { Channel: channel.id }});
                    await interaction.reply({ embeds: [pingadded] });
                }

            }

            break;
            case 'remove':

            const pingremove = new EmbedBuilder()
            .setColor('DarkRed')
            .setAuthor({ name: `🔔 Пинг система`})
            .setFooter({ text: `🔔 Присоедение пинг убрана`})
            .addFields({ name: `• Пинг добавлен`, value: `> Ваш канал (${channel}) \n> больше не будет проверяемым каналом для \n> новых участников.`})
            .setTimestamp()
            .setTitle('> Пинг убран')
            
            if (!pingdata) return await interaction.reply({ content: `Вы **ещё не добавили** никаких **пингов присоединения** и не можете удалить **ничего**..`, ephemeral: true})
            else {

                if (!pingdata.Channel.includes(channel.id)) return await interaction.reply({ content: `У вас **не** установлен пинг для ${channel}!`, ephemeral: true});
                else {
                    await pingschema.updateOne({ Guild: interaction.guild.id }, { $pull: { Channel: channel.id }});
                    await interaction.reply({ embeds: [pingremove] });
                }

            }

            break;
            case 'disable':

            const warnembed = new EmbedBuilder()
            .setColor('DarkRed')
            .setAuthor({ name: `🛠 Присоедение пинг система`})
            .setTimestamp()
            .setFooter({ text: `🛠 ПРЕДУПРЕЖДЕНИЕ!`})
            .setTitle('> Вау, помедленнее!')
            .addFields({ name: `• Предупреждение`, value: `> Эта команда удалит **ВСЕ** соединения \n> пинги, вместо этого используйте **/join-ping remove** \n > если вы пытаетесь отключить конкретный \n > в противном случае нажмите кнопку подтвердить! `})

            if (!pingdata) return await interaction.reply({ content: `У вас **нет** настроенных **пингов присоединения**, вы не можете отключить **ничего**..`, ephemeral: true});
            else {

                if (!pingdata.Channel || pingdata.Channel === [ ]) return await interaction.reply({ content: `Вы **уже** отключили все свои пинги, нет необходимости использовать **/join-ping remove**.`});
                else { 

                    const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('✅ Согласен')
                        .setStyle(ButtonStyle.Success),

                        new ButtonBuilder()
                        .setCustomId('decline')
                        .setLabel('❌ Отказываюсь')
                        .setStyle(ButtonStyle.Danger)
                    )

                    const msg = await interaction.reply({ embeds: [warnembed], components: [buttons] });
                    const collector = msg.createMessageComponentCollector();

                    collector.on('collect', async i => {

                        if (i.customId === 'confirm') {
                            if (i.user.id !== executer) return await i.reply({ content: `Вы **не можете** использовать эти кнопки!`, ephemeral: true});
                            await pingschema.deleteMany({ Guild: interaction.guild.id });
                            await i.update({ embeds: [], content: `**Успешно** удалены **ВСЕ** пинги присоединения с вашего сервера..`, components: []});
                        }

                        if (i.customId === 'decline') {
                            if (i.user.id !== executer) return await i.reply({ content: `Вы **не можете** использовать эти кнопки!`, ephemeral: true});
                            await i.update({ embeds: [], content: `**Операция** отменена.`, components: []});
                        }
                    })
                }
            }
        }
    }
 }