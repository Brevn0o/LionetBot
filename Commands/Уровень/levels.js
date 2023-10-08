const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const levelschema = require('../../Schemas/levelsetup');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('leveling')
    .setDMPermission(false)
    .setDescription('Настройте свою систему прокачки.')
    .addSubcommand(command => command.setName('role-multiplier').setDescription('Установите множитель опыта для указанной роли.').addRoleOption(option => option.setName('роль').setDescription('Указанная роль получит множитель.').setRequired(true)).addStringOption(option => option.setName('множитель').addChoices(
        { name: '1.5x Множитель', value: '1.5'},
        { name: '2x Множитель', value: '2'},
        { name: '2.5x Множитель', value: '2.5'},
        { name: '3x Множитель', value: '3'},
        { name: '5x Множитель', value: '5'},
        { name: 'ЭКСТРЕМАЛЬНЫЙ: 10-кратный множитель', value: '10'},
        { name: 'ЭКСТРЕМАЛЬНЫЙ: 100-кратный множитель', value: '100'},
        { name: 'ЭКСТРЕМАЛЬНЫЙ: множитель 1000x', value: '1000'}
    ).setRequired(true).setDescription('Указанный размер множителя будет применен к указанной роли.')))
    .addSubcommand(command => command.setName('disable').setDescription('Отключает вашу систему прокачки.'))
    .addSubcommand(command => command.setName('enable').setDescription('Включает вашу систему прокачки.'))
    .addSubcommand(command => command.setName('disable-multiplier').setDescription('Отключает множитель вашей роли.')),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'У вас **нет** разрешения на это!', ephemeral: true});

        const sub = await interaction.options.getSubcommand();
        const multiplier = await interaction.options.getString('множитель');
        const multirole = await interaction.options.getRole('роль');
        const leveldata = await levelschema.findOne({ Guild: interaction.guild.id });

        switch (sub) {

            case 'enable':

            if (leveldata && leveldata.Disabled === 'enabled') return await interaction.reply({ content: `У вас **уже** настроена **система прокачки**. \n> Чтобы отменить действие, выполните **/leveling disable**..`, ephemeral: true});
            else {

                const setupembed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setAuthor({ name: `⬆ Система Уровней`})
                .setFooter({ text: `⬆ Настройка системы Прокачки`})
                .setTimestamp()
                .setTitle('> Уровневая система включена')
                .addFields({ name: `• Повышение уровня настроено`, value: `> Теперь ваши участники смогут\n> зарабатывать XP через систему повышения уровня!`})
 
                if (leveldata) await levelschema.updateOne({ Guild: interaction.guild.id }, { $set: { Disabled: 'enabled' }});
                else {

                    levelschema.create({
                        Guild: interaction.guild.id,
                        Disabled: 'enabled',
                        Role: ' ',
                        Multiplier: ' '
                    })

                }

                await interaction.reply({ embeds: [setupembed] })
            }

            break;
            case 'disable':

            if (!leveldata || leveldata.Disabled === 'disabled') return await interaction.reply({ content: `Вы **еще** не настроили свою **систему прокачки**. \n> Выполните **/leveling enable**, чтобы настроить **систему прокачки**..`, ephemeral: true});
            else {

                const disableembed = new EmbedBuilder()
                .setColor('DarkBlue')
                .setAuthor({ name: `⬆ Система уровней`})
                .setFooter({ text: `⬆ Система уровней отключена`})
                .setTimestamp()
                .setTitle('> Уровни отключены')
                .addFields({ name: `• Повышение уровня было отключено`, value: `> Ваши участники больше не смогут\n> зарабатывать XP через систему повышения уровня!`})
                
                await levelschema.updateOne({ Guild: interaction.guild.id }, { $set: { Disabled: 'disabled' }});
                
                await interaction.reply({ embeds: [disableembed] });
            }

            break;
            case 'role-multiplier':

            if (!leveldata || leveldata.Disabled === 'disabled') return await interaction.reply({ content: `Вы **еще** не настроили свою **систему прокачки**.`, ephemeral: true});
            else {

                if (leveldata.Role !== ' ') return await interaction.reply({ content: `У вас **уже** установлена роль 
                множителя.**! (${leveldata.Role})`, ephemeral: true});
                else {
                    await levelschema.updateOne({ Guild: interaction.guild.id }, { $set: { Role: multirole.id }});
                    await levelschema.updateOne({ Guild: interaction.guild.id }, { $set: { Multi: multiplier }});
                    await interaction.reply({ content: `Ваша роль ${multirole} **настроена** для получения **умноженного** опыта! Уровень умножения: **${multiplier}**x`, ephemeral: true})
                } 
            }

            break;
            case 'disable-multiplier':

            if (!leveldata || leveldata.Disabled === 'disabled') return await interaction.reply({ content: `Вы **еще** не настроили свою **систему прокачки**.`, ephemeral: true});
            else {
                if (leveldata.Role === ' ') return await interaction.reply({ content: `Вы **еще** не настроили множитель роли и не можете отключить **ничего**..`, ephemeral: true});
                else {
                    await interaction.reply({ content: `Ваша роль множитель <@&${leveldata.Role}> **отключена**!`, ephemeral: true });
                    await levelschema.updateOne({ Guild: interaction.guild.id }, { $set: { Role: ' ' }});
                    await levelschema.updateOne({ Guild: interaction.guild.id }, { $set: { Multi: ' ' }});
                }
            }
        }
    }
}