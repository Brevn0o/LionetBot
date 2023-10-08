const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("unban")

        .setDescription("Разблокировать пользователя на сервере.")

        .setDMPermission(false)

        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

        .addStringOption(option =>

            option.setName("юзерid")

                .setDescription("Discord ID пользователя, которого вы хотите разбанить.")

                .setRequired(true)

        ),

    async execute(interaction) {

        const { channel, options } = interaction;

        const userId = options.getString("юзерid");

        try {

            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
.setTitle(`<:emoji_5:1140607910678908938> Разбанен`)
                .setDescription(`Успешно разбанен ID ${userId} из сервера`)

                .setColor("Random")

                .setTimestamp();

            await interaction.reply({

                embeds: [embed],

            });

        } catch (err) {

            console.log(err);

            const errEmbed = new EmbedBuilder()

                .setDescription(`Укажите действительный участник ID.`)

                .setColor("Random");

            interaction.reply({ embeds: [errEmbed], ephemeral: true });

        }

    }

}