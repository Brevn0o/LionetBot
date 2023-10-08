const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ChannelType,
    GuildVerificationLevel,
    GuildExplicitContentFilter,
    GuildNSFWLevel,
    SlashCommandBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Получить информацию о сервере."),
    
    async execute(interaction) {
        const { guild } = interaction;
        const {
            members,
            channels,
            emojis,
            roles,
            stickers
        } = guild;
        
        const sortedRoles  = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
        const userRoles    = sortedRoles.filter(role => !role.managed);
        const managedRoles = sortedRoles.filter(role => role.managed);
        const botCount     = members.cache.filter(member => member.user.bot).size;

        const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
            let totalLength = 0;
            const result = [];

            for (const role of roles) {
                const roleString = `<@&${role.id}>`;

                if (roleString.length + totalLength > maxFieldLength)
                    break;

                totalLength += roleString.length + 1;
                result.push(roleString);
            }

            return result.length;
        }

        const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
        const toPascalCase = (string, separator = false) => {
            const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
            return separator ? splitPascal(pascal, separator) : pascal;
        };
let baseVerification = guild.verificationLevel;

 

        if (baseVerification == 0) baseVerification = "Нет"

        if (baseVerification == 1) baseVerification = "Низкий"

        if (baseVerification == 2) baseVerification = "Средний"

        if (baseVerification == 3) baseVerification = "Высокий"

        if (baseVerification == 4) baseVerification = "Очень высокий"
        
        const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
        
        const totalChannels = getChannelTypeSize([
            ChannelType.GuildText,
            ChannelType.GuildNews,
            ChannelType.GuildVoice,
            ChannelType.GuildStageVoice,
            ChannelType.GuildForum,
            ChannelType.GuildPublicThread,
            ChannelType.GuildPrivateThread,
            ChannelType.GuildNewsThread,
            ChannelType.GuildCategory
        ]);

        
        
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor(members.me.roles.highest.hexColor)
                .setTitle(`**${guild.name}|Информация**`)
                .setThumbnail(guild.iconURL({ size: 1024 }))
                .setImage(guild.bannerURL({ size: 1024 }))
                .setTimestamp()
                .setFooter({text: `Попросил ${interaction.user.username}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true })})
                .addFields(
                    {
                        name: "__Общий__",
                        value: [
                            `> 📜 **Создан** <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
                            `> 💳 **ID** ${guild.id}`,
                            `> 👑 **Владелец** <@${guild.ownerId}>`,
                            `> 🌍 **Язык** ${new Intl.DisplayNames(["ru"], { type: "language" }).of(guild.preferredLocale)}`,
                            `> 💻 **Своя ссылка** ${guild.vanityURLCode || "Нет"}`,
                        ].join("\n"),
                    },
                    {
                        name: "__Безопасность__",
                        value: [
                                `> 👀 **Явный фильтр** ${splitPascal(GuildExplicitContentFilter[guild.explicitContentFilter], " ")}`,
                                `> 🔞 **NSFW Уровень** ${splitPascal(GuildNSFWLevel[guild.nsfwLevel], " ")}`,
                                `> 🔒 **Верификациинный уровень** ${baseVerification}`
                        ].join("\n"),
                    },
                    {
                        name: `__Пользователи__ (${guild.memberCount})`,
                        value: [
                            `> <:emoji_7:1140571053618368563> **Участники** ${guild.memberCount - botCount}`,
                            `> <:emoji_6:1140570817705562215> **Боты** ${botCount}`
                        ].join("\n"),
                    },
                    {
                        name: `__Каналы, темы и категории__ (${totalChannels})`,
                        value: [
                            `> 💬 **Текстовые** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}`,
                            `> 🔊 **Войс** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
                            `> 🧵 **Темы** ${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`,
                            `> 📑 **Категории** ${getChannelTypeSize([ChannelType.GuildCategory])}`
                        ].join("\n"),
                    },
                    {
                        name: `__Эмодзи и Стикеры__ (${emojis.cache.size + stickers.cache.size})`,
                        value: [
                            `> 📺 **Анимационные** ${emojis.cache.filter(emoji => emoji.animated).size}`,
                            `> 🗿 **Без анимации** ${emojis.cache.filter(emoji => !emoji.animated).size}`,
                            `> 🏷 **Стикеры** ${stickers.cache.size}`
                        ].join("\n"),
                    },
                    { 
                        name: "__Нитро Статистика__",
                        value: [
                            `> 📈 **Уровень** ${guild.premiumTier || "Нет"}`,
                            `> 💪🏻 **Буст** ${guild.premiumSubscriptionCount}`,
                            `> 💎 **Бустеры** ${guild.members.cache.filter(member => member.roles.premiumSubscriberRole).size}`,
                            `> 🏋🏻‍♀️ **Всего бустеров** ${guild.members.cache.filter(member => member.premiumSince).size}`
                        ].join("\n"),
                    },
                    { name: "__Функции__", value: guild.features?.map(feature => `> ${toPascalCase(feature, " ")}`)?.join("\n") || "> Нет"},
                    { name: `__Роли пользователей__ (${maxDisplayRoles(userRoles)} из ${userRoles.length})`, value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") || "> Нет"}`},
                    { name: `__Управляемые роли__ (${maxDisplayRoles(managedRoles)} из ${managedRoles.length})`, value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(" ") || "> Нет"}`},
                    { name: "__Описание__", value: `> 📝 ${guild.description || "Нет"}` },
                    { name: "__Баннер__", value: guild.bannerURL() ? "** **" : "Нет" }
                )
        ], ephemeral: false });
        
        const textFormatter = new Intl.ListFormat("ru-GB", {
            style: "long",
            type: "conjunction",
        });
    }
}