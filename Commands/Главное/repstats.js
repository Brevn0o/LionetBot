const { SlashCommandBuilder } = require('@discordjs/builders');

const { EmbedBuilder } = require('discord.js');

const Reputation = require('../../Schemas/repSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repstats')
        .setDescription('Показать рейтинг репутации'),

    async execute(interaction, client) {
        const guildId = interaction.guild.id;
        try {
            const leaderboard = await Reputation.find({ guildId: guildId }).sort({ reputationPoints: -1 }).limit(10);

            const embed = new EmbedBuilder()
                .setTitle('Репутационная таблица лидеров')
                .setDescription('Топ пользователей по очкам репутации')
                .setColor('Random');

            for (let i = 0; i < leaderboard.length; i++) {
                const user = await client.users.fetch(leaderboard[i].userId);
                embed.addFields({
                    name: `${i + 1}. ${user.username}`,
                    value: `Очки репутации: ${leaderboard[i].reputationPoints}\nСуперРепутаций получено:: ${leaderboard[i].superRepReceived}`,
                });
            }

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
        }
    },
};

