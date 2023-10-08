const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const revSchema = require('../../Schemas/reviewSchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('review-disable')
    .setDescription('Отключить систему отзывов'),
    async execute(interaction) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'У вас нет прав на использование этой команды', ephemreal: true});

        const {guildId} = interaction;

        const embed = new EmbedBuilder()

        revSchema.deleteMany({ Guild: guildId}, async (err, data) => {
            embed.setColor('Random')
            .setDescription('Ваша система проверки была успешно отключена.')
            .setFooter({ text: `${interaction.guild.name}`})
            .setTimestamp()

            return interaction.reply({ embeds: [embed] })
        })
    }
}