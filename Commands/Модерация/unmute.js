const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Размутить человека")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName("участник")
                .setDescription("Выберите пользователя, которого хотите размутить.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("участник");
        const member = guild.members.cache.get(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription('Что-то пошло не так. Пожалуйста, повторите попытку позже.')
            .setColor("Random")

        const succesEmbed = new EmbedBuilder()
            .setTitle("**<:emoji_5:1140607910678908938>| Размучен**")
            .setDescription(`Был размучен ${user}.`)
            .setColor("Random")
            .setTimestamp();

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true }); // this if statement is optional (but recommended)

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(null);

            interaction.reply({ embeds: [succesEmbed], ephemeral: false });
        } catch (err) {
            console.log(err);
        }
    }
}