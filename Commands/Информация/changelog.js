const { Client, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ButtonComponent, Component, ComponentType, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changelog")
        .setDescription("Обновления бота"),
    async execute(interaction, client) {
        const Embed = new EmbedBuilder()
        .setTitle('Журнал изменений 1.1 (17.09.2023)')
        .setColor('Green')
        // плюс: <:plus:1147131948070862938>
        // слеш: <:slash:1147131872409821234>
        // минус: <:minus:1147132483079512095>
        .setDescription('**<:plus:1147131948070862938> Добавлена команда /temprole - выдаёт временную роль.\n <:plus:1147131948070862938> Добавлена команда /mass-unban - разбанивает всех забаненных\n <:plus:1147131948070862938> Добавлена команда /nick - модератор может менять никнейм участнику\n <:plus:1147131948070862938> Добавлена команда /modmail enable/disable/close - Овчень Хорошая Система. Короче, пишите enable отправляете сообщение боту и он там выводит сообщение, нажимайте на кнопочку ниже и пишите айди и вопрос, который вы хотите задать вопрос своим любимым модерам.\n <:slash:1147131872409821234> Исправлено множество багов.**')
        .addFields({name: "Отправить баг", value: "/features bug-report", inline: true})
        .addFields({name: 
            "Отправить идею боту", value: "/features suggest", inline: true})
        .setTimestamp()
        .setFooter({text: '©Igrooook - 2023'});

        await interaction.reply({ embeds: [Embed] })
    }
}