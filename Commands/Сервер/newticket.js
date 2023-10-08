const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../../Schemas/ticketSchema');
const disabled = require("../../Schemas/Panel/Systems/ticket");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Настраивает систему тикетов на сервере.')
        .addChannelOption(option => option.setName('канал')
        .setDescription('Канал для отправки панели заявок').setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option => option.setName('категория')
        .setDescription('Kатегория e для создания билетных каналов в').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
        .addRoleOption(option => option.setName('роль').setDescription('Роль для проверки связи при создании заявки').setRequired(true))
        .addChannelOption(option => option.setName('тикет-логи')
        .setDescription('Канал для отправки стенограмм').setRequired(true))
        .addStringOption(option => option.setName('описание')
        .setDescription('Описание тикетной системы').setRequired(true).setMinLength(1).setMaxLength(1000))
        .addStringOption(option => option.setName('цвет')
        .setDescription('Цвет билетной панели')
        .addChoices(
            { name: 'Красный', value: 'Red' },
            { name: 'Синий', value: 'Blue' },
            { name: 'Зеленый', value: 'Green' },
            { name: 'Желтый', value: 'Yellow' },
            { name: 'Фиолетовый', value: 'Purple' },
            { name: 'Розовый', value: 'DarkVividPink' },
            { name: 'Оранжевый', value: 'Orange' },
            { name: 'Чёрный', value: 'NotQuiteBlack' },
            { name: 'Белый', value: 'White' },
            { name: 'Серый', value: 'Gray' },
            { name: 'Чёрно Синий', value: 'DarkBlue' },
            { name: 'Чёрно Красный', value: 'DarkRed' },
        ).setRequired(true)),


    async execute(interaction, client) {
        const DISABLED = await disabled.findOne({ Guild: interaction.guild.id });

if (DISABLED) {
 await interaction.reply({
 content: "❌ Команда отключена на этом сервере!",
 ephemeral: true
});
return;
}  
        try {
        const { options, guild } = interaction;
        const color = options.getString('цвет');
        const msg = options.getString('описание');
        const thumbnail = interaction.guild.iconURL();
        const GuildID = interaction.guild.id;
        const panel = options.getChannel('канал');
        const category = options.getChannel('категория');
        const role = options.getRole('роль');
        const logs = options.getChannel('тикет-логи');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'У вас **нет** разрешения на это!', ephemeral: true});
        }

        const data = await ticketSchema.findOne({ GuildID: GuildID });
        if (data) return await interaction.reply({ content: `У вас **уже** настроена система заявок на этом сервере.!\n\n Либо у бота нет прав на канал и роль.`, ephemeral: true});

        else {
            await ticketSchema.create({
                GuildID: GuildID,
                Channel: panel.id,
                Category: category.id,
                Role: role.id,
                Logs: logs.id,
            })

            const embed = new EmbedBuilder()
            .setColor(`${color}`)
            .setTimestamp()
            .setTitle('> <:emoji_29:1144172154225700954> Билетная Панель')
            .setAuthor({ name: `Билетная Система`})
            .setFooter({ text:`Билетная панель Готова`})
            .setDescription(`> ${msg} `)

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('ticket')
                .setLabel('Создать билет')
.setEmoji('<:emoji_29:1144172154225700954>')
                .setStyle(ButtonStyle.Primary)
            )

            const channel = client.channels.cache.get(panel.id);
            await channel.send({ embeds: [embed], components: [button] });

            await interaction.reply({ content: `Билетная панель отправлена в ${channel}`, ephemeral: true });
        }
    } catch (err) {
        return;
    }
}
}