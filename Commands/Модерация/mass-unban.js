const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-unban')
        .setDMPermission(false)
        .setDescription('Разбанить всех участников на сервере. Используйте с осторожностью!'),
    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'У вас **нет** разрешения на это!', ephemeral: true});

        try {
            
            const bannedMembers = await interaction.guild.bans.fetch();
            
            await Promise.all(bannedMembers.map(member => {
                return interaction.guild.members.unban(member.user.id);
            }));
           
            return interaction.reply({ content: 'Все участники были **разбанены** на сервере.', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Произошла ошибка при **разблокировке** участников.', ephemeral: true });
        }
    }
}