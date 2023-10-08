const { Client, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')
const translate = require("@iamtraction/google-translate")
const { EmbedBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Переведите любой текст на определенный язык!")
    .addStringOption(
        option => 
        option.setName("текст")
        .setDescription("Текст, который вы хотите перевести!")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("язык")
        .setDescription("Язык, на который вы хотите перевести!")
        .addChoices(
            { name: "Английский", value: "english"},
            { name: "Германский", value: "german"},
            { name: "Французский", value: "french"},
            { name: "Русский", value: "russian"},
        ).setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
        async execute(interaction, client) {
            

            const { options } = interaction
            const text = options.getString("текст")
            const language = options.getString("язык")

            switch (language) {
                case "english": {
                    const translated = await translate(text, { to: 'en' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;

                case "german": {
                    const translated = await translate(text, { to: 'de' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;

                case "french": {
                    const translated = await translate(text, { to: 'fr' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;

                case "spanish": {
                    const translated = await translate(text, { to: 'sp' })
                    send_translated(text, translated.text, interaction, client)
                }

                case "russian": {
                    const translated = await translate(text, { to: 'ru' })
                    send_translated(text, translated.text, interaction, client)
                }
                break;
            }

    }
}

function send_translated(text, translated, interaction, client) {
    const Response = new EmbedBuilder()
    .setTitle("🌍 Перевод")
    .addFields(
        { name: "Сообщение:", value: text, inline: true},
        { name: "Перевод:", value: translated, inline: true}
    ).setFooter({text: `Попросил: ${interaction.member.user.username}`, iconURL: interaction.member.user.displayAvatarURL()})

    interaction.channel.send({ embeds: [Response] })
    interaction.reply({content: "Успешно переведенное сообщение!", ephemeral: true})
}