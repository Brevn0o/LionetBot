const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const AutoRole = require('../../Schemas/autoroleSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeautorole')
    .setDescription('Убрать автороль'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return await interaction.reply({ content: ':x: У вас нет разрешений на управление ролями.', ephemeral: true });
    }

    const autoRole = await AutoRole.findOneAndDelete({ guildId: interaction.guildId });
    if (!autoRole) {
      return await interaction.reply({ content: ':x: Для этого сервера не найдена автороль автозапуска.', ephemeral: true });
    }
    
    await interaction.reply({ content: '✅ АвтоРоль была удалена.', ephemeral: true });
  },
};