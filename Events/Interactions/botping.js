const { Events, EmbedBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,

    async execute (message, client, interaction ) {
        if (message.author.bot) return;
        if (message.content.startsWith("<@1149769006551662603>"))
        {

            const pingEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle("Кто меня упомянул??")
            .setDescription(`Эй чел на **${message.author.username}** вот немного полезной информации...`)
            .setTimestamp()
            .setThumbnail(`https://media.discordapp.net/attachments/1129066737296490546/1141025214298337411/discotools-xyz-icon_74.png`)
            .setFooter({text: `Запрошенный ${message.author.username}`})

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setEmoji("☑️")
                .setLabel("Добавить меня")
                .setURL("https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot")
                .setStyle(ButtonStyle.Link),


                new ButtonBuilder()
                .setEmoji("📩")
                .setLabel("Сервер Поддержки")
                .setURL("https://discord.gg/x8TkTbZ9YN")
                .setStyle(ButtonStyle.Link)

            );
            return message.reply({ embeds: [pingEmbed], components: [buttons] });
        }
    }

}