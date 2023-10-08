const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');



module.exports = {

    data: new SlashCommandBuilder()
        .setName('call')
        .setDescription('Чтобы позвонить участнику в его личных сообщениях')
        .addUserOption(option =>
            option
                .setName('участник')
                .setDescription('Пользователь, которому вы хотите позвонить')
                .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('причина')
                        .setDescription('Выберите причину звонка')
                        .setRequired(false)
                        .addChoices(
                            {name: 'Срочный', value: 'Срочный'},
                            {name: 'Важный', value: 'Важный'},
                            {name: 'Повседневный', value: 'Повседневный'},
                        )),

    async execute(interaction) {
        let user = interaction.options.getUser('участник');
        let reason = interaction.options.getString('причина');

        const callEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle('📞 Вам звонят!')
            .setDescription(`Привет ${user}, ${interaction.user.username} Вызывает вас, пожалуйста, прочитайте информацию ниже, чтобы узнать информацию о вызове.`)
            .addFields ([
                {
                    name: '🔊 Канал',
                    value: `<#${interaction.channel.id}>`,
                    inline: true
                },
                {
                    name: '📢 Причина',
                    value: `**${reason}**` || 'Нет причины',
                    inline: true
                },
                {
                    name: '👤 Звонящий',
                    value: `<@${interaction.user.id}>`,
                    inline: true
                }
            ])
            .setTimestamp()
            .setFooter ({
                text: 'Пожалуйста, ответьте быстро.',
                iconURL: interaction.user.displayAvatarURL()
            })

        interaction.reply({ content: `Готово, я отправил сообщение в ЛС ${user}`, ephemeral: true });

        try {
            await user.send({ embeds: [callEmbed] });
        } catch (error) {
            console.error(`Ошибка отправки сообщения, возможно у него закрыт ЛС ${user.tag}: ${error}`);
        }
    }
};

