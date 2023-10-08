const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

const modschema = require('../../Schemas/modmailschema');

const moduses = require('../../Schemas/modmailuses');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('modmail')
    .setDescription('Настройте свою систему modmail.')
    .addSubcommand(command => command.setName('setup').setDescription('Настраивает вашу систему modmail для вас.').addChannelOption(option => option.setName('категория').setDescription('Указанная категория получит ваши майлы.').setRequired(true).addChannelTypes(ChannelType.GuildCategory)))
    .addSubcommand(command => command.setName('disable').setDescription('Отключает систему modmail для вас.'))
    .addSubcommand(command => command.setName('close').setDescription('Закрывает ваш текущий активный modmail.')),
    async execute(interaction, client) {
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'setup':
 
            if (!interaction.guild) return await interaction.reply({ content: `Вы **не можете** использовать эту команду в **ЛС**!`, ephemeral: true})
 
            const data1 = await modschema.findOne({ Guild: interaction.guild.id });
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'У вас **нет** разрешения на это!', ephemeral: true});
 
            if (data1) return await interaction.reply({ content: `Вы **уже** настроили **modmail** на этом сервере. \n> Чтобы отменить действие, выполните **/modmail disable**.`, ephemeral: true });
            else {
 
                const category = await interaction.options.getChannel('категория');
 
                const setupembed = new EmbedBuilder()
                .setColor("#ecb6d3")
                .setFooter({ text: `📞 Настройка Модмейла`})
                .setTimestamp()
                .setTitle('> Модмейл включен')
                .addFields({ name: `• Modmail был включен`, value: `> Теперь ваши участники смогут связаться с вами, \n> отправив мне личное сообщение.!`})
                .addFields({ name: `• Совет`, value: `> Выйдайте все права в категории ${category} для бота Lionet, так всё будет работать, если не работает заходите на наш сервер поддержки. Ссылка: https://discord.gg/fex28jsV8G`})
                .addFields({ name: `• Категория`, value: `> ${category}`})
 
                await interaction.reply({ embeds: [setupembed] });
 
                await modschema.create({
                    Guild: interaction.guild.id,
                    Category: category.id
                })
            }
 
            break;
            case 'disable':
 
            if (!interaction.guild) return await interaction.reply({ content: `Вы **не можете** использовать эту команду в **ЛС**!`, ephemeral: true})
 
            const data = await modschema.findOne({ Guild: interaction.guild.id });
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'У вас **нет** разрешения на это!', ephemeral: true});
 
            if (!data) return await interaction.reply({ content: `Вы **не** настроили **modmail** на этом сервере.`, ephemeral: true });
            else {
 
                const category = await interaction.options.getChannel('категория');
 
                const setupembed = new EmbedBuilder()
                .setColor("#ecb6d3")
                .setFooter({ text: `📞 Модмейл удален`})
                .setTimestamp()
                .setTitle('> Модмейл отключен')
                .addFields({ name: `• Modmail был отключен`, value: `> Ваши участники больше не смогут связаться с вами\n > отправив мне личное сообщение.`})
 
                await interaction.reply({ embeds: [setupembed] });
                await modschema.deleteMany({ Guild: interaction.guild.id })
 
            }
 
            case 'close':
 
            const usedata = await moduses.findOne({ User: interaction.user.id });
 
            if (!usedata) return await interaction.reply({ content: `У вас **нет** открытого **modmail**!`, ephemeral: true});
            else {
 
                const channel = await client.channels.cache.get(usedata.Channel);
                if (!channel) {
 
                    await interaction.reply({ content: `Ваш **modmail** **закрыт**!`, ephemeral: true});
                    await moduses.deleteMany({ User: interaction.user.id });
 
                } else {
 
                    await interaction.reply({ content: `Ваш **modmail** был **закрыт** через **${channel.guild.name}**!`, ephemeral: true});
                    await moduses.deleteMany({ User: interaction.user.id });
                    await channel.send({ content: `⚠️ ${interaction.user} **закрыл** свой **modmail**!`});
 
                }
            }
        }
    }
}