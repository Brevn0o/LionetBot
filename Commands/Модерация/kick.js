const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Кикнуть участника за нарушение.")
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("участник")
                .setDescription("Выберите участника, которого хотите кикнуть.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("причина")
                .setDescription("Причина кика.")
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser("участник");
        const reason = options.getString("причина") || "Нет причины.";

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`Вы не можете кикнуть ${user.username} поскольку у него более высокая роль.`)
            .setColor('Random')

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        

        const errembed = new EmbedBuilder()
            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')
            .setColor("Random")
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers))
       


            return interaction.reply({ embeds: [errembed], ephemeral: true });
        
        await member.kick(reason);
        const embed = new EmbedBuilder()
            .setTitle("**<:emoji_5:1140607910678908938> Кикнут**")
            .setDescription(`Вы успешно кикнули ${user}`)
            .addFields(
                { name: "Причина", value: `${reason}`, inline: true })
            .setColor('Random');

        await interaction.reply({
            embeds: [embed],
        });
    }
}