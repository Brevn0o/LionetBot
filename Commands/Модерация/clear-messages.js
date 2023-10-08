const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits} = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear-message')
    .setDescription('Это удаляет сообщения канала.')
    .addIntegerOption(option => option.setName('количество').setDescription('Количество сообщений, которые вы хотите удалить.').setMinValue(1).setMaxValue(100).setRequired(true))
    .addUserOption(option => option.setName('пользоваель').setDescription(`Сообщения указанного пользователя будут удалены.`)),

    async execute (interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: 'У вас нет разрешения на удаление сообщений.', ephemeral: true });


        let number = interaction.options.getInteger('количество');
        const user = interaction.options.getUser('пользователь');

        if (isNaN(amount) || parseInt(amount) < 1 || parseInt(amount) > 100) {
            return interaction.reply({ content: 'Пожалуйста, укажите действительный номер между **1** и **100**.', ephemeral: true });
        }

        const errembed = new EmbedBuilder()

            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')

            .setColor("Random")
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages))
            
            return interaction.reply({ embeds: [errembed], ephemeral: true });
        
        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('<:emoji_6:1140609545987686482>| Очистка')
        .setDescription(`Успешно удалено ${number} сообщений..`)


        await interaction.channel.bulkDelete(number)

        interaction.reply({ embeds: [embed] });
    }
}