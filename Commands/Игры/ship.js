const { SlashCommandBuilder, ApplicationCommandOptionType } = require('discord.js');
//import { Emojis as e } from '../../../../util/util.js'
const thumbnailIcons = {
    broken: "https://media.discordapp.net/attachments/893361065084198954/1089006583788359742/broken.gif",
    flyingHearts: "https://media.discordapp.net/attachments/893361065084198954/1089006584203591720/higer.gif",
    complete: "https://media.discordapp.net/attachments/893361065084198954/1089007634876735528/complete.gif"
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription("Увидеть любовь между двумя людьми.")
    .addUserOption(option => 
      option.setName('пользователь')
      .setDescription('Посмотрите совместимость участника')
      .setRequired(true))
    .addUserOption(option => 
      option.setName('пользователь2')
      .setDescription('Посмотрите совместимость второго участника')
      .setRequired(true)

    ),
            
    async execute(interaction, client) {

        const { options } = interaction
        const userone = options.getUser('пользователь')
        const usertwo = options.getUser('пользователь2')

        if (userone.id == usertwo.id)
            return await interaction.reply({
                content: `Не надо отправлять человека с одним и тем же человеком, ладно?`,
                ephemeral: true
            })

        const percent = Math.floor(Math.random() * 100) + 1
        const { emoji, url, description, result } = build()

        return await interaction.reply({
            embeds: [{
                color: client.blue,
                title: `${emoji} ${client.user.username}| Совместимость `,
                thumbnail: { url },
                description: `${description}\n \n${result}`,
            }]
        })

        function build() {

            const hearts = { red: "❤️", white: "🤍", percent: percent, bar: [] }

            for (let i = 0; i < 10; i++) {
                hearts.percent > 1
                    ? hearts.bar.push(hearts.red)
                    : hearts.bar.push(hearts.white)
                hearts.percent -= 10
            }

            const userMention = `${userone} И ${usertwo}`
            const heartsRedLength = hearts.bar.filter(heart => heart == hearts.red).length
            const result = {
                0: { url: thumbnailIcons.broken, emoji: "🖤", description: `Между ними нет любви ${userMention}.` },
                1: { url: thumbnailIcons.broken, emoji: "💔", description: `Нет ничего невозможного, не так ли? ${userMention}? Я думаю...` },
                2: { url: thumbnailIcons.broken, emoji: '💙', description: `Надежда - это последнее ${userMention}.` },
                3: { url: thumbnailIcons.broken, emoji: '❣️', description: `Ничего, что время не может решить проблемы между ${userMention}.` },
                4: { url: thumbnailIcons.broken, emoji: '💕', description: `Ничего, небольшой разговор между ${userMention} не точно.` },
                5: { url: thumbnailIcons.flyingHearts, emoji: '💘', description: `Будущее и любовь – это то, что требует усилий с обеих сторон. ${userMention}.` },
                6: { url: thumbnailIcons.flyingHearts, emoji: '💗', description: `${userMention} имеет уникальное сияние.` },
                7: { url: thumbnailIcons.flyingHearts, emoji: "💝", description: `Боги любви посмотрели и улыбнулись ${userMention}.` },
                8: { url: thumbnailIcons.complete, emoji: "💞", description: `${userMention} будут знать будущее, граничащее с совершенством..` },
                9: { url: thumbnailIcons.complete, emoji: "💖", description: `Любовь – это то, что ${userMention} знают очень хорошо!` },
                10: { url: thumbnailIcons.complete, emoji: "❤️‍🔥", description: `${userMention} написали и определили свои границы, и свои невероятные истории!!!` }
            }[heartsRedLength]

            if (heartsRedLength == 10)
                hearts.bar = hearts.bar.map(heart => heart = "❤️‍🔥")

            result.result = `${hearts.bar.join('')} **${percent}%**`

            return result
        }
    }
}