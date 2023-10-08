const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const revSchema = require('../../Schemas/reviewSchema');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("review")
    .setDescription(`Отзыв о сервере`)
    .addStringOption(option =>option.setName("звёзды").setDescription("Количество звезд.").addChoices(
                { name: "⭐", value: "⭐" },
                { name: "⭐⭐", value: "⭐⭐" },
                { name: "⭐⭐⭐", value: "⭐⭐⭐" },
                { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
                { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
            )
            .setRequired(true))
    .addStringOption(option => option.setName("описание").setDescription("Описание вашего отзыва.").setRequired(true)),
    async execute (interaction) {
 
        revSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {
 
            if (!data) {

                const embed0 = new EmbedBuilder()
                .setColor('Random')
                .setDescription('Система отзывов еще не создана')
                .setFooter({ text: `${interaction.guild.name}`})
                .setTimestamp()

                return await interaction.reply({ embeds: [embed0], ephemeral: true})
            }
 
            if (data) {
                const channelID = data.Channel;
                const stars = interaction.options.getString("звёзды");
                const description = interaction.options.getString("описание");
                const channel = interaction.guild.channels.cache.get(channelID);
                const member = interaction.user.tag

                const embed1 = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`Отзыв оставил ${member}`)
                .addFields(
                    { name: "Звёзды", value: `${stars}`, inline: true },
                    { name: "Описание отзыва", value: `${description}\n` },
                    )
                .setFooter({ text: `${interaction.guild.name}`})
                .setTimestamp()

                const embed2 = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`Ваш отзыв успешно отправлен ${channel}`)
                .setFooter({ text: `${interaction.guild.name}`})
                .setTimestamp()

                channel.send({ embeds: [embed1] });
                
                return interaction.reply({ embeds: [embed2], ephemeral: true });
            }
        })
 
    }
}