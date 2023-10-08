const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
const staffSchema = require('../../Schemas/staffSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('application-setup')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Добавьте роль персонала, чтобы иметь возможность выполнять команды персонала.')
    .addChannelOption((option) =>
    option
      .setName('канал')
      .setDescription('Выберите канал, на который должна быть отправлена панель приложений.')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .addChannelOption((option) =>
    option
      .setName('канал-лог')
      .setDescription('Выберите канал, по которому должны отправляться заявки на рассмотрение.')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)
  )
  .addStringOption((option) =>
    option
      .setName('описание')
      .setDescription('Выберите описание для встраивания приложений.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('кнопка')
      .setDescription('Выберите имя для встроенных приложений.')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('эмодзи')
      .setDescription('Выберите стиль, поэтому выберите смайлик.')
      .setRequired(true)
      )
  .addStringOption((option) =>
    option
      .setName('вопрос-1')
      .setDescription('Выберите первый вопрос для заявки.')
      .setRequired(true)
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-2')
      .setDescription('Выберите второй вопрос для заявки.')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-3')
      .setDescription('Выберите третий вопрос для приложения.')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-4')
      .setDescription('Выберите четвертый вопрос для заявки.')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-5')
      .setDescription('Выберите пятый вопрос для заявки.')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-6')
      .setDescription('Выберите шестой вопрос к заявке.')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-7')
      .setDescription('Выберите седьмой вопрос для приложения..')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-8')
      .setDescription('Выберите восьмой вопрос для приложения..')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-9')
      .setDescription('Выберите девятый вопрос для заявки.')
    )
    .addStringOption((option) =>
    option
      .setName('вопрос-10')
      .setDescription('Выберите десятый вопрос для приложения».')
    ),
    async execute(interaction, client) {

        const { guild, options } = interaction;

            const channel = options.getChannel('канал');
            const transcripts = options.getChannel('канал-лог');
            const description = options.getString('описание');
            const button = options.getString('кнопка');
            const emoji = options.getString('эмодзи');
            const question1 = options.getString('вопрос-1');
            const question2 = options.getString('вопрос-2');
            const question3 = options.getString('вопрос-3');
            const question4 = options.getString('вопрос-4');
            const question5 = options.getString('вопрос-5');
            const question6 = options.getString('вопрос-6');
            const question7 = options.getString('вопрос-7');
            const question8 = options.getString('вопрос-8');
            const question9 = options.getString('вопрос-9');
            const question10 = options.getString('вопрос-10');
            const StaffSchema = await staffSchema.findOneAndUpdate(
                { GuildID: guild.id },
                {
                  Channel: channel.id,
                  Transcripts: transcripts.id,
                  Description: description,
                  Button: button,
                  Emoji: emoji,
                },
                {
                  new: true,
                  upsert: true,
                }
              );

              const StaffMessages = require('../../Schemas/staffMessages');

              const filter = { Guild: interaction.guild.id };
              const update = {
                Question1: question1,
                Question2: question2,
                Question3: question3,
                Question4: question4,
                Question5: question5,
                Question6: question6,
                Question7: question7,
                Question8: question8,
                Question9: question9,
                Question10: question10
              };
              const questions = await StaffMessages.findOneAndUpdate(filter, update);

              if (questions) {
                await questions.save();
              } else {
                const newQuestions = await StaffMessages.create({
                  Guild: interaction.guild.id,
                  Question1: question1,
                  Question2: question2,
                  Question3: question3,
                  Question4: question4,
                  Question5: question5,
                  Question6: question6,
                  Question7: question7,
                  Question8: question8,
                  Question9: question9,
                  Question10: question10
                });
                await newQuestions.save();
              }

              await StaffSchema.save();

              const embed = new EmbedBuilder().setDescription(description);
              const buttonshow = new ButtonBuilder()
                .setCustomId('staffButton')
                .setLabel(button)
                .setEmoji(emoji)
                .setStyle(ButtonStyle.Primary);
              await guild.channels.cache.get(channel.id).send({
                embeds: [embed],
                components: [new ActionRowBuilder().addComponents(buttonshow)],
              }).catch(error => {return});
              return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Панель приложений успешно создана.').setColor('Green')], ephemeral: true});
            
    }
}