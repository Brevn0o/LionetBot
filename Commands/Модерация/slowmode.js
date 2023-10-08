const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require(`discord.js`);
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Измените медленный режим канала')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Установите медленный режим для канала')
            .addChannelOption(option => option
                .setName('канал')
                .setDescription('Канал для отключения медленного режима работы')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('время')
                .setDescription('Формат времени для установки замедленного режима канала на')
                .setRequired(true)
                .setMinValue(1)
            )
            .addStringOption(option => option
                .setName('времяформат')
                .setDescription('Формат времени для установки замедленного режима канала на')
                .addChoices(
                    { name: 'Секунд', value: 'second' },
                    { name: 'Минут', value:'minutes' },
                    { name: 'Часов', value: 'hours' },
                )
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('disable')
            .setDescription('Отключите медленный режим канала')
            .addChannelOption(option => option
                .setName('канал')
                .setDescription('Канал для отключения медленного режима работы')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
 
    async execute(interaction) {
 const errembed = new EmbedBuilder()

            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')

            .setColor("Random")
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers))
            
            return interaction.reply({ embeds: [errembed], ephemeral: true });
        
        
        const channel = interaction.options.getChannel('канал');
        const time = interaction.options.getInteger('время');
        const timeformat = interaction.options.getString('времяформат');
 
        
        let timeInSeconds = 0;
        switch (timeformat) {
            case'second':
                timeInSeconds = time;
                break;
            case'minutes':
                timeInSeconds = time * 60;
                break;
            case 'hours':
                timeInSeconds = time * 60 * 60;
                break;
        }
 
        
        switch (interaction.options.getSubcommand()) {
            case'set':
                await channel.setRateLimitPerUser(timeInSeconds);
                interaction.reply({ content: `Медленный режим для ${channel} был установлен на ${time} ${timeformat}`, ephemeral: false });
                break;
            case 'disable':
                await channel.setRateLimitPerUser(0);
                interaction.reply({ content: `Медленный режим в ${channel} был отключен`, ephemeral: false });
                break;
        }
 
    },
}