const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const AutoRole = require('../../Schemas/autoroleSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('При заходе на сервер выдаётся роль')
    .addRoleOption(option =>
      option.setName('роль')
        .setDescription('Роль')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('показать-сообщение')
        .setDescription('Выдалась ли ему роль и это пишет в вашем канале')
        .setRequired(false))
    .addChannelOption(option =>
      option.setName('канал')
        .setDescription('Туда пишется сообщение выдалась ли ему роль')
        .setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return await interaction.reply({ content: ':x: У вас нет разрешений на управление ролями.', ephemeral: true });
    }

    const role = interaction.options.getRole('роль');
    const showMessage = interaction.options.getBoolean('показать-сообщение');
    const channel = interaction.options.getChannel('канал');
      
if (role.position >= interaction.guild.members.resolve(client.user).roles.highest.position) return await interaction.reply({ content: "Роль, которую вы упомянули, слишком высока! Поместите роль бота выше этой роли.", ephemeral: true })
      
    const errembed = new EmbedBuilder()

            .setDescription('У бота нет обходимых прав, пожалуйста, выдайте ему права.')

            .setColor("Random")
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages))
            
            return interaction.reply({ embeds: [errembed], ephemeral: true });    
      
    const autoRole = new AutoRole({
      guildId: interaction.guildId,
      roleId: role.id,
      showMessage: showMessage,
      channelId: channel?.id
    });
    await autoRole.save();

    const reply = `✅ АвтоРоль была настроена на ${role.toString()}${showMessage ? ' и отобразит сообщение' : ''}${channel ? ` в канале ${channel.toString()}` : ''}.`;
    await interaction.reply({ content: reply, ephemeral: true });

  },
};