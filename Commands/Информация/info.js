const { Client, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Информация про бота"),
    async execute(interaction, client) {
        const Embed = new EmbedBuilder()
            .setTitle("**🦁 Lionet**")
            .setDescription(`**Привет! Меня зовут Львёнок! Я небольшой бот с кучей полезных ништяков.**`)
            .setColor('Random')
            .setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() })
            .addFields(
                {
                    name: `Приятно познакомиться.`,
                    value: `**Мой префикс \`/\`. Взгляни на команду /help для более детальной информации о моих возможностях.**`,
                    inline: true,
                },
                {
                    name: `Версия:`,
                    value: `1.05 (14.09.2023)`,
                    inline: true,
                },
                {
                    name: `Мой разработчик:`,
                    value: `<@1149758409713918134>`,
                    inline: true,
                },
                {
                    name: `**Полезные ссылки:**`,
                    value: `[Сервер поддержки](https://discord.gg/fex28jsV8G)
[Добавить бота](https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot)
[Проголосовать за бота](https://bots.server-discord.com/1119215878895042631)`,
                    inline: false,
                }
            );

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel('Сервер поддержки')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/fex28jsV8G"),

            new ButtonBuilder()
            .setLabel('Добавить бота')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot")
            
)
        
        await interaction.reply({ embeds: [Embed], components: [button] });
    },
};