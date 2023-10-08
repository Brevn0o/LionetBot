const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nick')
    .setDMPermission(false)
    .setDescription(`Изменить никнейм указанного пользователя.`)
    .addStringOption(option => option.setName('ник').setDescription(`Указанный никнейм станет новым ником указанного пользователя.`).setRequired(true).setMaxLength(32).setMinLength(1))
    .addUserOption(option => option.setName('пользователь').setDescription(`Никнейм указанного пользователя будет изменен.`)),
    async execute(interaction) {

        const nick = await interaction.options.getString('ник');
        const user = await interaction.options.getUser('пользователь');
        const member = await interaction.options.getMember('пользователь');

        if (user === interaction.user || user === null) {

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ChangeNickname)) return await interaction.reply({ content: 'У вас **нет** разрешения на это!!', ephemeral: true});

            await interaction.member.setNickname(nick).catch(err => {
                return interaction.reply({ content: `**Не удалось** изменить свой никнейм! **Проверьте** мои разрешения и **ролевое положение** и повторите попытку..`, ephemeral: true});
            })

            await interaction.reply({ content: `Ваш **никнейм** установлен на "**${nick}**"`, ephemeral: false})

        } else {

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return await interaction.reply({ content: `У вас **нет** разрешения на изменение чужого ника!`, ephemeral: true});
            else {

                await member.setNickname(nick).catch(err => {
                    return interaction.reply({ content: `**Не удалось** изменить ник пользователя ${user}! **Проверьте** мои разрешения и **ролевое положение** и повторите попытку.`, ephemeral: true});
                });
                await interaction.reply({ content: `Вы **успешно** установили никнейм ${member} на "**${nick}**"!`, ephemeral: false})
            }

        }
    }
}