const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js')

const schema = require('../../Schemas/marriageSchema');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('marrylist')
    .setDescription("Проверяет участника женат ли он на ком то")
    .addUserOption(opt => opt.setName('участник').setDescription("Участник для проверки").setRequired(false)),

    async execute (interaction) {
        const user = interaction.options.getUser('участник') || interaction.user
        const data = await schema.findOne({ marriedUser: user.id });
        if (!data) {
            const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`${user} ни на ком не женат!`)

            await interaction.reply({ embeds: [embed] })
        } else {
            const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Лист женатых на сервере!')
           .setDescription(`${user} женат на <@${data.marriedTo}>`)

            await interaction.reply({ embeds: [embed] })
        }
    }
}