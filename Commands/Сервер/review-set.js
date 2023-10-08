const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const revSchema = require("../../Schemas/reviewSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("review-setup")
    .setDescription("Настроить систему отзывов")
    .addChannelOption(option => option.setName("канал").setDescription("канал для отзывов").addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute (interaction, client) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'У вас нет прав на использование этой команды', ephemreal: true});

        const { channel, guildId, options } = interaction;
        const revChannel = options.getChannel("канал");

        revSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

            if (!data) {
                await revSchema.create({
                    Guild: guildId,
                    Channel: revChannel.id
                })

                const embed1 = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`Ваша система отзывов успешно настроена в ${revChannel}`)
                .setFooter({ text: `${interaction.guild.name}`})
                .setTimestamp()

                return interaction.reply({ embeds: [embed1] })
            } else if (data) {
                const c = client.channels.cache.get(data.Channel);

                const embed2 = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`Вы уже настроили систему отзывов в ${c}`)
                .setFooter({ text: `${interaction.guild.name}`})
                .setTimestamp()

                return interaction.reply({ embeds: [embed2], ephemreal: true})
            }
        })
        
    }
}