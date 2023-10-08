const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');
const QuickChart = require('quickchart-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Показывает количество участников на сервере.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const totalMembers = guild.memberCount;
        const botMembers = guild.members.cache.filter(member => member.user.bot).size;
        const humanMembers = totalMembers - botMembers;
        const last24Hours = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 24 * 60 * 60 * 1000).size;
        const last7Days = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000).size;
       


        const chart = new QuickChart();
        chart
            .setConfig({
                type: 'bar',
                data: {
                    labels: ['Общий', 'Участников', 'Ботов', '24 часа', '7 дней'],
                    datasets: [{
                        label: 'Количество участников',
                        data: [totalMembers, humanMembers, botMembers, last24Hours, last7Days],
                        backgroundColor: ['#36a2eb', '#ffce56', '#ff6384', '#cc65fe', '#66ff99']
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Сервер ${guild.name}`
                        }
                    }
                },



            
            })

            .setWidth(500)
            .setHeight(300)
            .setBackgroundColor('#151515');
           


        const chartUrl = await chart.getShortUrl();

        const embed = new EmbedBuilder()

            .setTitle(`📙 │ ИНФОРМАЦИЯ`)
            .setColor('Random')
            .setFooter({ text: `Lionet©`})
            .setDescription(`Всего: **${totalMembers}**\nУчастников: **${humanMembers}**\nБотов: **${botMembers}**\n За 24 часа: **${last24Hours}**\n За 7 дней: **${last7Days}**`)
            .setImage(chartUrl);

        await interaction.reply({ embeds: [embed] });
    },
};