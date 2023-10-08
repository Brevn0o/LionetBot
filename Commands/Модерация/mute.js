const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Замутить участника.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName("участник")
                .setDescription("Выберите пользователя, которого хотите замутить.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("время")
                .setDescription("Как долго должен длиться мут? Пример: 10s/m/h/d")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("причина")
                .setDescription("В чем причина участника?")
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("участник");
        const member = guild.members.cache.get(user.id);
        const time = options.getString("время");
        const convertedTime = ms(time);
        const reason = options.getString("причина") || "Нет причины";

        const errEmbed = new EmbedBuilder()

            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')

            .setColor("Random")

        const succesEmbed = new EmbedBuilder()
            .setTitle("**<:emoji_5:1140607910678908938>| Замучен**")
            .setDescription(`Успешно замучен ${user}.`)
            .addFields(
                { name: "Причина", value: `> ${reason}`, inline: true },
                { name: "Время", value: `> ${time}`, inline: true }
            )
            .setColor("Random")
            .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: false }); // this if statement is optional (but recommended)

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: false });

        if (!convertedTime)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [succesEmbed], ephemeral: false });
        } catch (err) {
            console.log(err);
        }
    }
}