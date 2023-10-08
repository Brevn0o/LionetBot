const {
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Все команды бота."),
    async execute(interaction) {

        const { client } = interaction;
       
        
        const emojis = {
            информация: "📃",
            главное: "⚙️",
            сервер: "👑",
            развлечения: "🌎",
            уровень: "🏆",
            модерация: "🛡",
            игры: "🎮",
            экономика: "💰"

        };

        function getCommand(name) {
            const getCommandID = client.application.commands.cache
                .filter((cmd) => cmd.name === name) 
                .map((cmd) => cmd.id); 

            return getCommandID;
        }

        const directories = [
            ...new Set(client.commands.map((cmd) => cmd.folder)),
        ];

        const formatString = (str) =>
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = client.commands
                .filter((cmd) => cmd.folder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description:
                            cmd.data.description ||
                            "Для этой команды нет описания.",
                    };
                });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder()
            .setDescription("Просмотрите списки команд, выбрав категорию ниже!")
            .setColor('Random')
            .setAuthor({ name: `Все команды ${client.user.username} `, iconURL: client.user.avatarURL() })
            .setTitle('**🧢 Хелп лист**:')
            .setDescription("**Для изучения категорий, используйте меню выбора ниже.**")
            .addFields([
                { name: `**Lionet - Бот** имеющий множество различных команд, которые смогут помочь вам с настройкой сервера, модерацией и развлечением.`, value: `\n\nЕсли вы хотите добавить бота к себе на сервер, то напишите **/invite**.\n`, inline: false},
                { name: 'Что вообще есть в боте Lionet?', value:` <:cmd:1143929603929419886> Верификация \n <:cmd:1143929603929419886> Модерация \n <:cmd:1143929603929419886> Развлечения \n <:cmd:1143929603929419886> Игры \n <:cmd:1143929603929419886> Тикеты \n <:cmd:1143929603929419886> Уровни \n <:cmd:1143929603929419886> Экономика \n <:cmd:1143929603929419886> Розыгрыши \n`, inline: false },
                { name: 'Поддержать создателя: /donat', value: `Есть баги, так напишите баг разработчику: **/features bug-report**\n Написать идею для бота: **/features suggestion**`, inline: false },
                
                {
                    name: `**Полезные ссылки:**`,
                    value: `[Сервер поддержки](https://discord.gg/fex28jsV8G)
[Добавить бота](https://discord.com/api/oauth2/authorize?client_id=1149769006551662603&permissions=28583007354871&scope=bot)
[Проголосовать за бота](https://bots.server-discord.com/1119215878895042631)`,
                    inline: false,
                }
            ])
            .setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() })

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("help-menu")
                    .setPlaceholder("Нажми на меня")
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                emoji: emojis[cmd.directory.toLowerCase() || null],
                            };
                        })
                    )
            ),
        ];

        
        
        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) =>
            interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
        });

        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${emojis[directory.toLowerCase() || null]}  ${formatString(directory)}`)
                .setDescription(
                    `Список всех команд, отнесенных к категории ${directory}.`
                )


    .setFooter({ text: `Лев | © 2023 всё защищено на львиных правах.`, iconURL: client.user.displayAvatarURL() })
                .setColor('Random')
                .addFields(
               category.commands.map((cmd) => {
                        return {
                            name: `<:cmd:1143929603929419886> </${cmd.name}:${getCommand(cmd.name)}>`,
                            value: `<:krest:1143930216788525207> \`${cmd.description}\``,
                            inline: true,
                        };
                    })
                );
            

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on("end", () => {
            initialMessage.edit({ components: components(true) });
        });
    },
};