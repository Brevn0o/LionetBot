const { SlashCommandBuilder } = require('discord.js');

const VCStatsVC = require('../../Schemas/vcstatsvc');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('voicestats')
    .setDescription('Настройте или отключите голосовые каналы для отображения статистики сервера.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Настройка голосовых каналов для отображения ')
        .addChannelOption(option => option.setName('количество_пользователей').setDescription('Голосовой канал для подсчета пользователей.').setRequired(false))
        .addChannelOption(option => option.setName('количество_участников').setDescription('Голосовой канал для подсчета участников (включая ботов)).').setRequired(false))
        .addChannelOption(option => option.setName('количество_ботов').setDescription('Голосовой канал для подсчета ботов.').setRequired(false))
        .addChannelOption(option => option.setName('количество_ролей').setDescription('Голосовой канал для подсчета ролей.').setRequired(false))
        .addChannelOption(option => option.setName('количество_каналов').setDescription('Голосовой канал для количества каналов.').setRequired(false))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Отключить обновление статистики голосового канала..')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      const userCountChannel = interaction.options.getChannel('количество_пользователей');
      const memberCountChannel = interaction.options.getChannel('количество_участников');
      const botCountChannel = interaction.options.getChannel('количество_ботов');
      const roleCountChannel = interaction.options.getChannel('количество_ролей');
      const channelCountChannel = interaction.options.getChannel('количество_каналов');

      if (
        !userCountChannel &&
        !memberCountChannel &&
        !botCountChannel &&
        !roleCountChannel &&
        !channelCountChannel
      ) {
        return interaction.reply('Пожалуйста, выберите хотя бы один вариант для настройки.');
      }

      const guildId = interaction.guild.id;

      try {
        let voiceChannels = await VCStatsVC.findOne({ guildId });
        if (!voiceChannels) {
          voiceChannels = new VCStatsVC({ guildId });
        }

        if (userCountChannel) voiceChannels.userCountChannel = userCountChannel.id;
        if (memberCountChannel) voiceChannels.memberCountChannel = memberCountChannel.id;
        if (botCountChannel) voiceChannels.botCountChannel = botCountChannel.id;
        if (roleCountChannel) voiceChannels.roleCountChannel = roleCountChannel.id;
        if (channelCountChannel) voiceChannels.channelCountChannel = channelCountChannel.id;

        await voiceChannels.save();

        const updateChannels = async () => {
          const guild = interaction.guild;
          const userCountChannel = guild.channels.cache.get(voiceChannels.userCountChannel);
          const memberCountChannel = guild.channels.cache.get(voiceChannels.memberCountChannel);
          const botCountChannel = guild.channels.cache.get(voiceChannels.botCountChannel);
          const roleCountChannel = guild.channels.cache.get(voiceChannels.roleCountChannel);
          const channelCountChannel = guild.channels.cache.get(voiceChannels.channelCountChannel);

          if (userCountChannel) userCountChannel.setName(`👪|Всех: ${guild.memberCount}`);
          if (memberCountChannel)
            memberCountChannel.setName(`😁|Участников: ${guild.members.cache.filter(m => !m.user.bot).size}`);
          if (botCountChannel)
            botCountChannel.setName(`🤖|Ботов: ${guild.members.cache.filter(m => m.user.bot).size}`);
          if (roleCountChannel) roleCountChannel.setName(`🏆|Ролей: ${guild.roles.cache.size}`);
          if (channelCountChannel) channelCountChannel.setName(`🎗️|Каналов: ${guild.channels.cache.size}`);
        };

        updateChannels();
        setInterval(updateChannels, 80000);

        interaction.reply('Голосовые каналы успешно настроены!');
      } catch (error) {
        console.error(error);
        interaction.reply('Произошла ошибка при настройке голосовых каналов.');
      }
    } else if (subcommand === 'disable') {
      const guildId = interaction.guild.id;
      try {
        await VCStatsVC.findOneAndDelete({ guildId });

        // If you have stored the channel IDs in the database, you can also clear them here

        interaction.reply('Обновление статистики голосового канала успешно отключено!');
      } catch (error) {
        console.error(error);
        interaction.reply('Произошла ошибка при отключении обновления статистики голосового канала..');
      }
    }
  },
};

