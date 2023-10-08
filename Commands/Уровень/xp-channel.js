const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const c = require("../../Schemas/xpChannel");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xp-channel")
    .setDescription("Настройте канал сообщений об опыте/прокачке")
    .addSubcommand(command => command
        .setName("add")
        .setDescription("Добавьте канал сообщений XP")
        .addChannelOption(option => option
            .setName("канал")
            .setDescription("Канал сообщения")
            .setRequired(true)
        )
    )
    .addSubcommand(command => command
        .setName("remove")
        .setDescription("Удалить канал сообщений XP")
    ),

    async execute (interaction) {
        const {guild, options} = interaction;
        const sub = options.getSubcommand();

        const data = await c.findOne({ Guild: guild.id });

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: "У вас нет прав админа.",
                ephemeral: true
            })
        }

        switch (sub) {
            case "add":
                if (data) {
                    await interaction.reply({
                        content: "<:forbidden:1125768285321953371> У вас уже есть система сообщений XP",
                        ephemeral: true
                    })
                } else {
                    const channel = options.getChannel("канал");
                    await c.create({
                        Guild: guild.id,
                        Channel: channel.id
                    });

                    await interaction.reply({
                        content: `Ваша система сообщений настроена в <#${channel.id}> !`,
                        ephemeral: true
                    })
                }
            break;
            case "remove":
                if (data) {
                    await c.deleteMany({ Guild: guild.id });

                    await interaction.reply({
                        content: "Ваша система сообщений XP успешно удалена!",
                        ephemeral: true
                    })
                } else {
                    await interaction.reply({
                        content: "<:forbidden:1125768285321953371> У вас нет системы сообщений XP.",
                        ephemeral: true
                    })
                }
            break;
        }
    }
}