const { SlashCommandBuilder } = require('@discordjs/builders');

const { EmbedBuilder,PermissionFlagsBits } = require('discord.js');

const Reputation = require('../../Schemas/repSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repremove')
        .setDescription('Снять очки репутации с пользователя')
        .addUserOption(option => option.setName('участник').setDescription('Пользователь, у которого вы хотите удалить репутацию').setRequired(true))
        .addIntegerOption(option => option.setName('поинтов').setDescription('Количество очков репутации для удаления').setRequired(true)),

    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
              content: "У вас нет прав администратора для использования этой команды.",
              ephemeral: true,
            });
          }

        const targetUser = interaction.options.getUser('участник');
        const pointsToRemove = interaction.options.getInteger('поинтов');
        const guildId = interaction.guild.id;

        try {
            if (pointsToRemove <= 0) {
                await interaction.reply("Пожалуйста, укажите положительное количество очков репутации для удаления.");
                return;
            }

            let targetRep = await Reputation.findOne({ guildId: guildId, userId: targetUser.id });

            if (!targetRep || targetRep.reputationPoints < pointsToRemove) {
                await interaction.reply("У целевого пользователя недостаточно очков репутации для удаления.");
                return;
            }

            targetRep.reputationPoints -= pointsToRemove;

            await targetRep.save();

            const embed = new EmbedBuilder()
                .setTitle('Репутация Удалена')
                .setDescription(`Вы удалили ${pointsToRemove} очков репутации с ${targetUser.username}.`)
                .setColor('Random');

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
        }
    },
};

